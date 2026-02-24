import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { allOrdersForAdmin } from "/store/orderSlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "/store/orderSlice";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.orders);
  const location = useLocation();
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const { toast } = useToast();

  console.log(allOrders);

  const handleOrderDets = (e) => {
    console.log(e);
    setDialog(e);
  };
  const handleOrderStatus = (e) => {
    setOrderStatus(e);
  };

  const hanldeUpdateOrderStatus = () => {
    console.log(orderStatus);
    console.log(dialog);
    dispatch(updateOrderStatus({ orderStatus, id: dialog._id }))
      .then((data) => {
        if (data.payload.data.success) {
          toast({ title: "Order Status Updated" });
          dispatch(allOrdersForAdmin());
          setDialog(false);
          useEffect(() => {}, [data.payload.data.success]);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    dispatch(allOrdersForAdmin())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="w-[100%] h-[100%]">
      <Dialog
        open={dialog}
        onOpenChange={(open) => {
          setDialog(open);
          setOrderStatus(null);
        }}
      >
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
                <h1 className="uppercase">{dialog?.orderStatus}</h1>
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
                      <div
                        key={i}
                        className="border-2 border-gray-300 px-2 py-2 my-1 rounded-md"
                      >
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
          <Select
            onValueChange={(e) => {
              handleOrderStatus(e);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delievered">Delievered</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={!orderStatus}
            onClick={() => {
              hanldeUpdateOrderStatus();
            }}
            className="w-full"
          >
            Update Order Status
          </Button>
        </DialogContent>
      </Dialog>
      <Table className="text-xs md:text-sm ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order Id</TableHead>
            <TableHead className="w-[100px]">Order Status</TableHead>
            <TableHead className="w-[100px]">Order Date</TableHead>
            <TableHead className="w-[100px]">Amount Paid</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allOrders && allOrders.length > 0
            ? allOrders.map((e, i) => {
                return (
                  <>
                    <TableRow
                      key={i}
                      className={`${location?.state?.dets !== undefined ? (location?.state?.dets == e?.orderId ? "" : "hidden") : null}`}
                    >
                      <TableCell className="font-medium">
                        {e?.orderId}
                      </TableCell>
                      <TableCell
                        className={`w-fit mt-3  md:px-6 py-1 text-white flex justify-center items-center rounded-full ${
                          e.orderStatus == "delievered"
                            ? "bg-green-600"
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
                      <TableCell>{e?.orderDate}</TableCell>
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
            : null}
        </TableBody>
      </Table>
      {location?.state?.dets !== undefined ? (
        <div className="flex justify-center items-center mt-4">
          <Button onClick={() => navigate("/admin/orders")}>Show All</Button>
        </div>
      ) : null}
    </div>
  );
};

export default AdminOrders;
