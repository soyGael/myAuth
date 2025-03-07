import { useContext, createContext } from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext({
  signIn: (email) => null,
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

  const createToken = (email) => {
    const payload = { email, timestamp: Date.now() };

    const stringPayload = JSON.stringify(payload);

    const base64Encode = (str) => {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(str);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      return base64String;
    };

    const tokenAuth = base64Encode(stringPayload);

    setToken(tokenAuth)
    return tokenAuth;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: (correo) => {
          if (session) return;
          setSession({ correo: correo });
        },
        signOut: () => {
          if (!session) return;
          setSession(null);
          setToken(null);
        },
        session,
        isLoading,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
