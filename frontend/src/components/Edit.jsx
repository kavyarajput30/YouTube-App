import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const Edit = () => {
    const {id } = useParams();
    const [video, setVideo] = useState({
        title: "",
        description: "",
        thumbnail: "",
    });
    const getVideoInfo = async () => {
        const res = await axios.get(`http://localhost:8000/api/v1/videos/${id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            console.log(res.data.data);
            setVideo({
                title: res.data.data.title,
                description: res.data.data.description,
                thumbnail: res.data.data.thumbnail,
            })
          }
    }
    const handleThumbnailChange = (e) => {
        setVideo({ ...video, thumbnail: e.target.files[0] }); // Update thumbnail with the selected file
    };
    useEffect(() => {
       getVideoInfo();
       
    },[]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // Create a FormData object
        formData.append("title", video.title);
        formData.append("description", video.description);
        formData.append("thumbnail", video.thumbnail); // Append the thumbnail file to the FormData

        // Send the formData object with the POST request
        const res = await axios.patch(`http://localhost:8000/api/v1/videos/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data for file upload
            },
        });

        if (res.data.success) {
            console.log("Video updated successfully");
            Navigate(`/home`);
        }
    };



    return (
       <div>
       <h1>Edit Video</h1> 
       <form encType="multipart/form-data" onSubmit={handleSubmit}>
           <div>
            <label className="form-label">Title</label>
               <input type="text" name="title" value={video?.title} className="form-control" onChange={(e)=>{
                setVideo({...video, title: e.target.value})
               }}/>
           </div>
           <div>
               <label className="form-label">Description</label>
               <input type="text" name="description" value={video?.description} onChange={(e)=>{setVideo({...video, description: e.target.value})}}/>
           </div>
           <div >
            <p>Old Thumbnail</p>
            <img src={video?.thumbnail} alt="thumbnail" width={200}></img>
           </div>
           <div>
                    <label className="form-label">Thumbnail</label>
                    <input type="file" name="thumbnail" onChange={handleThumbnailChange} /> {/* Use onChange to handle file selection */}
                </div>
           <div>
               <button>Submit</button>
               </div>
       </form>
       </div>
    )
}

export default Edit ;
