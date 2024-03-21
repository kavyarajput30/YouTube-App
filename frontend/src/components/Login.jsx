import styles from "../../styles/login.module.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
// import { Navigate } from "react-router-dom";
const LoginPage = () => {
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false); // For feedback
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
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
                "Content-Type": "application/json"
            }
        }
      );
      if(response.data.success){
      setRegistrationStatus(true); // Update status
      setUsername("");
      setPassword("");
      }

    } catch (error) {
      setRegistrationStatus(false);
      console.error(error);
    }
  };

    return(
        <div className={styles.form_container}>
             {registrationStatus && <Navigate to="/home" />}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}/>

                </div>
                <div>
                <label htmlFor="password">Password</label>
                    <input type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <button type="submit">Login</button>

                </div>
                <div >
                <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage 