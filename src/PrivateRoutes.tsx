import { Outlet, Navigate } from "react-router-dom";
import { loginRoute } from "./pages/routes";
import { User } from "firebase/auth";

type PrivateRoutesProps = {
  user: User | null;
};

export function PrivateRoutes(props: PrivateRoutesProps) {
  return props.user ? <Outlet /> : <Navigate to={loginRoute} />;
}
