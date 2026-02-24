import axiosInstance from "@/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchShoppingProducts = createAsyncThunk(
  "/shop/products",
  async () => {
    const { data } = await axiosInstance.get(
      `/api/shop/products`,

      { withCredentials: true }
    );
    return { data };
  }
);

export const searchProduct = createAsyncThunk(
  "/admin/search",
  async (search) => {
    console.log(search);
    const { data } = await axiosInstance.post(
      `/api/shop/search/${search}`,

      { withCredentials: true }
    );
    return { data };
  }
);

const initialState = {
  isLoading: false,
  productList: [],
};

const shoppingSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //fetchProducts
    builder.addCase(fetchShoppingProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchShoppingProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productList = action.payload.data?.success
        ? action.payload.data?.allProducts
        : null;
    });
    builder.addCase(fetchShoppingProducts.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
    builder.addCase(searchProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      
      state.productList = action.payload.data?.success
        ? action.payload.data?.result
        : null;
    });
    builder.addCase(searchProduct.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.productList = null;
    });
  },
});

export default shoppingSlice.reducer;
