import { useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
export default function AdminRoute() {
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        "http://localhost:3000/auth/authenticateAdmin"
      );
      if (res.data.ok) {
        setAuth({ ...auth, token: res.data.accessToken, user: res.data.user });
      }
    };
    auth?.token ? setAuth({ ...auth }) : authCheck();
  }, [auth?.token]);

  return auth?.token ? <Outlet /> : <Spinner />;
}
