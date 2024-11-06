import React, { createContext, useContext, useState } from 'react';

// Define el tipo para el contexto
interface UserContextType {
  userName: string | null;
  setUserName: (name: string | null) => void;
}

// Crea el contexto con valor inicial undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Componente que provee el contexto a los componentes hijos
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
