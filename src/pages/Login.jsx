import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

import PageNav from "../components/PageNav";
import Button from "../components/Button";
import Message from "../components/Message";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const { isLoading, error, login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const loginUser = {
      email,
      password,
    };
    login(loginUser);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", {replace: true});
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
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
            required
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
            required
          />
        </div>

        <div>
          <Button type="primary">{isLoading ? "Wait.." : "Log in"}</Button>
        </div>
      </form>
    </main>
  );
}
