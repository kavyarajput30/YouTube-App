import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    console.log(name);
    console.log(description);
    const userId = req.user._id;
    console.log(userId);

 const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: userId
})

if(!playlist){
    throw new ApiError(400, "Playlist is not created");
}
console.log(playlist);

    return res.status(200).json(new ApiResponce(200, "Playlist created Successfully", playlist));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const allPlayLists = await Playlist.find({owner: userId});

    if (allPlayLists.length === 0) {
        throw new ApiError(404, "No playlists found for this user");
    }
    //TODO: get user playlists
    return res.status(200).json(new ApiResponce(200, "Fetched User Playlists Successfully",allPlayLists));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponce(200, "Fetched Playlist Successfully", playlist));
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

   const playlist = await Playlist.findById(playlistId);

    if (!playlist || !req.user._id.equals(playlist.owner)) {
        throw new ApiError( 400, "You are not authorized to add video to playlist");
      }  
    
      const isVideoInPlaylist = playlist.videos.includes(videoId);
      if (isVideoInPlaylist) {
          throw new ApiError(400, "Video already exists in the playlist");
      }

    // Update the playlist by pushing the videoId into the videos array
    const UpdatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $push: { videos: videoId } },
        { new: true } // Set { new: true } to return the updated playlist
    );

    // TODO: add video to playlist

    return res.status(200).json(new ApiResponce(200, "Video added to playlist successfully", UpdatedPlaylist));

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist = await Playlist.findById(playlistId);
     // Find the playlist
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    // Check if the requesting user is authorized to remove videos from the playlist
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError( 400, "You are not authorized to remove video from playlist");
      } 

    // Check if the video exists in the playlist  
    const isVideoInPlaylist = playlist.videos.includes(videoId);
    if (!isVideoInPlaylist) {
        throw new ApiError(400, "Video does not exist in the playlist");
    }
    // Remove the video from the playlist
    playlist.videos.pull(videoId);
   
    await playlist.save();
    // Return success response
    return res.status(200).json(new ApiResponce(200, "Video removed from playlist successfully", playlist));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError( 400, "You are not authorized to delete playlist");
      } 

    await  Playlist.findByIdAndDelete(playlistId);
    
    return res.status(200).json(new ApiResponce(200, "Playlist deleted successfully"));
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError( 400, "You are not authorized to update playlist");
      } 
    playlist.name = name
    playlist.description = description
    await playlist.save()
    return res.status(200).json(new ApiResponce(200, "Playlist updated successfully", playlist));


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}