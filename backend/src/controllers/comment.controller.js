import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: {
          path: "$users",
          includeArrayIndex: "0",
        },
      },
      {
        $addFields: {
          username: "$users.username",
          fullname: "$users.fullname",
          avatar: "$users.avatar",
        },
      },
      {
        $project: {
          users: 0,
        },
      },
    ];

    const comments = await Comment.aggregate(pipeline);

    return res
      .status(200)
      .json(new ApiResponce(200, "Comments Fetched Successfully", comments));
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching comments", error));
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userID = req.user._id;
  const { comment } = req.body;

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }

  const createdComment = await Comment.create({
    video: videoId,
    owner: userID,
    content: comment,
  });

  return res
    .status(200)
    .json(new ApiResponce(200, "Comment Added SuccessFully", createdComment));

  // TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { comment } = req.body;

  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!existingComment.owner.equals(req.user._id)) {
    throw new ApiError(400, "You are not authorized to update the comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: comment,
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not Updated");
  }

  res
    .status(200)
    .json(new ApiResponce(200, "Comment updated successfully", updatedComment));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!existingComment.owner.equals(req.user._id)) {
    throw new ApiError(400, "You are not authorized to delete the comment");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment not Deleted");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Comment deleted successfully", deletedComment));
});

export { getVideoComments, addComment, updateComment, deleteComment };
