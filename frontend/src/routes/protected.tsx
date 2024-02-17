import { Navigate } from "react-router"

const isUserAuthenticated = (): boolean => {
  const sessionId = localStorage.getItem('easygen-session-status')
  return Boolean(sessionId)
};

export const ProtectedRoute = ({ children }: any) => {
  return isUserAuthenticated() ?
    <>{children}</> :
    <Navigate to="/" />
};