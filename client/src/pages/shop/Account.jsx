import React, { useEffect, useState } from "react";
import img1 from "../../assets/img3.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "/store/addressSlice";
import { useToast } from "@/hooks/use-toast";
import { fetchAddress } from "/store/addressSlice";
import { deleteAddress } from "/store/addressSlice";
import { editAddress } from "/store/addressSlice";
import { allOrders } from "/store/orderSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";

const Account = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phone, setPhone] = useState("");
  const [addressId, setAddressId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [token, setToken] = useState(null);

  const { userId, getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { addressList, isLoading } = useSelector((state) => state.address);
  const { orders } = useSelector((state) => state.orders);
  console.log("orders ", orders);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      userId,
      address,
      city,
      pinCode,
      phone,
    };
    if (userId && !isEdit) {
      console.log("11111");
      dispatch(addAddress(formData ))
        .then((data) => {
          if (data.payload?.data?.success) {
            toast({
              title: data?.payload.data?.message,
            });
            setAddress("");
            setCity("");
            setPinCode("");
            setPhone("");
            dispatch(fetchAddress(userId));
          } else {
            toast({
              title: "Something went wronggggg!!!",
            });
            return (
              <div className="text-2xl bg-black flex-grow">
                Something went wrong
              </div>
            );
          }
        })
        .catch((err) => {
          toast({
            title: "Something went wrong!!!",
          });
          console.log(err);
          console.log("2222");

          return <div>Something went wrong</div>;
        });
    }
    if (isEdit && addressId) {
      const formData = {
        addressId,
        address,
        city,
        pinCode,
        phone,
      };
      dispatch(editAddress(formData))
        .then((data) => {
          console.log(data);
          if (data.payload.data.success) {
            toast({
              title: "Address Updated",
            });
          }
          setAddress("");
          setCity("");
          setPinCode("");
          setPhone("");
          dispatch(fetchAddress(userId ));
          setIsEdit(false);
        })
        .catch((err) => {
          console.log(err);
          return <div>Something went wrong</div>;
        });
    }
  };

  const handleRemove = (e) => {
    console.log("object");
    dispatch(deleteAddress({ addressId: e._id }))
      .then((data) => {
        if (data?.payload?.data?.success) {
          toast({
            title: data?.payload?.data?.message,
          });
          dispatch(fetchAddress(userId));
        }
      })
      .catch((err) => {
        console.log(err);
        return <div>Something went wrong</div>;
      });
  };

  const handleEdit = (e) => {
    if (addressList?.length >= 4) return;
    setAddressId(e._id);
    setAddress(e.address);
    setCity(e.city);
    setPinCode(e.pinCode);
    setPhone(e.phone);
    setIsEdit(true);
  };

  const handleOrderDets = (e) => {
    setDialog(e);
  };

  async function createToken() {
    setToken(await getToken());
  }

  useEffect(() => {
    async function init() {
      if (!userId) return;

      if (!token) return;

      dispatch(fetchAddress(userId ))
        .then((data) => console.log(data))
        .catch((err) => {
          console.log(err);
          return <div>Something went wrong</div>;
        });
      dispatch(allOrders(userId))
        .then((data) => console.log("allorders ", data))
        .catch((err) => {
          console.log(err);
          return <div>Something went wrong</div>;
        });
    }

    init();
    if (isSignedIn) {
      createToken();
    }
  }, [userId, token, isSignedIn]);

  if (!isSignedIn) {
    return navigate("/shop/home");
  }
useEffect(()=>{

},[orders]) 
 return (
    <div className="h-[100%] w-[100%] flex flex-col">
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-semibold">Order Details</h1>
            <div className="gap-2 flex flex-col">
              <div className="flex gap-1">
                <span>Order Id :</span>
                <h1>{dialog?.orderId}</h1>
              </div>
              <div className="flex gap-1">
                <span>Payment Id :</span>
                <h1>{dialog?.paymentId}</h1>
              </div>
              <div className="flex gap-1">
                <span>Date :</span>
                <h1>{dialog?.orderDate}</h1>
              </div>
              <div className="flex gap-1">
                <span>Amount Paid :</span>
                <h1>{dialog?.amount}</h1>
              </div>
              <div className="flex gap-1">
                <span>Order Status :</span>
                <h1
                  className={`${
                    dialog?.orderStatus == "delievered"
                      ? "text-green-600 "
                      : dialog?.orderStatus == "pending"
                        ? "text-black"
                        : dialog?.orderStatus == "shipped"
                          ? "text-blue-500"
                          : dialog?.orderStatus == "rejected"
                            ? "text-red-500"
                            : null
                  }`}
                >
                  {dialog?.orderStatus}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-12">
              <h1 className="mb-1 text-xl font-semibold">Product Details</h1>
              <span className="text-xl text-muted-foreground">
                {dialog?.items?.length} Products
              </span>
            </div>
            <div className="h-32 overflow-auto">
              {dialog?.items && dialog?.items?.length > 0
                ? dialog?.items.map((e, i) => {
                    return (
                      <div className="border-2 border-gray-300 px-2 py-2 my-1 rounded-md">
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center">
                            <div className="w-28 h-24 mt-1 rounded-md overflow-hidden flex justify-start flex-col">
                              <img
                                className="w-full h-full object-cover"
                                src={e?.productId?.image}
                                alt=""
                              />
                            </div>
                            <div className="flex flex-col justify-end items-end">
                              <h1 className="text-end leading-4 sm:leading-none">
                                {e?.productId?.title}
                              </h1>
                              <h1>Brand: {e?.productId?.brand}</h1>
                              <h1>Quantity: {e?.quantity}</h1>
                              <h1 className="flex text-end">
                                Category: {e?.productId?.category}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-semibold">Address Details</h1>
            <div className="gap-2 flex flex-col">
              <div className="flex flex-col">
                <span>Address :</span>
                <h1>{dialog?.addressInfo?.address}</h1>
              </div>
              <div className="flex gap-1">
                <span>City :</span>
                <h1>{dialog?.addressInfo?.city}</h1>
              </div>
              <div className="flex gap-1">
                <span>Pin Code :</span>
                <h1>{dialog?.addressInfo?.pinCode}</h1>
              </div>
              <div className="flex gap-1">
                <span>Phone No. :</span>
                <h1>{dialog?.addressInfo?.phone}</h1>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <img className="w-full h-[50vh] object-cover" src={img1} alt="" />

      <div className="mt-2 w-full h-full">
        <Tabs defaultValue="accounts">
          <TabsList className="flex gap-6">
            <div className="hidden lg:block">
              <UserButton />
            </div>
            <TabsTrigger value="orders" className="text-2xl">
              Orders
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-2xl">
              Accounts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Table className="text-xs md:text-sm ">
              <TableHeader>
                {orders && orders.length > 0 ? (
                  <TableRow>
                    <TableHead className="w-[100px]">Order Id</TableHead>
                    <TableHead className="w-[100px]">Order Status</TableHead>
                    <TableHead className="w-[100px]">Order Date</TableHead>
                    <TableHead className="w-[100px]">Amount Paid</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                ) : null}
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((e, i) => {
                    const date = new Date(e?.orderDate);
                    return (
                      <>
                        <TableRow key={i} className="">
                          <TableCell className="font-medium">
                            {e?.orderId}
                          </TableCell>
                          <TableCell
                            className={`w-fit mt-3  md:px-6 py-1 text-white flex justify-center items-center rounded-full ${
                              e.orderStatus == "delievered"
                                ? "bg-green-600 "
                                : e.orderStatus == "pending"
                                  ? "bg-black"
                                  : e.orderStatus == "shipped"
                                    ? "bg-blue-500"
                                    : e.orderStatus == "rejected"
                                      ? "bg-red-500"
                                      : null
                            }`}
                          >
                            {e?.orderStatus}
                          </TableCell>
                          <TableCell>
                            {date.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>{e?.amount}Rs.</TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              onClick={() => {
                                handleOrderDets(e);
                              }}
                              className="h-6 w-24 md:h-auto md:w-auto"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <div className="text-2xl md:text-4xl">No Orders Yet!</div>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          {isLoading ? (
            <div>Loading Adresses</div>
          ) : (
            <TabsContent value="accounts" className="lg:flex-row flex-wrap">
              <div className="px-2 lg:flex-row lg:flex-wrap">
                {addressList && addressList.length > 0 ? (
                  <div>
                    <h1 className="my-4 text-xl text-center font-bold">
                      Address Details
                    </h1>
                    {addressList.length >= 3 ? (
                      <h1 className="my-4 lg:text-xl text-center text-red-500 font-thin -mt-4">
                        Cann't add more than 3 addresses
                      </h1>
                    ) : null}
                  </div>
                ) : null}
                <div className="lg:flex gap-2 pb-4">
                  {addressList && addressList?.length > 0
                    ? addressList.map((e, i) => {
                        return (
                          <Card
                            key={i}
                            className="my-2 shadow-2xl lg:py-4 lg:w-1/2"
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
                              <Button onClick={() => handleRemove(e)}>
                                Remove
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    : null}
                </div>
              </div>
              <div className="flex flex-col lg:text-xl px-4 py-2">
                <Card className="shadow-lg px-2">
                  <h1 className="my-4 text-xl text-center font-bold">
                    {isEdit ? "Edit Address" : "Add Address"}
                  </h1>
                  <form
                    onSubmit={handleSubmit}
                    className="flex gap-1 flex-col mt-4"
                    action=""
                  >
                    <div className="flex flex-col gap-1">
                      <h1>Adress</h1>

                      <Input
                        disabled={addressList?.length >= 3 && !isEdit}
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        required
                        className=" rounded-md disabled:placeholder:text-red-600"
                        placeholder="enter address"
                        type="text"
                      />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <h1>City</h1>
                      <Input
                        disabled={addressList?.length >= 3 && !isEdit}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        required
                        className=" rounded-md disabled:placeholder:text-red-600"
                        placeholder="enter city"
                        type="text"
                      />
                    </div>
                    <Separator />

                    <div className="flex flex-col gap-1">
                      <h1>PinCode</h1>
                      <Input
                        disabled={addressList?.length >= 3 && !isEdit}
                        value={pinCode}
                        onChange={(e) => {
                          setPinCode(e.target.value);
                        }}
                        required
                        className=" rounded-md disabled:placeholder:text-red-600"
                        placeholder="enter pin code"
                        type="text"
                      />
                    </div>
                    <Separator />

                    <div className="flex flex-col gap-1">
                      <h1>Phone No.</h1>
                      <Input
                        disabled={addressList?.length >= 3 && !isEdit}
                        className=" rounded-md disabled:placeholder:text-red-600"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        required
                        placeholder="enter phone number"
                        type="text"
                      />
                    </div>

                    <Button
                      disabled={addressList?.length >= 3 && !isEdit}
                      type=" submit"
                      className="mt-2 lg:mt-0 lg:text-2xl py-4 mb-2"
                    >
                      {isEdit ? "Edit" : "Add"}
                    </Button>
                  </form>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
