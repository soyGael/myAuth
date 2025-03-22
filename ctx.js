import { useContext, createContext } from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext({
  signIn: (email, token) => null, // Modificado para aceptar el token
  signOut: () => null,
  myToken: null,
  session: null,
  isLoading: false,
});

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [token, setToken] = useStorageState("myToken");

  return (
    <AuthContext.Provider
      value={{
        signIn: (correo, newToken) => { 
          if (session) return; 
          setSession({ correo }); 
          setToken(newToken); 
        },
        signOut: () => {
          if (!session) return;
          setSession(null); 
          setToken(null); 
        },
        session,
        isLoading,
        myToken: token, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
