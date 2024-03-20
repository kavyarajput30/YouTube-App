import mongoose from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiResponce from "../utils/ApiResponce.js"
import {ApiError} from "../utils/ApiError.js"
import  {Subscription} from "../models/subscription.model.js"
import { User } from "../models/user.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel Id")
    }
    // TODO: toggle subscription
    const UserId = req.user._id


    const existingSubscription = await Subscription.findOne({
        subscriber: UserId,
        channel: channelId
    });

    if (existingSubscription) {
        // User is already subscribed to the channel
        return res.status(200).json(new ApiResponce(200, "Already Subscribed"));
    }


  const createdSubscription = await Subscription.create({
        subscriber: UserId,
        channel: channelId
    })
    if(!createdSubscription){
        throw new ApiError(400, "Failed to subscribe to channel")
    }

    return res.status(200).json(new ApiResponce(200, "Subscribed Successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel Id");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel does not Exist");
    }

    const subscribers = await Subscription.find({ channel: channelId });

    if (subscribers.length === 0) {
        throw new ApiError(404, "No Subscribers found");
    }

    return res.status(200).json(new ApiResponce(200, "Subscribers Fetched Successfully", subscribers));
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber Id");
    }
    const AllChannels = await Subscription.find({ subscriber: subscriberId });
    if(AllChannels.length === 0){
        throw new ApiError(400, "Failed to fetch channels")
    }
    return res.status(200).json(new ApiResponce(200, "Channels Fetched Successfully", AllChannels))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}