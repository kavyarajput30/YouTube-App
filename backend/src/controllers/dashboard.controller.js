import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js"; 
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {id} = req.params;
    const channelInfo = await User.findById(id).select("-password -refreshToken");

    if(!channelInfo){
        throw new ApiError(404, "Channel not found")
    }
    // const allVideos = await Video.find({owner: req.user._id}).select("-owner");
   const pipeline=[
    {
      '$match': {
        'owner': new mongoose.Types.ObjectId(id)
      }
    }, {
      '$lookup': {
        'from': 'likes', 
        'localField': '_id', 
        'foreignField': 'video', 
        'as': 'VideoLikesInfo'
      }
    }, {
      '$project': {
        'VideoLikesInfo.video': 0
      }
    }, {
      '$lookup': {
        'from': 'comments', 
        'localField': '_id', 
        'foreignField': 'video', 
        'as': 'comments'
      }
    },
  ]
    const allVideos =  await Video.aggregate(pipeline);
   const Subscriber = await Subscription.find({channel: req.user._id});

    return res.status(200).json(new ApiResponce(200, "Channel Fetched Successfully", {channelInfo, allVideos, Subscriber}));
})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all videos of the channel
    const {id} = req.params;
    const pipeline = [
        {
          '$match': {
            'owner': new mongoose.Types.ObjectId(id)
          }
        },
        {
          '$lookup': {
            'from': 'likes', 
            'localField': '_id', 
            'foreignField': 'video', 
            'as': 'VideoLikesInfo'
          }
        },
        {
          '$project': {
            'VideoLikesInfo.video': 0
          }
        },
        {
          '$lookup': {
            'from': 'comments', 
            'localField': '_id', 
            'foreignField': 'video', 
            'as': 'comments'
          }
        },
    ]

    const allVideos =  await Video.aggregate(pipeline);

    return res.status(200).json(new ApiResponce(200, "Channel Fetched Successfully", allVideos));


})

export {
    getChannelStats, 
    getChannelVideos
    }