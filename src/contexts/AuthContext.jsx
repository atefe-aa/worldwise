import { createContext, useReducer } from "react";

const BASE_URL = "http://localhost/API";

const AuthContext = createContext();

const initialState = {
  isLoading: false,
  isSignedup: false,
  user: null,
  isAuthentecated: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "signedup":
      return { ...state, isLoading: false, isSignedup: true, error: "" };
    case "login":
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return { ...state, isLoading: false, user: null, isAuthentecated: false };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown Action!");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, isSignedup, error, isLoading }, dispatch] =
    useReducer(reducer, initialState);
  //   const navigate = useNavigate();

  async function signup(newUser) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/signup.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (data.error) dispatch({ type: "rejected", payload: data.error });
      if (data.success) dispatch({ type: "signedup" });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with signing up!",
      });
    }
  }

  async function login(loginData) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.error) dispatch({ type: "rejected", payload: data.error });
      if (data.success) dispatch({ type: "login", payload: data.user });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with authenticating!",
      });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSignedup,
        error,
        login,
        signup,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
