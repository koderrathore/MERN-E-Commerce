import axiosInstance from "@/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  isLoading: false,
  orders: null,
  allOrders: [],
};

export const getKey = createAsyncThunk("/orders/key", async () => {
  const { data } = await axiosInstance.get(
    `/api/orders/key`,

    {
      withCredentials: true,
    },
  );
  return { data };
});
export const createOrder = createAsyncThunk(
  "/orders/create",
  async (amount) => {
    const { data } = await axiosInstance.post(
      `/api/orders/create`,

      amount,
      { withCredentials: true },
    );
    return { data };
  },
);

export const allOrders = createAsyncThunk(
  "/orders/all-orders",
  async (userId) => {
    const { data } = await axiosInstance.get(
      `/api/orders/all-orders/${userId}`,
      { withCredentials: true },
    );
    return { data };
  },
);

export const allOrdersForAdmin = createAsyncThunk(
  "/orders/all-orders-for-admin",
  async () => {
    const { data } = await axiosInstance.get(
      `/api/orders/all-orders-for-admin`,

      { withCredentials: true },
    );
    return { data };
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/order-status",
  async ({ orderStatus, id }) => {
    console.log(orderStatus, id);
    const { data } = await axiosInstance.put(
      `/api/orders/update-order-status`,

      { orderStatus, id },
      { withCredentials: true },
    );
    return { data };
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getKey.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getKey.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
    builder.addCase(getKey.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.orders = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      state.orders = null;
    });
    builder.addCase(allOrders.pending, (state) => {
      state.isLoading = true;
      state.orders = null;
    });
    builder.addCase(allOrders.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.orders = action?.payload?.data?.success
        ? action?.payload?.data?.allOrders
        : null;
    });
    builder.addCase(allOrders.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
    builder.addCase(allOrdersForAdmin.pending, (state) => {
      state.isLoading = true;
      state.orders = null;
    });
    builder.addCase(allOrdersForAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allOrders = action?.payload?.data?.success
        ? action?.payload?.data?.allOrders
        : null;
    });
    builder.addCase(allOrdersForAdmin.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;

      const updatedOrder = action?.payload?.data?.updatedOrder;

      state.orders = state?.orders?.map((order) =>
        order?._id === updatedOrder?._id ? updatedOrder : order,
      );
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
    });
  },
});

export default ordersSlice.reducer;
