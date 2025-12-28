import { useNavigate } from "react-router-dom";

function useAuth() {
  const navigate = useNavigate();
  const logOutUser = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth/login");
    window.location.reload();
  };

  return { logOutUser };
}

export default useAuth;
