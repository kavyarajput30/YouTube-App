import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

    const getAllVideos = asyncHandler(async (req, res) => {
        const pipeline = [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "video",
              as: "likes"
            }
          },
          {
            $addFields: {
              totalLikes: { $size: "$likes" }
            }
          }
        ];
      
        const videos = await Video.aggregate(pipeline);
        // console.log(videos);
      
        if (videos.length === 0) {
          throw new ApiError(404, "No videos found");
        }
      
        return res.status(200).json(new ApiResponce(200, "All Videos Fetched Successfully", videos));
      });


export {getAllVideos}