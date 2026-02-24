import Products from "../../models/products-model/index.js";

//Fetch Product
export const fethShoppingProducts = async (req, res) => {
  try {
    const allProducts = await Products.find();
    if (!allProducts)
      return res.json({ success: false, message: "No products Here" });

    res.json({ success: true, message: "All Products", allProducts });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const searchProduct = async (req, res) => {
  const { search } = req.params;
  console.log(search)
  if (!search) return res.json({ success: false, message: "not get search" });

  try {
    const products = await Products.find();

    const result = products.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search) ||
        e.brand.toLowerCase().includes(search) ||
        e.category.toLowerCase().includes(search)
    );
    if (result.length==0) return res.json({ success: true, message: "Nothing Matches" });

    res.json({ success: true, message: "Result", result });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};