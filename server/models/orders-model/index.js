import mongoose, { now } from "mongoose";

const OrdersSchema = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    items:[{
        productId:{
            type:mongoose.Types.ObjectId,
            ref:"Products"
        },
        image:String,
        quantity:Number
    }],
    amount:Number,
    orderId:String,
    paymentId:String,
    orderStatus:{
        type:String,
        default:"pending"
    },
    addressInfo:{
        type:mongoose.Types.ObjectId,
        ref:"Address"
    },
    orderDate:{
      type:Date,
      default:Date.now  
    }
})

const Orders = mongoose.model("Orders",OrdersSchema)
export default Orders