import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SignInPage, SignUpPage } from 'src/pages'
import { ProtectedRoute } from './protected'

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
              <SignUpPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Oops! Page not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
}
