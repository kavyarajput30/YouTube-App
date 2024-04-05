import axios from "axios";
import { useState } from "react";
const Upload=()=> {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null
});

const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: files ? files[0] : value
    }));
};
const handleAddVideo = async (e) => {
    e.preventDefault();
    // Handle form submission
   const response = await axios.post('http://localhost:8000/api/v1/videos', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    })
   
if(response.data.success){
alert('Video Uploaded Successfully');
setFormData({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null
})
  
}
else{
    console.log('something went wrong');
}
    // Add logic to submit formData to the server
};


    return (
        <div style={{width:"60%", margin:" 20px auto"}}>
      <h1 className="mb-4 text-center">Upload A Video</h1>
        <form className="border rounded p-3">
        <div className="mb-3">
          <label className="form-label">Video</label>
          <input type="file" className="form-control" aria-describedby="emailHelp" name='videoFile' onChange={handleChange} required/>
        </div>
        <div className="mb-3">
          <label  className="form-label">Thumbnail</label>
          <input type='file' className="form-control" name='thumbnail' onChange={handleChange} required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" placeholder="Enter Title of your Video" name="title" onChange={handleChange} required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows='3' placeholder="Enter Information of your Video" name="description" onChange={handleChange} required>
          </textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3"  onClick={handleAddVideo}>Add</button>
      </form>
      </div>
    )
}

export default Upload
