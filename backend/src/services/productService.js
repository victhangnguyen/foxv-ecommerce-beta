import mongoose from "mongoose";
import generateSlug from "../utils/generateSlug.js";
//! imp Models
import Product from "../models/Product.js";
//! imp Utils
import * as fileHelper from "../utils/file.js";

async function createProduct(productData, session) {
  const { name } = productData;

  const newSlug = await generateSlug(name, "Product");

  const createdProduct = await Product.create(
    //! mongoose v 7.0.5
    // Create a new character within a transaction. Note that you **must**
    // pass an array as the first parameter to `create()` if you want to
    // specify options.
    [{ ...productData, slug: newSlug }],
    { session }
  );

  return createdProduct;
}

async function updateProductById(productId, productData, session) {
  const { name } = productData;
  const newSlug = await generateSlug(name, "Product");

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { ...productData, slug: newSlug },
    {
      new: true,
      session: session,
    }
  );

  if (!updatedProduct) {
    throw new Error("Product does not exist!"); //! Forbidden
  }

  return updatedProduct;
}

async function deleteProductById(productId, session) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Product does not exist!");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found!");
  }

  const deletedProduct = await product.remove({ session });

  return deletedProduct;
}

async function reserveProducts(items, session) {
  try {
    //! Handle Stock with session
    const products = await Promise.all(
      items.map(async (item) => {
        console.log(
          "__Debugger__productService\n:::item :::item: ",
          item,
          "\n"
        );
        const product = await Product.findById(item.product);

        return {
          ...product._doc,
          isEnoughStock: product.isEnoughStock(+item.quantity),
        };
      })
    );

    const insufficientStockArray = products.filter(
      (product) => !product.isEnoughStock
    );

    if (insufficientStockArray.length) {
      throw new Error(
        `${insufficientStockArray[0].name} does not have enough products, just has: ${insufficientStockArray[0].quantity} products!`
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export default {
  createProduct,
  updateProductById,
  deleteProductById,
  reserveProducts,
};
