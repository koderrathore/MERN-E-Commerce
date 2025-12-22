import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

export const addToCart = createAsyncThunk("/cart/add", async ({productId,userId}) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/cart/add-to-cart`,

    { productId },
    { withCredentials: true }
  );
  return { data };
});

export const cartProducts = createAsyncThunk("/cart/get", async (userId) => {
  const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/cart-products/${userId}`,

    { withCredentials: true }
  );
  return { data };
});

export const updateQuantity = createAsyncThunk(
  "/cart/put",
  async ({ productId, quantity,userId }) => {
    const { data } = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/update-quantity`,

      { productId, quantity },
      { withCredentials: true }
    );
    return { data };
  }
);

export const removeItem = createAsyncThunk(
  "cart/delete",
  async ({productId,userId}) => {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/remove-item`,
      {
        data: { productId,userId },
        withCredentials: true,
      }
    );

    return { data };
  }
);

const initialState = {
  isLoading: false,
  cart: [],
};

const cartSLice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      (state.isLoading = true), console.log(action);
      state.cart = action?.payload?.data?.success
        ? action?.payload?.data?.createCart ||
          action?.payload?.data?.alreadyHaveCart
        : null;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      (state.isLoading = false), console.log(action);
      state.cart = null;
    });
    builder.addCase(cartProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cartProducts.fulfilled, (state, action) => {
      (state.isLoading = false),
        console.log("Cart "+ action?.payload?.data?.cartProducts?.[0]?.items);
      state.cart = action?.payload?.data?.success
        ? action?.payload?.data?.cartProducts?.[0]?.items
        : null;
    });
    builder.addCase(cartProducts.rejected, (state, action) => {
      (state.isLoading = false), console.log(action);
      state.cart = null;
    });
    builder.addCase(updateQuantity.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      (state.isLoading = false), (state.cart = null);
    });
    builder.addCase(removeItem.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeItem.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
    builder.addCase(removeItem.rejected, (state, action) => {
      (state.isLoading = false), console.log(action);
      state.cart = null;
    });
  },
});

export default cartSLice.reducer;
