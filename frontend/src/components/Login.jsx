import styles from "../../styles/login.module.css";

const LoginPage = () => {
    return(
        <div className={styles.form_container}>
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username"/>

                </div>
                <div>
                <label htmlFor="password">Password</label>
                    <input type="password" id="password"/>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage 