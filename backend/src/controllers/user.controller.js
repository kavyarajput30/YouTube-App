import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import uploadOnCloundinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Error while generating Tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // client side se data lekar anaa h
  const { username, email, password, fullname } = req.body;
  // console.log(req.body);
  // console.log(req.files);
  //   console.log(username, email,  password);
  // validation - not empty

  // if(fullname === ''){
  //    throw new ApiError(400,"Fullname cannot be empty")
  // }

  if (
    [fullname, email, password, username].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are mandatory or required");
  }

  //  check if user already exist: username, email
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User Already exist");
  }

  // check avatar is present or not
  const avatarlocalPath = await req.files?.avatar[0]?.path;
  // const coverlocalPath = await  req.files?.coverImage[0]?.path;
  let coverlocalPath;

  if (
    req.files &&
    req.files.coverImage &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverlocalPath = await req.files.coverImage[0].path;
    // console.log(req.files.coverImage);
  }

  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload them on cloudniary
  const avatar = await uploadOnCloundinary(avatarlocalPath);

  const coverImage = await uploadOnCloundinary(coverlocalPath);
  // check if avatar is uploaded or not
  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed please try again");
  }
  // create user object - create entry in database

  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  // check for user creation
  // remove password and refresh token from responce object

  const CreatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!CreatedUser) {
    throw new ApiError(500, "User creation failed during register");
  }
  // return responce
  return res
    .status(201)
    .json(
      new ApiResponce(
        201,
        "User created successfully",
        CreatedUser,
        true,
        false
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //  get data from client
  const { username, email, password } = req.body;
  console.log(req.body);
  if (!(username || email)) {
    throw new ApiError(400, "Give username or email id");
  }
  //  validate data if that user is present in our databse or not
  // find user
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // check  password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect");
  }
  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookies options
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(200, "User Logged in Sucessfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
  // if validate give thm acesses and refresh token

  // send cookies
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "User logout Sucessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  console.log(incomingRefreshToken);
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorize request");
  }
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // Retrieve the user based on the decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log(user);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    // Check if the refresh token matches the stored refresh token for the user
    if (user.refreshToken !== incomingRefreshToken) {
      console.log("different refresh token");
      throw new ApiError(401, "Refresh Token is Used or Expire");
    }
    console.log("same refresh token");
    const options = {
      httpOnly: true,
      secure: true,
    };
    // Generate new access and refresh tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    console.log("new refresh token" + newRefreshToken);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponce(200, "Access Token Refreshed", {
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (err) {
    throw new ApiError(500, "Error occured while generating access token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponce(200, "Password Chnaged Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, "Current User fetched Successfully", req.user);
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "Please provide fullname and email");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullname, email } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Account Details Updated Successfully", user));
});

const updateUseravatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar File is Missing");
  }

  const avatar = await uploadOnCloundinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(401, "Error While Uploading Avatar on Cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Avatar Updated Sucessfully", user));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const CoverImageLocalPath = req.file?.path;
  if (!CoverImageLocalPath) {
    throw new ApiError(401, "Cover Image is Missing");
  }

  const coverImage = await uploadOnCloundinary(CoverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(401, "Error While Uploading Cover Image on Cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Cover Image Updated Sucessfully", user));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "UserName is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        isSubscribed: 1,
        channelsSubscribedToCount: 1,
        coverImage: 1,
        avatar: 1,
        email: 1,
      },
    },
  ]);
  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(200, "User Channel fetched Successfully", channel[0])
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
 const user = await User.aggregate(
  [
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },{
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:'_id',
        as:"watchHistory",
        pipeline:[{
          $lookup:{
            from:"users",
            localField:'owner',
            foreignField:'_id',
            as:"owner",
            pipeline:[
              {
                $project:{
                  fullname:1,
                  username:1,
                  avatar:1
                }
              }
            ]
          }
        },{
          $addFields:{
            owner:{
              $first:"$owner"
            }
          }
        }
      ]
      }
    },{

    }
  ]
 )


return res.status(200).json(new ApiResponce(200,"Watch History fetched successfully", user[0].watchHistory))


});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUseravatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory
};
