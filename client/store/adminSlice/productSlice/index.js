import axiosInstance from "@/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addProducts = createAsyncThunk(
  "/products/add",
  async (formData) => {
    const response = await axiosInstance.post(
      `/api/admin/addProducts`,
      formData,
      {
        withCredentials: true,
      },
    );
    console.log(response);
    return response.data;
  },
);

export const fetchProducts = createAsyncThunk("/admin/get", async () => {
  const response = await axiosInstance.get(`/api/admin/fetchProducts`, {
    withCredentials: true,
  });
  console.log(response)
  return response?.data;
});

export const updateProducts = createAsyncThunk(
  "/admin/update",
  async ({ id, formData }) => {
    const response = await axiosInstance.put(
      `/api/admin/updateProducts/${id}`,

      formData,
      { withCredentials: true },
    );
    return response?.data;
  },
);

export const deleteProducts = createAsyncThunk("/admin/delete", async (id) => {
  const response = await axiosInstance.delete(
    `/api/admin/deleteProducts/${id}`,

    { withCredentials: true },
  );
  return response?.data;
});

const initialState = {
  isLoading: false,
  productList: [],
};

export const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //AddProducts
    builder.addCase(addProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    builder.addCase(addProducts.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    //fetchProducts
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = action?.payload?.success
        ? action?.payload?.allProducts
        : null;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    //updateProducts
    builder.addCase(updateProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    builder.addCase(updateProducts.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    //deleteProducts
    builder.addCase(deleteProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    builder.addCase(deleteProducts.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
  },
});

export default adminProductSlice.reducer;
