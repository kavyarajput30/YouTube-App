import axios from "axios";
import { useState, useEffect } from "react";

const Playlist = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const createPlaylist = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8000/api/v1/playlist", data, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
   

    if (res.data.success) {
        setData({ name: "", description: "" });
    }

  };

  return (
    <div className="m-5">
      <h1>Create New playlist</h1>
      <div>
        <form onSubmit={createPlaylist}>
          <label htmlFor="playlistName" className="form-label">
            Playlist Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="playlistName"
            value={data.name}
            placeholder="Playlist Name"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="form-control"
            value={data.description}
            placeholder="Description"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary mt-3">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Playlist;
