import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import {Like} from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id

    const existedvideo = await Video.findById(videoId);
    if(!existedvideo){
        throw new ApiError(404, "Video not found")
    }

   const Liked = await Like.create({video: videoId, likedBy: userId});

   if(!Liked){
       throw new ApiError(400, "Failed to like video")
   }
return res.status(200).json(new ApiResponce(200, "Video Liked Successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    const existedComment = await Comment.findById(commentId);
    if(!existedComment){
        throw new ApiError(404, "Comment not found")
    }
    const Liked = await Like.create({comment: commentId, likedBy: userId});
 
    if(!Liked){
        throw new ApiError(400, "Failed to like comment")
    }
 return res.status(200).json(new ApiResponce(200, "Comment Liked Successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id

    const existedTweet = await Tweet.findById(tweetId);
    if(!existedTweet){
        throw new ApiError(404, "Tweet not found")
    }

    const Liked = await Like.create({tweet: tweetId, likedBy: userId});

    if(!Liked){
        throw new ApiError(400, "Failed to like Tweet")
    }
 return res.status(200).json(new ApiResponce(200, "Tweet Liked Successfully"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all the videos liked by a single user
    const UserId = req.user._id;
    
    const pipeline = [
        {
          '$match': {
            'likedBy': new mongoose.Types.ObjectId(UserId), 
            'video': {
              '$exists': true, 
              '$ne': null
            }
          }
        }, {
          '$lookup': {
            'from': 'videos', 
            'localField': 'video', 
            'foreignField': '_id', 
            'as': 'video', 
            'pipeline': [
              {
                '$lookup': {
                  'from': 'users', 
                  'localField': 'owner', 
                  'foreignField': '_id', 
                  'as': 'videoOwnerDetail'
                }
              }, {
                '$project': {
                  'videoOwnerDetail.password': 0, 
                  'videoOwnerDetail.refreshToken': 0, 
                  'videoOwnerDetail.watchHistory': 0, 
                  'videoOwnerDetail._id': 0, 
                  'videoOwnerDetail.createdAt': 0, 
                  'videoOwnerDetail.updatedAt': 0
                }
              }
            ]
          }
        }
      ]

      const likedVideos = await Like.aggregate(pipeline);


      if(likedVideos.length === 0){
        throw new ApiError(404, "No liked videos found")
      }

     return res.status(200).json(new ApiResponce(200, "Fetched all Liked Videos", likedVideos));

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}