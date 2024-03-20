import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloundinary from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
 const pipeline= [
  {
    '$match': {
      '$or': [
        {
          'title': {
            '$regex': query, 
            '$options': 'i'
          }
        }, {
          'description': {
            '$regex': query, 
            '$options': 'i'
          }
        }
      ]
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': 'owner', 
      'foreignField': '_id', 
      'as': 'videoOwnerDetail'
    }
  }, {
    '$addFields': {
      'videoOwnerDetail': {
        '$map': {
          'input': '$videoOwnerDetail', 
          'as': 'user', 
          'in': {
            'username': '$$user.username', 
            'fullname': '$$user.fullname', 
            'avatar': '$$user.avatar'
          }
        }
      }
    }
  }
]
  const allVideos = await Video.aggregate(pipeline);
  if (allVideos.length === 0) {
    // Return a 404 error response if no videos were found
    throw new ApiError(404, "No videos found");
  }
  return res.status(200).json(new ApiResponce(200, "All Videos", allVideos));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const data = req.body;
  const title = data["title"].trim();
  const description = data["description"].trim();
  const userId = req.user._id;
  const videolocalPath = await req.files?.videoFile[0]?.path;
  const thumbnaillocalpath = await req.files?.thumbnail[0]?.path;
  if (!videolocalPath) {
    throw new ApiError(400, "Video is required");
  }
  if (!thumbnaillocalpath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // upload them on cloudniary
  const videoFile = await uploadOnCloundinary(videolocalPath);
  const thumbnailFile = await uploadOnCloundinary(thumbnaillocalpath);
  if (!videoFile) {
    throw new ApiError(500, "video upload failed please try again");
  }
  if (!thumbnailFile) {
    throw new ApiError(500, "thumbNail upload failed please try again");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnailFile.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    owner: userId,
  });
  const CreatedVideo = await Video.findById(video._id);
  if (!CreatedVideo) {
    throw new ApiError(500, "Video creation failed during register");
  }
  return res
    .status(201)
    .json(new ApiResponce(201, "Video created successfully", CreatedVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  return res
    .status(200)
    .json(new ApiResponce(200, "Video Fetched SuccessFully", video));
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const thumbnaillocalpath = req.file?.path;
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "You are not authorized to update this video");
  }

  const thumbnailFile = await uploadOnCloundinary(thumbnaillocalpath);
  if (!thumbnailFile) {
    throw new ApiError(500, "ThumbNail upload failed please try again");
  }

  const updatedvideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnailFile.url,
        title: title,
        description: description,
      },
    },
    { new: true }
  );
  if (!updatedvideo) {
    throw new ApiError(500, "Video update failed please try again");
  }  
  //TODO: update video details like title, description, thumbnail
  return res
    .status(200)
    .json(new ApiResponce(200, "Video updated successfully", updatedvideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }


  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "You are not authorized to delete this video");
  }  
  
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new ApiError(500, "Video delete failed please try again");
  }

  return res.status(200).json(new ApiResponce(200, "Video deleted successfully"));


});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    
    throw new ApiError(404, "Video not found");
  }

  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "You are not authorized to update this video");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true }
  )

  return res.status(200).json(new ApiResponce(200, "Video publish status changed successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
