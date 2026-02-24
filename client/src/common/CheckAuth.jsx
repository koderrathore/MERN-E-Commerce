import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  if(location.pathname=="/") return <Navigate to={"/shop/home"}/>

  // if(!isAuthenticated || user!=="admin" && (location.pathname.includes("/admin")))
  //   return <Navigate to={"/shop/home"}/>
  

  // if (location.pathname == "/") {
  //   if (!isAuthenticated) {
  //     return <Navigate to={"/auth/login"} />;
  //   } else {
  //     if (user == "admin") {
  //       return <Navigate to={"/admin/dashboard"} />;
  //     } else {
  //       return <Navigate to={"/shop/home"} />;
  //     }
  //   }
  // }

  // if (
  //   !isAuthenticated &&
  //   !(
  //     location.pathname.includes("/login") ||
  //     location.pathname.includes("/register")
  //   )
  // ) {
  //   return <Navigate to={"/auth/login"} />;
  // }

  if (
    isAuthenticated&&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user == "admin") {
      return <Navigate to={"/admin/dashboard"} />;
    } else {
      return <Navigate to={"/shop/home"} />;
    }
  }

  if (
    user == "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  if (
    user == "user" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to={"/shop/home"} />;
  }

  return <div>{children}</div>;
};

export default CheckAuth;
