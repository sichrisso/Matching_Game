import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: { playerName: "", playerID: "" },
  setUserInfo: (playerName, playerID) => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { playerName: "", playerID: "" };
  });

  const setUserInfo = (playerName, playerID) => {
    const updatedUser = { playerName, playerID };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthInfo = () => {
  return useContext(AuthContext);
};
