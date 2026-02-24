import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
} from "@radix-ui/react-dropdown-menu";
import {
  ArrowDown,
  ArrowUpDown,
  Hamburger,
  Pencil,
  TableOfContents,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoppingProducts } from "/store/shopSlice";
import ShoppingProductTile from "./ProductsTile";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { addToCart } from "/store/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import Input from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { addReviews } from "/store/reviewsSlice";
import { productReview } from "/store/reviewsSlice";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { searchProduct } from "/store/shopSlice";

const Listing = ({ tick }) => {
  const list = useSelector((state) => state.shopProducts);
  console.log(list.productList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sorted, setSorted] = useState(null);
  const [productList, setProductList] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [brandFilter, setBrandFilter] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsLength, setProductsLength] = useState(null);
  const [ratings, setRatings] = useState(1);
    const [search, setSearch] = useState("");
  
  // let productsLength = null

  const location = useLocation();
  const [prodDets, setProdDets] = useState(null);
  const [review, setReview] = useState("");
  const { toast } = useToast();
  const stars = [1, 2, 3, 4, 5];

  const { orders } = useSelector((state) => state.orders);

  const { userId } = useAuth();
  console.log(userId);

  const { reviews, isLoading } = useSelector((state) => state.reviews);
  console.log(orders);
  console.log(reviews);

  const handleAddTOCart = (prod) => {
    console.log(prod);
    if (!userId) {
      console.log("object");
      return navigate("/auth/login");
    }
    dispatch(addToCart({ productId: prod._id, userId }))
      .then((data) => {
        console.log(data);
        if (data.payload.data.success) {
          toast({
            title: data.payload.data.message,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (location.state?.homeFilter) {
      setCategoryFilter([location.state.homeFilter]);
      setBrandFilter([location.state.homeFilter]);
      setFiltered([location.state.homeFilter]);
      setSearchParams({
        category:
          categoryFilter.length > 0
            ? categoryFilter
            : null || { brand: brandFilter.length > 0 ? brandFilter : null },
      });
    }
  }, [location.state]);

  const handleSort = (value) => {
    console.log(value);
    setSorted(value);
  };

   const handleSerach = (e) => {
      e.preventDefault();
      console.log(search);
      dispatch(searchProduct(search))
        .then((data) => {
          if (data.payload.success) {
            console.log(data);
            toast({
              title: data.payload.data?.message,
            });
          } else {
            toast({
              title: data.payload.data?.message,
            });
          }
        })
        .catch((err) => {
          toast({
            title: data.payload.data?.message,
          });
        });
    };

  const handleCategoryCheck = (value, checked) => {
    console.log(value, checked);
    const currentBrand = searchParams.getAll("brand");
    const currentCategory = searchParams.getAll("category");
    if (checked) {
      const existed = categoryFilter?.includes(value);
      if (!existed) {
        setCategoryFilter([...categoryFilter, value]);
        setFiltered([...filtered, value]);
        setSearchParams({
          category: [...currentCategory, value],
          brand: [currentBrand],
        });
      }
    } else {
      const yo = categoryFilter.filter((e) => e !== value);
      setCategoryFilter(yo);
      setFiltered(yo);
      setSearchParams({
        category: [yo],
        brand: [yo],
      });
    }
  };

  const handleBrandCheck = (value, checked) => {
    console.log(value, checked);
    const currentBrand = searchParams.getAll("brand");
    const currentCategory = searchParams.getAll("category");

    if (checked) {
      const existed = brandFilter.includes(value);
      if (!existed) {
        setBrandFilter([...brandFilter, value]);
        setFiltered([...filtered, value]);
        setSearchParams({
          category: [currentCategory],
          brand: [...currentBrand, value],
        });
      }
    } else {
      const yo = brandFilter.filter((e) => e !== value);
      setBrandFilter(yo);
      setFiltered(yo);
      setSearchParams({
        category: [yo],
        brand: [yo],
      });
    }
  };
  const handleStars = (e) => {
    console.log(e);
    setRatings(e);
  };

  useEffect(() => {
    if (list.productList) {
      setProductList(list?.productList);
    }
  }, [list]);

  useEffect(() => {
    dispatch(fetchShoppingProducts()).then((data) => {
      setProductList(data?.payload.data?.allProducts);
      console.log(data);
    });
  }, [dispatch]);

  useEffect(() => {}, [productList]);

  useEffect(() => {
    setSearchParams({});
  }, []);

  const handleReviews = () => {
    console.log(review);
    console.log(prodDets?._id, review, ratings);
    dispatch(addReviews({ productId: prodDets._id, review, ratings }))
      .then((data) => {
        if (data?.payload?.data?.success) {
          toast({ title: data?.payload?.data?.message });
          setReview("");
          setRatings(1);
          dispatch(productReview({ productId: prodDets?._id }));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-[100%] h-[100%] flex flex-col relative">
      <div>
        <form onSubmit={(e) => handleSerach(e)} className="flex">
          <input
            className="w-full shadow-lg"
            onChange={(e) => {
              setSearch(e.target.value.trim());
            }}
            placeholder="Search Bar"
          ></input>
          <Button
            disabled={search.length <= 2}
            className="sm:w-44 sm:text-xl"
            type="submit"
          >
            Search
          </Button>
        </form>
      </div>
      <Dialog open={prodDets} onOpenChange={setProdDets}>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex flex-col justify-start">
            <div className="flex items-center justify-around">
              <div className="h-28 w-24 sm:h-44 sm:w-40">
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
          <Separator />

          <div
            className={`${reviews?.length > 0 ? "flex flex-col h-52 overflow-auto" : "h-fit"}`}
          >
            {/* fff */}
            {/* fff */}
            {orders && orders?.length > 0 && !isLoading ? (
              orders?.map((e, i) =>
                e?.items &&
                e.items?.length > 0 &&
                e?.orderStatus == "delievered"
                  ? e?.items?.map((k, j) =>
                      k?.productId?._id == prodDets?._id ? (
                        <>
                          <div className="flex flex-col">
                            <h1 className="text-2xl ml-2 sm:ml-0 font-semibold">
                              Write a review
                            </h1>
                            <div className="flex  sm:mt-0 items-center">
                              {stars.map((e, i) => {
                                return (
                                  <Button
                                    className="hover:bg-yellow-300 rounded-full"
                                    size="icon"
                                    onClick={() => handleStars(e)}
                                    variant="ghost"
                                    key={e}
                                  >
                                    {ratings + 1 > e ? "⭐" : "★"}
                                  </Button>
                                );
                              })}
                            </div>
                            <Input
                              type="text"
                              placeholder="Write review here"
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                            />
                            {/* <Input
                              disable={review?.trim()===""}
                              value={review}
                              onValueChannge={(e)=>{
                                console.log(e)
                                setReview(e.target.value)
                              }}
                                className=""
                                placeholder="Write review here"
                              ></Input> */}
                            <Button
                              onClick={() => {
                                handleReviews();
                              }}
                              disabled={review?.trim() == ""}
                              className="w-full mt-1"
                            >
                              Add Review
                            </Button>
                          </div>{" "}
                        </>
                      ) : null,
                    )
                  : null,
              )
            ) : (
              <div className=""></div>
            )}

            {/* fff */}
            {/* fff */}
            <div className="flex flex-col mt-3">
              <h1 className="text-2xl flex items-center gap-1 font-semibold">
                Product reviews <ArrowDown />
              </h1>
              {reviews && reviews?.length > 0 ? (
                reviews.map((e, i) => {
                  return (
                    <div className="flex flex-col">
                      <div className="flex flex-col my-2">
                        <h1 className="flex gap-2 items-center font-semibold uppercase py-1">
                          <span className="w-fit h-full py-1 px-3 rounded-full bg-black text-white">
                            {e?.userId?.username?.[0]}
                          </span>
                          <span className="">{e.userId.username}</span>
                        </h1>
                        <Separator />
                        <h1 className="flex">{e.ratings}⭐</h1>

                        <div className="relative ">
                          <p className="text-xs pb-4">{e.review}</p>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  );
                })
              ) : isLoading ? (
                <div className=" h-full w-full">Loading</div>
              ) : (
                <div className="">No Reviews</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <div className="w-full h-full flex justify-between px-4">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex justify-center items-center">
                  <TableOfContents />{" "}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-extrabold text-4xl justify-start flex">
                    Filters
                  </SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="mt-12 flex flex-col gap-8">
                  <div className="flex flex-col gap-2 font-semibold">
                    <h1 className="text-2xl font-bold">Category</h1>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={categoryFilter?.includes("men")}
                        onCheckedChange={(checked) =>
                          handleCategoryCheck("men", checked)
                        }
                      />
                      Men
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={categoryFilter?.includes("women")}
                        onCheckedChange={(checked) =>
                          handleCategoryCheck("women", checked)
                        }
                      />
                      Women
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={categoryFilter?.includes("kids")}
                        onCheckedChange={(checked) =>
                          handleCategoryCheck("kids", checked)
                        }
                      />
                      Kids
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={categoryFilter?.includes("footwear")}
                        onCheckedChange={(checked) =>
                          handleCategoryCheck("footwear", checked)
                        }
                      />
                      Footwear
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={categoryFilter?.includes("accessories")}
                        onCheckedChange={(checked) =>
                          handleCategoryCheck("accessories", checked)
                        }
                      />
                      Accessories
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 font-semibold">
                    <h1 className="text-2xl font-bold">Brand</h1>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={brandFilter.includes("adidas")}
                        onCheckedChange={(checked) =>
                          handleBrandCheck("adidas", checked)
                        }
                      />
                      Adidas
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={brandFilter.includes("h&m")}
                        onCheckedChange={(checked) =>
                          handleBrandCheck("h&m", checked)
                        }
                      />
                      H&M
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={brandFilter.includes("levis")}
                        onCheckedChange={(checked) =>
                          handleBrandCheck("levis", checked)
                        }
                      />
                      Levis's
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={brandFilter.includes("puma")}
                        onCheckedChange={(checked) =>
                          handleBrandCheck("puma", checked)
                        }
                      />
                      Puma
                    </div>
                    <div className="flex gap-1 items-center">
                      <Checkbox
                        checked={brandFilter.includes("zara")}
                        onCheckedChange={(checked) =>
                          handleBrandCheck("zara", checked)
                        }
                      />
                      Zara
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:flex  pr-4 sticky ">
            <div className="mt-12 flex flex-col gap-8">
              <h1 className="text-black text-4xl font-extrabold">Filters</h1>
              <div className="flex flex-col gap-2 font-semibold">
                <h1 className="text-2xl font-bold">Category</h1>
                <div
                  onClick={() =>
                    navigate("/shop/listing", {
                      state: { homeFilter: "men" },
                    })
                  }
                  className="flex gap-1 items-center"
                >
                  <Checkbox
                    checked={categoryFilter?.includes("men")}
                    onCheckedChange={(checked) =>
                      handleCategoryCheck("men", checked)
                    }
                  />
                  Men
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={categoryFilter?.includes("women")}
                    onCheckedChange={(checked) =>
                      handleCategoryCheck("women", checked)
                    }
                  />
                  Women
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={categoryFilter?.includes("kids")}
                    onCheckedChange={(checked) =>
                      handleCategoryCheck("kids", checked)
                    }
                  />
                  Kids
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={categoryFilter?.includes("footwear")}
                    onCheckedChange={(checked) =>
                      handleCategoryCheck("footwear", checked)
                    }
                  />
                  Footwear
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={categoryFilter?.includes("accessories")}
                    onCheckedChange={(checked) =>
                      handleCategoryCheck("accessories", checked)
                    }
                  />
                  Accessories
                </div>
              </div>

              <div className="flex flex-col gap-2 font-semibold">
                <h1 className="text-2xl font-bold">Brand</h1>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={brandFilter.includes("adidas")}
                    onCheckedChange={(checked) =>
                      handleBrandCheck("adidas", checked)
                    }
                  />
                  Adidas
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={brandFilter.includes("h&m")}
                    onCheckedChange={(checked) =>
                      handleBrandCheck("h&m", checked)
                    }
                  />
                  H&M
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={brandFilter.includes("levis")}
                    onCheckedChange={(checked) =>
                      handleBrandCheck("levis", checked)
                    }
                  />
                  Levi
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={brandFilter.includes("puma")}
                    onCheckedChange={(checked) =>
                      handleBrandCheck("puma", checked)
                    }
                  />
                  Puma
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={brandFilter.includes("zara")}
                    onCheckedChange={(checked) =>
                      handleBrandCheck("zara", checked)
                    }
                  />
                  Zara
                </div>
              </div>
            </div>
          </div>

          <div className=" lg:flex lg:flex-col w-full">
            <div className="flex gap-2 lg:px-2 lg:py-2 justify-end">
              <h1 className="lg:text-xl lg:w-24 h-fit lg:mt-0 mt-2 flex justify-center">
                {filtered?.length > 0 ? null : productList?.length} Products
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <ArrowUpDown />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="bg-white lg:mt-20 mt-12 mr-6"
                >
                  <DropdownMenuRadioGroup
                    value={sorted}
                    onValueChange={handleSort}
                  >
                    <h1>Price</h1>
                    <DropdownMenuRadioItem value="low">
                      Low to High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high">
                      High to Low
                    </DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full h-full flex-wrap justify-center lg:justify-start lg:flex hidden border-x-2 border-gray-200">
              {productList && productList?.length > 0
                ? productList
                    // .filter(
                    //   (brand) =>
                    //     !brandFilter?.length > 0 ||
                    //     brandFilter.includes(brand.brand)
                    // )
                    // .filter(
                    //   (category) =>
                    //     !categoryFilter?.length > 0 ||
                    //     categoryFilter?.includes(category.category)
                    // )
                    // .sort((a,b)=>{
                    //   if(!sorted) return 0
                    //   const priceA = a.price||a.salePrice
                    //   const priceB = b.price||b.salePrice
                    //   if(sorted=="low"){
                    //     return priceA-priceB
                    //   }
                    //   if(sorted=="high"){
                    //     return priceB-priceA
                    //   }
                    // })
                    .filter(
                      (product) =>
                        !filtered?.length > 0 ||
                        filtered.includes(product.brand) ||
                        filtered.includes(product.category),
                    )
                    .sort((a, b) => {
                      if (!sorted) return 0;
                      const priceA = a.price || a.salePrice;
                      const priceB = b.price || b.salePrice;

                      return sorted == "low"
                        ? priceA - priceB
                        : priceB - priceA;
                    })
                    .map((e, i) => (
                      <div key={i} className="flex-row h-fit lg:pl-5">
                        <ShoppingProductTile
                          products={e}
                          filteredProducts={filteredProducts}
                          prodDets={prodDets}
                          setProdDets={setProdDets}
                        />
                      </div>
                    ))
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full h-auto flex flex-wrap justify-center lg:justify-start lg:hidden">
        {productList && productList?.length > 0
          ? productList
              // .filter(
              //   (brand) =>
              //     !brandFilter?.length > 0 || brandFilter.includes(brand.brand)
              // )
              // .filter(
              //   (category) =>
              //     !categoryFilter?.length > 0 ||
              //     categoryFilter?.includes(category.category)
              // )
              // .sort((a,b)=>{
              //   if(!sorted) return 0
              //   const priceA = a.price||a.salePrice
              //   const priceB = b.price||b.salePrice
              //   if(sorted=="low"){
              //     return priceA-priceB
              //   }
              //   if(sorted=="high"){
              //     return priceB-priceA
              //   }
              // })
              .filter(
                (product) =>
                  !filtered?.length > 0 ||
                  filtered.includes(product.brand) ||
                  filtered.includes(product.category),
              )
              .sort((a, b) => {
                if (!sorted) return 0;
                const priceA = a.price || a.salePrice;
                const priceB = b.price || b.salePrice;

                return sorted == "low" ? priceA - priceB : priceB - priceA;
              })
              .map((e, i) => (
                <div key={i} className="flex-row h-fit lg:pl-6">
                  <ShoppingProductTile
                    products={e}
                    filteredProducts={filteredProducts}
                    prodDets={prodDets}
                    setProdDets={setProdDets}
                  />
                </div>
              ))
          : null}
      </div>
    </div>
  );
};

export default Listing;
