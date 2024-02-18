import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SignInPage, SignUpPage, HomePage } from "src/pages";
import { ProtectedRoute } from "./protected";
import { ErrorBoundary } from 'src/components'
import { persistantStorageService } from 'src/services'
import { constants } from 'src/utils'

const { AppRoutes: _AppRoutes } = constants 
const isUserAuthenticated = (): boolean => {
  const sessionId = persistantStorageService.getAppSessionId()
  return Boolean(sessionId);
};

const Redirector = (): JSX.Element => {
  return isUserAuthenticated() ? 
    <Navigate to={_AppRoutes.Home} /> :
    <Navigate to={_AppRoutes.SignIn} />

}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Redirector />} />
        <Route path="sign-in" element={
          <ProtectedRoute canActivate={() => !isUserAuthenticated()} fallback={_AppRoutes.Home}>
            <SignInPage />
          </ProtectedRoute>
        } />
        <Route path="sign-up" element={
          <ProtectedRoute canActivate={() => !isUserAuthenticated()} fallback={_AppRoutes.Home}>
            <SignUpPage />
          </ProtectedRoute>
        } />
        <Route
          path="home"
          element={
            <ProtectedRoute canActivate={isUserAuthenticated} fallback={_AppRoutes.SignIn}>
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Oops! Page not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
};
