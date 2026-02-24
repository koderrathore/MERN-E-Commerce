import axiosInstance from "@/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addAddress = createAsyncThunk("add/address", async (formData) => {
  const { data } = await axiosInstance.post(
    `/api/address/add-address`,
    formData,
    {
      withCredentials: true,
    },
  );
  return { data };
});

export const fetchAddress = createAsyncThunk("add/fetch", async (userId) => {
  const { data } = await axiosInstance.get(
    `/api/address/get-address/${userId}`,
    { withCredentials: true },
  );
  return { data };
});

export const deleteAddress = createAsyncThunk(
  "add/delete",
  async (addressId) => {
    const { data } = await axiosInstance.delete(`/api/address/delete-address`, 
      {
      data: addressId, // body yaha
      
      withCredentials: true,
    });

    return { data };
  },
);
export const editAddress = createAsyncThunk("add/edit", async (formData) => {
  const { data } = await axiosInstance.put(
    `/api/address/edit-address`,

    formData,
    {
      withCredentials: true,
    },
  );
  return { data };
});

const initialState = {
  isLoading: false,
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(addAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addAddress.fulfilled, (state, action) => {
      ((state.isLoading = false), console.log("adressSlice ", action));
      state.addressList = action?.payload?.data?.success
        ? action?.payload?.data?.newAddress
        : null;
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      ((state.isLoading = false), console.log(action));
      state.addressList = null;
    });
    builder.addCase(fetchAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAddress.fulfilled, (state, action) => {
      ((state.isLoading = false), console.log(action));
      state.addressList = action?.payload?.data?.success
        ? action?.payload?.data?.address
        : null;
    });
    builder.addCase(fetchAddress.rejected, (state, action) => {
      ((state.isLoading = false), console.log(action));
      state.addressList = null;
    });
  },
});

export default addressSlice.reducer;
