import styles from "./Login.module.css";
import { useState } from "react";

import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";

const BASE_URL = "http://localhost/API";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleSignup(event) {
    event.preventDefault();
    const newUser = {
      email,
      password,
      passwordConfirm,
    };
    signup(newUser);
  }
  async function signup(newUser) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/signup.php`, {
        method: "POST",
        headers: { "Content-Type": "aplication/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      if (data.success) navigate("/login");
    } catch {
      setError("Something is wrong with fetching data!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.login} onSubmit={handleSignup}>
      <PageNav />
      <form className={styles.form}>
      {error ? <Message message={error} /> : null}
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="email@email.com"
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

        <div className={styles.row}>
          <label htmlFor="passwordConfirm">Password</label>
          <input
            type="password"
            id="passwordConfirm"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
            placeholder="Confirm Password"
          />
        </div>

        <div>
          <Button type="primary">{isLoading ? "Wait.." : "Sign Up"}</Button>
        </div>
      </form>
    </main>
  );
}
