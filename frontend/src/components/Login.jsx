import styles from "../../styles/login.module.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext.js";
const LoginPage = () => {
  const { setUserWithStorage } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setRegistrationStatus(false);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setUserWithStorage(response.data.data.user); 
        setRegistrationStatus(true);
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setRegistrationStatus(false);
      console.error(error);
    }
  };
// console.log(user);
  return (
    <div className={styles.form_container}>
      {registrationStatus && <Navigate to="/" />}
      <h1 className="text-center mb-5">Login Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        <div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
