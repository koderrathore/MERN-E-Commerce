import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import banner1 from "../../assets/home1.jpg";
import banner2 from "../../assets/home2.jpg";
import banner3 from "../../assets/home3.jpg";
import banner4 from "../../assets/home4.jpg";
import { Card, CardContent } from "@/components/ui/card";
import {
  Baby,
  Biohazard,
  Cat,
  ChartNoAxesColumnIncreasing,
  Footprints,
  HandMetal,
  Heading,
  Shirt,
  Sparkles,
  Venus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "./ProductsTile";
import { Navigate, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { addToCart } from "/store/cartSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { searchProduct } from "/store/shopSlice";

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { productList } = useSelector((state) => state.shopProducts);
  const { allOrders } = useSelector((state) => state.orders);
  // const { userId } = useSelector((state) => state.auth);
  const user = useAuth();
  const { getToken } = useAuth();
  console.log(useAuth());
  console.log(productList);
  const [prodDets, setProdDets] = useState(null);

  const handleAddTOCart = async (prod) => {
    dispatch(addToCart({ productId: prod._id, userId: user?.userId }))
      .then((data) => {
        if (data?.payload?.data?.success) {
          toast({
            title: data?.payload?.data?.message,
          });
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    
  }, [allOrders, productList]);
  return (
    <div className="w-screen h-full overflow-x-hidden flex flex-col">
      <Dialog open={prodDets} onOpenChange={setProdDets}>
        <DialogContent>
          <div className="flex flex-col justify-start">
            <div className="flex items-center justify-around">
              <div className="h-36 w-32 sm:h-44 sm:w-40">
                <img
                  className="w-full h-full object-cover"
                  src={prodDets?.image}
                  alt=""
                />
              </div>
              <div className="flex flex-col sm:text-2xl sm:gap-3">
                <h1 className="">{prodDets?.title}</h1>
                <h1>Brand: {prodDets?.brand}</h1>
                <h1>Category: {prodDets?.category}</h1>
                <div className="flex justify-between">
                  {prodDets?.salePrice > 0 ? (
                    <div className="flex justify-between gap-5">
                      <h1 className="line-through text-red-600">
                        {prodDets?.price}Rs.
                      </h1>
                      <h1 className="">{prodDets?.salePrice}Rs.</h1>
                    </div>
                  ) : (
                    <h1 className="">{prodDets?.price}Rs.</h1>
                  )}
                </div>
              </div>
            </div>

            <h1 className="sm:text-xl sm:mt-4">{prodDets?.description}</h1>
          </div>
          <div className="flex gap-2 mt-1 justify-start lg:mt-3">
            {prodDets?.totalStock && prodDets?.totalStock > 0 ? (
              <Button
                onClick={() => {
                  handleAddTOCart(prodDets);
                }}
                className="h-fit w-full lg:h-auto lg:w-full lg:text-xl"
              >
                Add to cart
              </Button>
            ) : (
              <Button className="bg-red-600 text-white h-fit w-full lg:h-auto lg:w-full lg:text-xl">
                Out of stock
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="slider-container ">
        <Slider {...settings} className="">
          <div className="lg:h-[90vh] h-[25vh] sm:h-[65vh] w-full ">
            <img className="w-full h-full object-center" src={banner1} alt="" />
          </div>
          <div className="lg:h-[90vh] h-[25vh] sm:h-[65vh] w-full">
            <img className="w-full h-full object-center" src={banner2} alt="" />
          </div>
          <div className="lg:h-[90vh] h-[25vh] sm:h-[65vh] w-full">
            <img className="w-full h-full object-center" src={banner4} alt="" />
          </div>
          <div className="lg:h-[90vh] h-[25vh] sm:h-[65vh] w-full">
            <img className="w-full h-full object-center" src={banner3} alt="" />
          </div>
        </Slider>
      </div>
      <div className="flex flex-col mt-8 border-t-2 border-gray-300 pt-2">
        <h1 className="text-center text-xl font-semibold lg:text-4xl">
          Shop By <i className="font-serif">Category</i>
        </h1>

        <div className="flex flex-wrap justify-center sm:justify-around lg:justify-around">
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "men" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Shirt className="h-6 w-6" />
              <h1 className=" font-semibold ">Men</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "women" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2 "
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Venus className="h-6 w-6" />
              <h1 className=" font-semibold ">Women</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "kids" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Baby className="h-6 w-6" />
              <h1 className=" font-semibold ">Kids</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "footwear" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Footprints className="h-6 w-6" />
              <h1 className=" font-semibold ">Footwear</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "accessories" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <HandMetal className="w-6 h-6" />
              <h1 className=" font-semibold ">Accessories</h1>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col mt-4 border-t-2 border-gray-300 pt-2">
        <h1 className="text-center text-xl font-semibold lg:text-4xl">
          Shop By <i className="font-serif">Brand</i>
        </h1>

        <div className="flex flex-wrap justify-center sm:justify-around lg:justify-around">
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "adidas" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <ChartNoAxesColumnIncreasing className="h-6 w-6 " />
              <h1 className=" font-semibold ">Adidas</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "h&m" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2 "
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Heading className="h-6 w-6" />
              <h1 className=" font-semibold ">H&M</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "levis" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Sparkles className="h-6 w-6" />
              <h1 className=" font-semibold ">Levi's</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "puma" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Cat className="h-6 w-6" />
              <h1 className=" font-semibold ">Puma</h1>
            </CardContent>
          </Card>
          <Card
            onClick={() =>
              navigate("/shop/listing", {
                state: { homeFilter: "zara" },
              })
            }
            className="shadow-md cursor-pointer lg:w-52 sm:w-32 sm:h-32 w-2/4 justify-center flex items-center my-2"
          >
            <CardContent className="flex flex-col justify-center py-4 items-center text-muted-foreground hover:text-black">
              <Biohazard className="w-8 h-8" />
              <h1 className=" font-semibold ">Zara</h1>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <h1 className="text-center text-xl font-semibold lg:text-4xl border-t-2 border-gray-300 pt-2">
          <i className="font-serif">Feature</i> Products
        </h1>{" "}
        <div className="w-full h-full flex flex-wrap mt-2 sm:hidden justify-center">
          {productList && productList.length > 0
            ? productList.slice(0, 4).map((e, i) => (
                <div key={i} className="flex-row h-fit lg:pl-6">
                  <ShoppingProductTile
                    products={e}
                    prodDets={prodDets}
                    setProdDets={setProdDets}
                  />
                </div>
              ))
            : null}
        </div>
        <div className="w-full h-full flex-wrap mt-2 hidden sm:flex justify-around pr-4">
          {productList && productList.length > 0
            ? productList.slice(0, 5).map((e, i) => (
                <div key={i} className="flex-row h-fit lg:pl-6">
                  <ShoppingProductTile
                    products={e}
                    prodDets={prodDets}
                    setProdDets={setProdDets}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
