import { Link } from "react-router-dom";
import styles from "../../styles/header.module.css";
import { useState } from "react";
import axios from "axios";
const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allvideos, setAllVideos] = useState([]);
  async function searchQueryFunction(e) {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/videos?query=${searchQuery}`
      );
      if (response) {
        let allvideos = response.data.data;
        setAllVideos(allvideos);
        console.log(allvideos);
      }
    } catch (err) {
      console.log("Error Fetching Data");
    }
  }
  async function handleLogout() {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        window.location.href = "/login";
      }
    } catch (e) {
      console.log(e);
    }
  }

  console.log("Header 1");
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MeTube
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/tweet">
                Tweet
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/playlist">
                Playlist
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " aria-current="page" to="/upload">
                Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search" onSubmit={searchQueryFunction}>
            <input
              className="form-control me-2 sm-2"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="query"
              id="query"
              autoComplete="off"
              aria-label="Search"
            />
            <button className="btn btn-outline-success btn-sm" type="submit">
              Search
            </button>
          </form>

          <ul className="navbar-nav ms-auto mr-auto mb-2 mb-lg-0">
          <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                to="/login"
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                to="/register"
              >
                Register
              </Link>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Header;
