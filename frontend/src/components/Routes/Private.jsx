// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/Auth";
// import { Outlet } from "react-router-dom";
// import axios from "axios";
// import Spinner from "../Spinner";


// export default function PrivateRoute() {
//   const [ok, setOk] = useState(false);
//   const [auth, setAuth] = useAuth();

//   useEffect(() => {
//     const authCheck = async () => {
//       const res = await axios.get("http://localhost:3000/auth/authenticate");
//       if (res.data.ok) {
//         setOk(true);
//       } else {
//         setOk(false);
//       }
//     };
//     if (auth?.token) authCheck();
//   }, [auth?.token]);

//   return ok ? <Outlet /> : <Spinner />;
// }
import { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
 import Spinner from "../Spinner";
export default function PrivateRoute() {
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("http://localhost:3000/auth/authenticate");
      if (res.data.ok) {
        setAuth({ ...auth, token: res.data.accessToken, user: res.data.user });
      }
    };
    auth?.token ? setAuth({ ...auth }) : authCheck();
  }, [auth?.token]);

  return auth?.token ? <Outlet /> : <Spinner />;
}