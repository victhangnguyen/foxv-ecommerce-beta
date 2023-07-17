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

export default {
  createProduct,
  updateProductById,
  deleteProductById,
};
