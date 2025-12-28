import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ReduxProviderProps {
  readonly children: ReactNode;
}
export const Protectedroute = ({ children }: ReduxProviderProps) => {
  const isLoggedIn = true;
  // const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  console.log("isLoggedIn", isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};
