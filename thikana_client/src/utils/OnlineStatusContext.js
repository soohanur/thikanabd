import React, { createContext, useContext, useState } from "react";

export const OnlineStatusContext = createContext([]);

export function OnlineStatusProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <OnlineStatusContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatusContext() {
  return useContext(OnlineStatusContext);
}
