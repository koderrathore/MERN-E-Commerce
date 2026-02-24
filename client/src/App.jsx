import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRegister from "./pages/Register";
import AuthLogin from "./pages/Login";
import AuthLayout from "./components/auth/layout";
import CheckAuth from "./common/CheckAuth";
import AdminLayout from "./components/admin/layout";
import Dashborad from "./pages/admin/Dashborad";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/Products";
import Home from "./pages/shop/Home";
import ShoppingLayout from "./components/shop/layout";
import { useDispatch, useSelector } from "react-redux";
// import { checkLogin } from "/store/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Listing from "./pages/shop/Listing";
import Account from "./pages/shop/Account";
import { cartProducts } from "/store/cartSlice";
import { fetchShoppingProducts } from "/store/shopSlice";
import { fetchAddress } from "/store/addressSlice";
import CheckOut from "./pages/shop/CheckOut";
import { allOrders } from "/store/orderSlice";
import { allOrdersForAdmin } from "/store/orderSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Oval, TailSpin } from "react-loader-spinner";
import axiosInstance from "./axios";

const App = () => {
  const { sessionClaims, userId, getToken, isLoaded } = useAuth();
  const { user } = useUser();

  const role = user?.publicMetadata?.role || "user";
  // console.log("user2 ", sessionClaims?.meta?.role)

  const [token, setToken] = useState(null);

  async function creatToken() {
    setToken(await getToken());
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchShoppingProducts());

    // if (userId && token) {
    //   dispatch(fetchAddress({ userId, token }))
    //     .then((data) => console.log(data))
    //     .catch((err) => console.log(err));
    // dispatch(cartProducts({ userId, token }))
    //   .then((data) => console.log(data))
    //   .catch((err) => console.log(err));

    //   dispatch(allOrders({ userId, token }));

    dispatch(allOrdersForAdmin(token))
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    // }
    if (!token) {
      creatToken();
    }
  }, [userId]);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, []);

  if (!isLoaded)
    return (
      <div className="h-screen w-screen flex flex-grow justify-center items-center">
        {" "}
        <Oval
          height={80}
          width={80}
          color="black"
          visible={!isLoaded}
          ariaLabel="oval-loading"
          secondaryColor="gray"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  return (
    <div className=" w-screen h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={userId} user={role}>
              <AuthLayout />
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={userId} user={role}>
              {" "}
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={userId} user={role}>
              {" "}
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<Dashborad token={token} />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={userId} user={role}>
              {" "}
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="checkOut" element={<CheckOut />} />
          <Route path="listing" element={<Listing />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
