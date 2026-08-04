import { createContext } from 'react';

// Contexto global de autenticación.
// El valor real lo provee AuthProvider y se consume con el hook useAuth().
export const AuthContext = createContext(null);
