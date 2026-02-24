import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashborad = ({ token }) => {
  const { allOrders } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const [pending, setPending] = useState(0);
  const [shipped, setShipped] = useState(0);
  const [delievered, setDelivered] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [orderDets, setOrderDets] = useState(null);
  const [check, setCheck] = useState("pending");

  const [earnings, setearnings] = useState([]);
  let p = 0;
  let s = 0;
  let d = 0;
  let r = 0;
  useEffect(() => {
    // if(!token) return
    if (allOrders) {
      allOrders.forEach((e) => {
        console.log(e);
        if (e.orderStatus === "pending") {
          p++;
        }
        if (e.orderStatus === "shipped") {
          s++;
        }
        if (e.orderStatus === "delievered") {
          d++;
        }
        if (e.orderStatus === "rejected") {
          r++;
        }
      });

      let totalEarning = allOrders.reduce(
        (arr, crr) => arr + (crr.orderStatus === "delievered" ? crr.amount : 0),
        0,
      );

      setearnings(totalEarning);
      setPending(p);
      setShipped(s);
      setDelivered(d);
      setRejected(r);
    }
  }, []);
  const handleDetails = (e) => {
    setOrderDets(e);
  };

  useEffect(() => {}, [allOrders]);
  orderDets && orderDets?.length > 0
    ? orderDets?.map((e) => {
        console.log(e);
      })
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Dialog open={orderDets} onOpenChange={setOrderDets}>
          <DialogContent
            
            className="overflow-auto h-96"
          >
            <DialogTitle>{orderDets?.addressInfo?.address}</DialogTitle>
            {orderDets?.items?.map((e, i) => (
              <Card onClick={() => {
              navigate("/admin/orders",{state:{dets:orderDets?.orderId}});
            }} key={i} className="">
                <CardContent className="flex justify-between items-center h-44">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden">
                    <img
                      src={e?.productId?.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-xs justify-end items-end sm:text-xl">
                    <h1 className="text-end">{e.productId?.title}</h1>
                    <h1 className="">Quantity: {e?.quantity}</h1>
                    <h1 className="font-semibold">
                      Amount: {orderDets?.amount}
                    </h1>
                  </div>
                </CardContent>
              </Card>
            ))}
          </DialogContent>
        </Dialog>
        <Table className="text-xs md:text-sm">
          <TableHeader>
            <TableRow className="sm:text-xl">
              <TableHead onClick={()=>setCheck("pending")} className="cursor-pointer w-[100px] text-black">
                Pending Orders
              </TableHead>
              <TableHead onClick={()=>shipped==0?"":setCheck("shipped")} className="cursor-pointer w-[100px] text-blue-600">
                Shipped Orders
              </TableHead>
              <TableHead onClick={()=>delievered==0?"":setCheck("delievered")} className="cursor-pointer w-[100px] text-green-600">
                Delievered Orders
              </TableHead>
              <TableHead className="w-[100px] text-red-600">
                Rejected Orders
              </TableHead>
              <TableHead className="w-[100px] ">Total Earning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="sm:text-xl">
              <TableCell>{pending || 0}</TableCell>
              <TableCell>{shipped || 0}</TableCell>
              <TableCell>{delievered || 0}</TableCell>
              <TableCell>{rejected || 0}</TableCell>
              <TableCell>{earnings || 0} Rs.</TableCell>
            </TableRow>
            <TableRow className="sm:text-xl">
              <TableCell>
                {/* <Button
                  className="sm:h-auto sm:w-auto sm:text-xl text-xs h-6 w-20"
                  id="pending"
                  onClick={() => {
                    handleDetails();
                  }}
                >
                  View Details
                </Button> */}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col flex-wrap gap-2 px-1">
        <h1 className="text-xl ">{check=="shipped"?"Shipped Orders":check=="delievered"?"Delievered Orders":"Pending Orders"}</h1>
        <div className=" my-2 flex flex-wrap gap-1">
          {allOrders && allOrders?.length > 0
            ? allOrders.map((e, i) =>
                e?.orderStatus == check ? (
                  <Card
                    onClick={() => {
                      setOrderDets(e);
                    }}
                    key={i}
                    className={`relative hover:bg-black hover:text-white w-1/3 ${check=="shipped"?"bg-blue-600 text-white hover:bg-blue-500":check=="delievered"?"bg-green-600 text-white hover:bg-green-500":""}`}
                  >
                    <CardContent className=" flex flex-col ">
                      <div className="line-clamp-1">
                        Address: {e?.addressInfo?.address}
                      </div>
                      <div>City: {e?.addressInfo?.city}</div>
                      <div>Pin Code: {e?.addressInfo?.pinCode}</div>
                      <div>Phone: {e?.addressInfo?.phone}</div>
                      <div className="flex mt-4 justify-end absolute bottom-0 right-1"></div>
                    </CardContent>
                  </Card>
                ) : null
              )
            :(<div>No Pending Orders!!!</div>)}
        </div>
      </div>
    </div>
  );
};

export default Dashborad;
