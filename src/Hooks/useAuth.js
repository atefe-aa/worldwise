import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useAuth(){
    const context = useContext(AuthContext);

    if (context === undefined) throw new Error("AuthContext is used outside AuthProvider.");
    return context;
}

export {useAuth};