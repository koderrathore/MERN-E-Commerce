// import { useAuth } from "@clerk/clerk-react";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { useEffect } from "react";


// export const authRegister = createAsyncThunk(
//   "/auth/register",
//   async (formData) => {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/auth/register`,

//       formData,
//       { withCredentials: true }
//     );
//     return { data };
//   }
// );

// export const authLogin = createAsyncThunk("/auth/login", async (formData) => {
//   const { data } = await axios.post(
//     `${import.meta.env.VITE_API_URL}/api/auth/login`,

//     formData,
//     { withCredentials: true }
//   );
//   return { data };
// });

// export const checkLogin = createAsyncThunk(
//   "/auth/check-login",
//   async (token) => {
//     const { data } = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/auth/check-login`,
//       {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Cache-Control": "no-cache,no-store,must-revalidate,proxy-revalidate",
//         },
//       }
//     );
//     return { data };
//   }
// );

// export const authLogOut = createAsyncThunk("/auth/logOut", async () => {
//   const { data } = await axios.get(
//     `${import.meta.env.VITE_API_URL}/api/auth/logOut`,
//     {
//       withCredentials: true,
//     }
//   );
//   return { data };
// });


// const initialState = {
//   isLoading: false,
//   isAuthenticated: true,
//   user: null,
//   userName: null,
//   userId: null,
//   token: null,
// };



// useEffect(()=>{
// const userId = useAuth()
// console.log(userId)
// },[])

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     resetTokenAndCredentials: (state) => {
//       state.token = null;
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//   },
//   extraReducers: (builder) => {
//     //REGISTER
//     builder.addCase(authRegister.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(authRegister.fulfilled, (state, action) => {
//       state.isLoading = false;
//       console.log(action);
//       state.isAuthenticated = false;
//       state.user = null;
//     });
//     builder.addCase(authRegister.rejected, (state, action) => {
//       state.isLoading = false;
//       console.log(action);
//       state.isAuthenticated = false;
//       state.user = null;
//     });
//     //LOGIN
//     builder.addCase(authLogin.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(authLogin.fulfilled, (state, action) => {
//       state.isLoading = false;
//       console.log(action);
//       state.isAuthenticated = action?.payload?.data.success;
//       state.user = action?.payload?.data.success
//         ? action?.payload?.data?.isUser?.role
//         : null;
//       state.userName = action?.payload?.data?.isUser?.username;
//       state.userId = action?.payload?.data.success
//         ? action?.payload?.data?.isUser?._id
//         : null;
//       state.token = action?.payload?.data.success
//         ? action?.payload?.data?.token
//         : null;
//       const token = action?.payload?.data?.token;

//       if (token) {
//         sessionStorage.setItem("token", JSON.stringify(token));
//       } else {
//         sessionStorage.removeItem("token");
//       }

//       // const token = action.payload.data.token;
//       // sessionStorage.setItem("token", token);
//     });
//     builder.addCase(authLogin.rejected, (state) => {
//       state.isLoading = false;
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;
//     });
//     builder.addCase(checkLogin.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(checkLogin.fulfilled, (state, action) => {
//       state.isLoading = false;
//       console.log(action);
//       state.isAuthenticated = action?.payload?.data.success || false;
//       state.userName = action?.payload?.data?.decoded?.username;
//       state.user = action?.payload?.data.success
//         ? action?.payload?.data.decoded.role
//         : null;
//       state.userId = action?.payload?.data.success
//         ? action?.payload?.data.decoded.id
//         : null;
//     });
//     builder.addCase(checkLogin.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isAuthenticated = null;
//       state.user = null;
//     });
//     builder.addCase(authLogOut.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(authLogOut.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.isAuthenticated = action.payload.data.success ? false : true;
//     });
//     builder.addCase(authLogOut.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isAuthenticated = null;
//       state.user = null;
//     });
//   },
// });

// export const { resetTokenAndCredentials } = authSlice.actions;
// export default authSlice.reducer;
