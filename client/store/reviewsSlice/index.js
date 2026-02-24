import axiosInstance from "@/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addReviews = createAsyncThunk(
  "/reviews/add",
  async ({ productId, review, ratings }) => {
    console.log( productId, review, ratings);
    const { data } = await axiosInstance.post(
      `/api/reviews/add-review`,

      { productId, review, ratings },
      { withCredentials: true }
    );
    return { data };
  }
);

export const productReview = createAsyncThunk(
  "/reviews/product-review",
  async (productId) => {
    const { data } = await axiosInstance.post(
      `/api/reviews/product-review`,

      productId,
      {
        withCredentials: true,
      }
    );
    return data;
  }
);

const initialState = {
  isLoading: false,
  reviews: [],
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addReviews.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addReviews.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.reviews = null;
    });
    builder.addCase(addReviews.rejected, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.reviews = null;
    });
    builder.addCase(productReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(productReview.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.reviews = action?.payload?.success ? action.payload?.review : [];
    });
    builder.addCase(productReview.rejected, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.reviews = null;
    });
  },
});

export default reviewsSlice.reducer;
