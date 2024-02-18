import { ReactNode } from 'react'
import { Navigate } from "react-router";
import { AppRoutes } from 'src/utils/constants'

interface IProtecteRouteProps {
  canActivate: () => boolean
  fallback: (typeof AppRoutes)[keyof typeof AppRoutes]
  children: ReactNode;
}
export const ProtectedRoute = (props: IProtecteRouteProps) => {
  const { canActivate, children, fallback } = props

  return canActivate() ?
    <>{children}</> :
    <Navigate to={fallback} />
};