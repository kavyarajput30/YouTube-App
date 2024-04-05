import styles from "../../styles/video.module.css";
import { useParams , useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Video = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [video, setVideo] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
const [isPublished , setIsPublished] = useState(false);

  const style={
    display:"hidden"
  }
  async function getVideo() {
    const res = await axios.get(`http://localhost:8000/api/v1/videos/${id}`, {
      withCredentials: true,
    });
    if (res.data.success) {
      console.log(res.data.data);
      setVideo(res.data.data);
    }
  }
  async function getVideoComments() {
    const res = await axios.get(
      `http://localhost:8000/api/v1/comments/${id}`,
      {
        withCredentials: true,
      }
    );
    if (res.data.success) {
      // console.log(res.data.data);
      setComments(res.data.data);
    }
  }
  useEffect(() => {
    getVideo();
    getVideoComments();
  }, []);
  const toggleLike = async () => {
    const res = await axios.post(
      `http://localhost:8000/api/v1/likes/toggle/v/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.data.success) {
      console.log(res.data);
      getVideo();
    }
  };
  const toogleCommentLike = async (commentId) => {
    // console.log(commentId);
    const res = await axios.post(
      `http://localhost:8000/api/v1/likes/toggle/c/${commentId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.data) {
     console.log(res.data)
    }
  }

  const deleteComment = async (commentId) => {
    const res = await axios.delete(
      `http://localhost:8000/api/v1/comments/c/${commentId}`,
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      console.log(res.data.data);
      getVideoComments();
    }else{
      console.log("Not Authorize to delete this comment");
    }
  }

  const editComment = async (commentId) => {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/comments/c/${commentId}`,
      { comment: comment }, // Request body
      {
        headers: { // Corrected key to lowercase
          "Content-Type": "application/json",
        },
        withCredentials: true, // Included within the same object
      }
    );
    if (res.data.success) {
      console.log(res.data);
      getVideoComments();
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    console.log(comment);
    const res = await axios.post(
      `http://localhost:8000/api/v1/comments/${id}`,
      { comment: comment }, // Request body
      {
        headers: { // Corrected key to lowercase
          "Content-Type": "application/json",
        },
        withCredentials: true, // Included within the same object
      }
    );
    if (res.data.success) {
      console.log(res.data.data);
      getVideoComments();
    }
}

const deleteVideo = async () => {
  try {
      const res = await axios.delete(`http://localhost:8000/api/v1/videos/${id}`, {
          withCredentials: true
      });
      console.log(res.data); // Log the response to see if there are any error messages or status codes
      if (res.status === 200) {
        setIsPublished(true);
    }
  } catch (error) {
      console.error("Error deleting video:", error);
  }
}

  // console.log(video)
  return (
    <div className={styles.main_div}>
      {isPublished && (
        <navigate to='/home'/>
      )}
      <video
        controls
        src={video?.videoFile}
        className={styles.video}
        muted
        loop
        autoPlay
        alt="video"
      ></video>
      <div style={{ display: "flex" }}>
        <div>
          <button onClick={toggleLike}>❤️</button>12345
        </div>
        <div>
          <button>👁️</button>12345
        </div>
      </div>
      <h1>{video?.title}</h1>
      <p>{video?.description}</p>
      <p>Created By : {video?.owner?.fullname}</p> <p><button>Subscribe to {video?.owner?.username}</button></p>
      <p>Uploaded on : {video?.createdAt}</p>
      <Link to={`/edit/${id}`}>Edit Video</Link>
      <button onClick={deleteVideo}>Delete Video</button>
      <div>
        <h1>All Comments</h1>
       {comments?.map((comment) => (
         <div className="border p-3 w-50 mb-3" key={comment._id}>
           <p>{comment.content}</p>
           <p>{comment.createdAt}</p>
          <p>{comment.fullname}</p>
          <button onClick={(id)=>{toogleCommentLike(comment._id)}}>Like</button>
          <button onClick={(id)=>{deleteComment(comment._id)}}>Delete</button>
          <form className="edit-form" style={style}>
            <label>Edit Comment</label>
            <input type='text' name='content' onChange={(e) => setComment(e.target.value)}/>
            <button onClick={(id)=>{editComment(comment._id)}}>Add</button>
          </form>

         </div>
       ))}
      
      </div>
      <div>
        <h1>Add Comment</h1>
        <form onSubmit={addComment}>
          <input type="text" className="form-control" name="content" placeholder="Add Comment" required onChange={(e) => setComment(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Video;
