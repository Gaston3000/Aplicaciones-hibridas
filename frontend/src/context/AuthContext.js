import { createContext } from 'react';

// El contexto donde vive la sesión.
// El valor lo pone AuthProvider y se lee con el hook useAuth().
export const AuthContext = createContext(null);
