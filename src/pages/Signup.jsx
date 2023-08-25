import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

import PageNav from "../components/PageNav";
import Button from "../components/Button";
import Message from "../components/Message";

export default function Signup() {
  // PRE-FILL FOR DEV PURPOSES

  const navigate = useNavigate();
  const { signup, isLoading, error, isSignedup } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleSignup(event) {
    event.preventDefault();
    const newUser = {
      name,
      email,
      password,
      passwordConfirm,
    };
    signup(newUser);
  }

  useEffect(
    function () {
      if (isSignedup) navigate("/login", {replace: true});
    },
    [isSignedup, navigate]
  );

  return (
    <main className={styles.login} onSubmit={handleSignup}>
      <PageNav />
      <form className={styles.form}>
        {error ? <Message message={error} /> : null}
        <div className={styles.row}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="email@email.com"
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

        <div className={styles.row}>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
            placeholder="Confirm Password"
            required
          />
        </div>

        <div>
          <Button type="primary">{isLoading ? "Wait.." : "Sign Up"}</Button>
        </div>
      </form>
    </main>
  );
}
