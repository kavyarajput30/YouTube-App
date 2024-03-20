import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiResponce from "../utils/ApiResponce.js"
import {ApiError} from "../utils/ApiError.js"





const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId = req.user._id
  const createdTweet= await Tweet.create({
        content: content,
        owner: userId
    })
    if(!createdTweet){
        throw new ApiError(400, "Failed to create Tweet")
    }

    return res.status(200).json(new ApiResponce(200, "Tweet Created Successfully", createdTweet))
    


})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User Id")
    }
  const allTweets= await Tweet.find({owner: userId});
  if(allTweets.length ===0){
      throw new ApiError(400, "Failed to get Tweets")
  }

  return res.status(200).json(new ApiResponce(200, "Fetched Users Tweet Successfully", allTweets))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body

    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id")
    }
   const tweet = await Tweet.findById(tweetId);
   if (!tweet) {
    throw new ApiError(404, "tweet not found");
}

// Check if the requesting user is authorized to remove videos from the playlist
if (!req.user._id.equals(tweet.owner)) {
    throw new ApiError( 400, "You are not authorized to update the tweet");
  } 


 const updatedTweet=  await Tweet.findByIdAndUpdate({_id: tweetId}, {content: content}, {new: true})

 if(!updatedTweet){
     throw new ApiError(400, "Failed to update Tweet")
 }
 return res.status(200).json(new ApiResponce(200, "Tweet Updated Successfully", updatedTweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id")
    }

    const tweet =await Tweet.findById(tweetId);

    if (!tweet) {
     throw new ApiError(404, "tweet not found");
 }
 // Check if the requesting user is authorized to remove videos from the playlist
 if (!req.user._id.equals(tweet.owner)) {
     throw new ApiError( 400, "You are not authorized to Delete the tweet");
   } 

   
 const deletedTweet=  await Tweet.findByIdAndDelete({_id: tweetId})

 if(!deletedTweet){
     throw new ApiError(400, "Failed to delete Tweet")
 }
 return res.status(200).json(new ApiResponce(200, "Tweet Deleted Successfully", deletedTweet))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}