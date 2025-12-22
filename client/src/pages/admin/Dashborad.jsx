import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

const Dashborad = () => {
  const { allOrders } = useSelector((state) => state.orders);
  const [pending, setPending] = useState(0);
  const [shipped, setShipped] = useState(0);
  const [delievered, setDelivered] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [open, setOpen] = useState(false);

  const [earnings, setearnings] = useState(null);
  console.log(allOrders);
  let p = 0;
  let s = 0;
  let d = 0;
  let r = 0;

  useEffect(() => {
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
        0
      );

      setearnings(totalEarning);
      setPending(p);
      setShipped(s);
      setDelivered(d);
      setRejected(r);
    }
  }, [allOrders]);

  const handleDetails = () => {
    setOpen(true);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-auto">
          {
            allOrders && allOrders?.length>0?
            allOrders.map((e)=>
            e?.orderStatus=="pending"?
            e?.items?.map((j,i)=>(
              <Card key={i}>
                <CardContent className="flex justify-between h-44">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden">
                  <img src={j?.productId?.image} className="w-full h-full object-cover" alt="" />

                  </div>
                  <div className="flex flex-col gap-1 text-xs justify-end items-end sm:text-xl">
                    <h1 className="text-end">{j.productId?.title}</h1>
                    <h1 className="">Quantity: {j?.quantity}</h1>
                    <h1 className="font-semibold">Amount: {e?.amount}</h1>
                  </div>
                </CardContent>
              </Card>
            ))
            :null
            )
            :null
          }
        </DialogContent>
      </Dialog>
      <Table className="text-xs md:text-sm">
        <TableHeader>
          <TableRow className="sm:text-xl">
            <TableHead className="w-[100px] text-black">
              Pending Orders
            </TableHead>
            <TableHead className="w-[100px] text-blue-600">
              Shipped Orders
            </TableHead>
            <TableHead className="w-[100px] text-green-600">
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
              <Button
              className="sm:h-auto sm:w-auto sm:text-xl text-xs h-6 w-20"
                id="pending"
                onClick={() => {
                  handleDetails();
                }}
              >
                View Details
              </Button>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashborad;
