// import authReducer from"../store/authSlice/index.js"
import adminProductsReducer from"../store/adminSlice/productSlice/index.js"
import shoppingProductsReducer from"./shopSlice/index.js"
import cartReducer from"../store/cartSlice/index.js"
import addressReducer from"../store/addressSlice/index.js"
import ordersReducer from"../store/orderSlice/index.js"
import reviewsReducer from"../store/reviewsSlice/index.js"
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
    reducer:{
        // auth:authReducer,
        adminProducts:adminProductsReducer,
        shopProducts:shoppingProductsReducer,
        cart:cartReducer,
        address:addressReducer,
        orders:ordersReducer,
        reviews:reviewsReducer
    }
})

export default store