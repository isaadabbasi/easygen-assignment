import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SignInPage, SignUpPage, HomePage } from "src/pages";
import { ProtectedRoute } from "./protected";
import { ErrorBoundary } from 'src/components'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<PathFinder />} /> */}
        <Route index element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route
          path="home"
          element={
            <ProtectedRoute>
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
