import React, { useEffect, useState } from "react";
import img1 from "../../assets/checkout1.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "/store/addressSlice";
import { useToast } from "@/hooks/use-toast";
import { fetchAddress } from "/store/addressSlice";
import { deleteAddress } from "/store/addressSlice";
import { editAddress } from "/store/addressSlice";
import { removeItem } from "/store/cartSlice";
import { createOrder } from "/store/orderSlice";
import { getKey } from "/store/orderSlice";
import axios from "axios";

const CheckOut = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phone, setPhone] = useState("");
  const [addressId, setAddressId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [CheckedOutProduct, setCheckedOutProduct] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { userId, userName } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { cart, isLoading } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();

  const CheckOutProduct = location.state?.CheckOutProduct;
  console.log(CheckOutProduct);
  const totalAmount =
    CheckOutProduct && CheckOutProduct.length > 0
        ? CheckOutProduct?.reduce(
            (acc, crr) =>
              acc +
              (crr?.products?.salePrice > 0
                ? crr?.products?.salePrice
                : crr?.products?.price) *
                crr?.quantity,
            0
          )
      : cart && cart.length > 0
      ? cart?.reduce(
          (arr, crr) =>
            arr +
            (crr?.products.salePrice > 0
              ? crr?.products.salePrice
              : crr?.products.price) *
              crr?.quantity,
          0
        )
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId && !isEdit) {
      dispatch(addAddress({ userId, address, city, pinCode, phone }))
        .then((data) => {
          if (data.payload?.data?.success) {
            toast({
              title: data?.payload.data?.message,
            });
            setAddress("");
            setCity("");
            setPinCode("");
            setPhone("");
            dispatch(fetchAddress());
          }
        })
        .catch((err) => console.log(err));
    }
    if (isEdit && addressId) {
      dispatch(editAddress({ addressId, address, city, phone, pinCode }))
        .then((data) => {
          if (data.payload.data.success) {
            toast({
              title: "Address Updated",
            });
          }
          setAddress("");
          setCity("");
          setPinCode("");
          setPhone("");
          dispatch(fetchAddress());
          dispatch(fetchAddress());
          setIsEdit(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSelect = (e) => {
    setSelectedAddress(e);
    setSelectedAddressId(e._id);
  };

  const handleEdit = (e) => {
    if (addressList?.length >= 3) return;
    setAddressId(e._id);
    setAddress(e.address);
    setCity(e.city);
    setPinCode(e.pinCode);
    setPhone(e.phone);
    setIsEdit(true);
  };

  const handleDeleteCartItem = (e) => {
    console.log(e);
    dispatch(removeItem({ productId: e.products._id }))
      .then((data) => dispatch(cartProducts()))
      .catch((err) => console.log(err));
  };

  const handleChekOut = () => {
    if (!CheckOutProduct) return toast({ title: "Something went wrong" });
    if (!selectedAddress)
      return toast({ title: "Please select address first" });
    console.log("User ID " + userId);
    console.log("Address ID " + selectedAddressId);
    console.log(selectedAddress);
    console.log("Product ID " + productId);
    console.log("Quantity " + quantity);
    console.log("Total Amount " + totalAmount);
    console.log(CheckOutProduct);

    dispatch(getKey())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    dispatch(createOrder({ amount: totalAmount }))
      .then((data) => {
        if (data.payload.data?.success) {
          const option = {
            key: data.payload.data?.key,
            amount: data.payload.data.order?.amount * 100,
            currency: "INR",
            name: userName,
            description: "Test Transaction",
            order_id: data.payload.data?.order?.id,
            handler: async function (response) {
              console.log(response);
              setOrderId(response.razorpay_order_id);
              setPaymentId(response.razorpay_payment_id);
              const { data } = await axios.post(
                "http://localhost:5000/api/orders/payment-verification",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  userDet: {
                    selectedAddress,
                    userId,
                    item:CheckOutProduct,
                    totalAmount,
                    orderId,
                    paymentId,
                  },
                },
                { withCredentials: true }
              );
              console.log(data)
              if(data.success){
                toast({title:"Ordered"})
                data.newOrder.items.map((e)=>{
                  dispatch(removeItem({productId:e.productId}))
                })
                navigate("/shop/home")
              }
            },

            prefill: {
              name: userName,
              email: data.payload.data.orderData?.email,
              contact: selectedAddress?.phone,
            },
            theme: {
              color: "black",
            },
          };
          const rzp = new Razorpay(option);
          rzp.open();
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    dispatch(fetchAddress());
    if (CheckOutProduct) {
      setProductId(CheckOutProduct?._id);
      setQuantity(CheckOutProduct?.quantity);
    }
  }, []);

  return (
    <div className="h-screen w-[100%] flex flex-col">
      <img className="w-full h-[50vh] object-cover" src={img1} alt="" />

      <div className="mt-2 w-full h-full">
        <Tabs defaultValue="CheckOuts">
          <TabsList>
            <TabsTrigger value="orders" className="text-2xl">
              Orders
            </TabsTrigger>
            <TabsTrigger value="CheckOuts" className="text-2xl">
              CheckOuts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            
          </TabsContent>
          <TabsContent value="CheckOuts" className="lg:flex-row flex-wrap">
            <div className="px-2 lg:flex-row lg:flex-wrap">
              {addressList && addressList.length > 0 ? (
                <div>
                  <h1 className="my-4 text-xl text-center font-bold">
                    Address & Cart Details
                  </h1>
                  {addressList.length >= 3 ? (
                    <h1 className="my-4 lg:text-xl text-center text-red-500 font-thin -mt-4">
                      Cann't add more than addresses
                    </h1>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-col justify-between pb-4 flex-wrap overflow-auto">
                <div className="w-full lg:flex flex-wrap gap-1 h-96 flex-1 lg:h-96 overflow-auto border-t-2 border-red-300">
                  {addressList && addressList?.length > 0
                    ? addressList.map((e, i) => {
                        return (
                          <Card
                            key={i}
                            className="my-2 shadow-2xl lg:py-4 w-full"
                          >
                            <CardContent className="flex flex-col justify-around text-[2.2vh] lg:text-xl">
                              <h1 className="leading-5 lg:leading-none">
                                {e.address}
                              </h1>
                              <h1>{e.city}</h1>
                              <h1>{e.pinCode}</h1>
                              <h1>{e.phone}</h1>
                            </CardContent>
                            <div className="flex gap-2 -mt-4 items-center px-4 pb-2 lg:mt-1">
                              <Button onClick={() => handleEdit(e)}>
                                Edit
                              </Button>
                              <Button onClick={() => handleSelect(e)}>
                                {selectedAddressId && selectedAddressId == e._id
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    : null}
                </div>

                <h1 className="text-2xl font-semibold text-center my-4 border-b-2 pb-2 border-gray-300 lg:mt-0">
                  {CheckOutProduct && CheckOutProduct.length > 0 ? (
                    <span>
                      Your checkOut <i className="font-serif">Item</i>
                    </span>
                  ) : (
                    <span>
                      Your Cart <i className="font-serif">Items</i>
                    </span>
                  )}
                </h1>
                <div className="sm:h-[40vh] h-52  overflow-y-auto pl-4 sm:mt-0 mt-4">
                  {CheckOutProduct && CheckOutProduct.length > 0 ? (
                    CheckOutProduct?.map((e, i) => {
                      return (
                        <div
                          key={i}
                          className="flex pr-2 sm:pr-0 justify-between py-1 -ml-5 my-1 relative border-b-2 border-gray-300 pb-2"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="lg:w-28 lg:h-32 w-16 h-20">
                              <img
                                className="w-full h-full object-cover"
                                src={e?.products?.image}
                                alt=""
                              />
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2 justify-center">
                              <span className=" lg:text-lg pl-1 -mt-2 lg:mt-0 font-bold">
                                Quantity:{e?.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between mt-4 lg:text-xl items-end">
                            <div className="flex flex-col gap-0 lg:text-xl justify-end text-end lg:items-start ">
                              <h1 className=" leading-6 w-full font-semibold flex ">
                                {e?.products?.title}
                              </h1>
                              <span className="text-black font-semibold ">
                                {e?.products?.salePrice > 0
                                  ? e?.products?.salePrice * e?.quantity
                                  : e?.products?.price * e?.quantity}
                                Rs.
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                disabled={isLoading}
                                className=" lg:text-xl lg:h-auto lg:w-auto h-8 w-24"
                              >
                                view Details
                              </Button>
                            </div>
                            {/* <div
                                    onClick={() => {
                                      handleDeleteCartItem(e);
                                    }}
                                    className="absolute top-0 right-0"
                                  >
                                    <X />
                                  </div> */}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className=" ">
                      {cart && cart.length > 0 ? (
                        cart.map((e, i) => {
                          return (
                            <div className="flex justify-between py-1 -ml-5 my-1 relative border-b-2 border-gray-300 pb-2">
                              <div className="flex flex-col gap-1">
                                <div className="lg:w-28 lg:h-32 w-16 h-20">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={e.products?.image}
                                    alt=""
                                  />
                                </div>
                                <div className="flex items-center gap-1 lg:gap-2 justify-center">
                                  <span className=" lg:text-lg pl-1 -mt-2 lg:mt-0 font-bold">
                                    Quantity:{e?.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col justify-between mt-4 lg:text-xl items-end">
                                <div className="flex flex-col gap-0 lg:text-xl justify-end text-end lg:items-start ">
                                  <h1 className=" leading-6 w-full font-semibold flex ">
                                    {e.products.title}
                                  </h1>
                                  <span className="text-black font-semibold ">
                                    {e.products.salePrice > 0
                                      ? e.products.salePrice * e.quantity
                                      : e.products.price * e.quantity}
                                    Rs.
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    disabled={isLoading}
                                    className=" lg:text-xl lg:h-auto lg:w-auto h-8 w-24"
                                  >
                                    view Details
                                  </Button>
                                </div>
                                {/* <div
                                    onClick={() => {
                                      handleDeleteCartItem(e);
                                    }}
                                    className="absolute top-0 right-0"
                                  >
                                    <X />
                                  </div> */}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-2xl text-center">No items</div>
                      )}
                    </div>
                  )}
                  <div className="rounded-lg border-t-2 border-gray-300 right-0 flex flex-col  bg-white py-1 gap-2">
                    <div className="flex justify-between px-4 items-center ">
                      <h1 className="text-2xl font-semibold">Total</h1>
                      <span className="text-2xl font-semibold">
                        {totalAmount}Rs.
                      </span>
                    </div>
                    {CheckOutProduct ? (
                      <Button
                        onClick={() => handleChekOut()}
                        disabled={isLoading}
                        className=" sm:text-xl w-fit ml-2 sm:ml-0"
                      >
                        check out
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:text-xl px-4 py-2">
              <Card className="shadow-lg px-2">
                <h1 className="my-2 lg:my-4 text-xl text-center font-bold">
                  {isEdit ? "Edit Address" : "Add Address"}
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-1 flex-col mt-4"
                  action=""
                >
                  <div className="flex flex-col gap-1">
                    <h1>Adress</h1>

                    <input
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      required
                      className=" rounded-md"
                      placeholder="enter address"
                      type="text"
                    />
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-1">
                    <h1>City</h1>
                    <input
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      required
                      className=" rounded-md"
                      placeholder="enter city"
                      type="text"
                    />
                  </div>
                  <Separator />

                  <div className="flex flex-col gap-1">
                    <h1>PinCode</h1>
                    <input
                      value={pinCode}
                      onChange={(e) => {
                        setPinCode(e.target.value);
                      }}
                      required
                      className=" rounded-md"
                      placeholder="enter pin code"
                      type="text"
                    />
                  </div>
                  <Separator />

                  <div className="flex flex-col gap-1">
                    <h1>Phone No.</h1>
                    <input
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      required
                      className=" rounded-md"
                      placeholder="enter phone number"
                      type="text"
                    />
                  </div>

                  <Button
                    disabled={addressList?.length >= 3}
                    type=" submit"
                    className="mt-2 lg:mt-0 lg:text-2xl py-4 mb-2"
                  >
                    {isEdit ? "Edit" : "Add"}
                  </Button>
                </form>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CheckOut;
