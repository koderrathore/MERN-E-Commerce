import React, { useEffect } from "react";
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
import { checkLogin } from "/store/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Listing from "./pages/shop/Listing";
import Account from "./pages/shop/Account";
import { cartProducts } from "/store/cartSlice";
import { fetchShoppingProducts } from "/store/shopSlice";
import { fetchAddress } from "/store/addressSlice";
import CheckOut from "./pages/shop/CheckOut";
import { allOrders } from "/store/orderSlice";
import { allOrdersForAdmin } from "/store/orderSlice";

const App = () => {
  const { isAuthenticated, user, userId, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    dispatch(checkLogin(token))
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
    if (isLoading)
      return <Skeleton className="h-[800px] w-[400px] rounded-full" />;

    dispatch(fetchShoppingProducts()).then((data) => console.log(data));

    if (!userId) return;

    if (userId) {
      dispatch(fetchAddress(userId))
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      dispatch(cartProducts(userId));

      dispatch(allOrdersForAdmin())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }

    
  }, [dispatch, userId]);

  console.log(userId);
  return (
    <div className=" w-screen h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
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
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<Dashborad />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
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
