import { Navigate } from "react-router";
import { persistantStorageService } from 'src/services'

const isUserAuthenticated = (): boolean => {
  const sessionId = persistantStorageService.getAppSessionId()
  return Boolean(sessionId);
};

export const ProtectedRoute = ({ children }: any) => {
  return isUserAuthenticated() ?
    <>{children}</> :
    <Navigate to="/" />
};