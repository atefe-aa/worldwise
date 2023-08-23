import styles from "./Login.module.css";
import { useState } from "react";

import PageNav from "../components/PageNav"
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";

const BASE_URL = "http://localhost/API";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


function handleLogin(e){
  e.preventDefault();
  const loginUser = {
    email,
    password,
  };
  login(loginUser);
}
async function login(loginUser) {
  try {
    setIsLoading(true);
    const res = await fetch(`${BASE_URL}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(loginUser),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    if (data.success) navigate("/app");
  } catch {
    setError("Something is wrong with fetching data!");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <main className={styles.login} >
      <PageNav />
      <form className={styles.form} onSubmit={handleLogin}>
      {error ? <Message message={error} /> : null}
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
        </div>

        <div>
          <Button type="primary">{isLoading ? "Wait.." : "Log in"}</Button>
        </div>
      </form>
    </main>
  );
}
