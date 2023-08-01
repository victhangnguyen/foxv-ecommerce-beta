import _ from "lodash";
import mongoose from "mongoose";
import path from "path";
import config from "../config/index.js";

//! imp Library
import Logging from "../library/Logging.js";
//! imp Utils
import * as fileHelper from "../utils/file.js";
import { execWithTransaction } from "../utils/transaction.js";
import { getFileNameFromURL } from "../utils/url.js";

//! imp Models
import Product from "../models/Product.js";
//! imp Services
import productService from "../services/productService.js";

export const getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Product does not exist!");
    }

    const product = await Product.findById(productId)
      .populate("category")
      .populate("subCategories")
      .exec();

    if (!product) {
      throw new Error("Product does not exist!");
    }

    res.status(200).json({
      success: true,
      message: "Get a Product by id successful!",
      data: { product },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export async function getProductBySlug(req, res, next) {
  const slug = req.params.slug;
  try {
    const product = await Product.findOne({ slug })
      .populate("category")
      .populate("subCategories")
      .exec();
    if (!product) {
      throw new Error("Product does not exist!");
    }
    res.status(200).json({
      success: true,
      message: "Get Product by Slug successful!",
      data: { product },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export const getProducts = async (req, res, next) => {
  try {
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! All of Products with skip and limit
export const getProductList = async (req, res, next) => {
  let { sort, order, page, perPage } = req.query;

  if (page < 1) {
    page = 1;
  }

  try {
    const products = await Product.find({})
      .sort([
        [sort, order],
        ["_id", "desc"],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({})
      .estimatedDocumentCount()
      .exec();

    return res.status(200).json({
      success: true,
      message: "Get Product List sucessful!",
      data: { products, productsCount },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const createProduct = async (req, res, next) => {
  const images = req.files;

  try {
    //! initialValues
    if (!req.body.category) req.body.category = null;

    if (images?.length < 1) {
      throw new Error("Chưa đính kèm tập tin hình ảnh!");
    }

    const productData = {
      ...req.body,
      images: images?.map(
        (img) => `${config.db.server.baseURL}/images/products/${img.filename}`
      ),
    };

    const product = await execWithTransaction(async (session) => {
      const result = await productService.createProduct(productData, session);

      return result;
    });

    return res.status(201).json({
      success: true,
      messsage: "Create a new product successfull!",
      data: { product },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! @desc     Update One Product
//! @route    PUT /api/products/:productId/update
//! @access   Admin
export const updateProductById = async (req, res, next) => {
  //! Frontend put Empty Array or Image Array
  const productId = req.params.productId;
  let { images, imagesArray, ...otherProps } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found!");
    }

    const updatedProduct = await execWithTransaction(async (session) => {
      const currentImagesArray = product.images;
      const imageUrlsArray = imagesArray
        .filter((imgObj) => imgObj.type?.includes("url"))
        .map((imgObj) => imgObj.image);

      const isDifferenceArray = _.difference(
        currentImagesArray,
        imageUrlsArray
      ); // => Delete function

      const isExistImages = images?.length; //! => Edit, Add function

      let productData;
      let fileDir, files;

      if (isExistImages || isDifferenceArray) {
        //! Update Information and Images
        //! update images prop

        const updatedImages = imagesArray.map((imageObj) => {
          if (imageObj.type?.includes("image")) {
            //! File => get image url
            //! update File base on index of Arrray
            const imgObsArray = imagesArray?.filter((imgObj) =>
              imgObj.type?.includes("image")
            );
            const imageIndex = imgObsArray.findIndex(
              (imgObj) => imageObj.lastModified === imgObj.lastModified
            );
            const imageName = images[imageIndex].filename;

            return `${config.db.server.baseURL}/images/products/${imageName}`;
          } else {
            return imageObj.image;
          }
        });

        productData = { ...otherProps, images: updatedImages };

        //! Check images-link
        fileDir = path.join(fileHelper.rootDir, "images", "products");
        const currentImages = product.images;
        //! get the Difference url
        const deletedImages = _.difference(currentImages, updatedImages);
        console.log(
          "__Debugger__product\n__updateProductById__currentImages: ",
          currentImages,
          "\n"
        );
        console.log(
          "__Debugger__product\n__updateProductById__updatedImages: ",
          updatedImages,
          "\n"
        );
        files = deletedImages.map((url) => getFileNameFromURL(url));

        const isReadable = await fileHelper.checkFilesPermission(
          fileDir,
          files
        );
      } else {
        //! only Update Infomation
        productData = { ...otherProps };
      }

      const result = await productService.updateProductById(
        productId,
        productData,
        session
      );

      if (isExistImages) {
        //! Delete old-images after Check images-link
        const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
        Logging.info(deletedFiles);
      }

      return result;
    });

    // const updatedProduct = await Product.findByIdAndUpdate(
    //   productId,
    //   productData,
    //   {
    //     new: true,
    //   }
    // );

    return res.status(201).json(updatedProduct);
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const deleteProductById = async (req, res, next) => {
  const productId = req.query.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found!");
    }

    const deletedProduct = await execWithTransaction(async (session) => {
      //! Check images-link
      const fileDir = path.join(fileHelper.rootDir, "images", "products");
      const files = product.images.map((url) => getFileNameFromURL(url));

      const isFilesPermission = await fileHelper.checkFilesPermission(
        fileDir,
        files
      );

      if (!isFilesPermission) {
        throw new Error("The file or directory is corrupted and unreadable");
      }

      const result = await productService.deleteProductById(productId, session);

      const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
      Logging.info(deletedFiles);

      return result;
    });

    res.status(200).json({
      success: true,
      message: "Delete One Product successful!",
      data: { deletedProduct },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const deleteProductsByIds = async (req, res, next) => {
  const productIds = req.query.productIds;
  console.log("productIds: ", productIds);
  try {
    const deletedProducts = await execWithTransaction(async (session) => {
      if (!productIds.length) return; //! exists productIds

      //! checkDulicate
      let imageFiles = [];

      const productQuene = productIds.map(async (productId) => {
        try {
          const product = await Product.findById(productId);
          const files = product.images.map((url) => getFileNameFromURL(url));

          files.forEach((file) => {
            const isExistItem = imageFiles.includes(file);
            if (isExistItem) {
              throw new Error("Cannot delete the duplicate images of products");
            } else {
              imageFiles.push(file);
            }
          });

          //! Check images-link
          const fileDir = path.join(fileHelper.rootDir, "images", "products");
          const isFilesPermission = await fileHelper.checkFilesPermission(
            fileDir,
            files
          );

          if (!isFilesPermission) {
            throw new Error(
              "The file or directory is corrupted and unreadable"
            );
          }

          const deletedProduct = await productService.deleteProductById(
            productId,
            session
          );

          const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
          Logging.info(deletedFiles);

          return deletedProduct;
        } catch (error) {
          throw error;
        }
      });

      const deletedProducts = await Promise.all(productQuene);

      res.status(200).json({
        success: true,
        message: "Get many products successful!",
        data: { deletedProducts },
      });
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export async function getProductsByFilters(req, res, next) {
  const { sort, order, page, perPage, keyword, price, category } = req.query;

  try {
    let match = {};

    //! filterOpt: keyword
    if (keyword) {
      match.$or = [
        { name: new RegExp(keyword, "i") },
        { status: new RegExp(keyword, "i") },
        // { category: new RegExp(keyword, 'i') },
      ];
    }

    //! filterOpt: price
    if (price) {
      const priceGte = price.split("-")[0];
      const priceLte = price.split("-")[1];
      match.price = {
        $gte: +priceGte,
        $lte: +priceLte,
      };
    }
    //! filterOpt: category
    if (category) {
      match.category = mongoose.Types.ObjectId(category);
    }

    const result = await Product.aggregate([
      { $match: match },
      //! populate: category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      //! populate: subCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategories",
          foreignField: "_id",
          as: "subCategories",
        },
      },
      { $sort: { [sort]: +order, _id: 1 } },
      {
        $facet: {
          products: [{ $skip: (page - 1) * perPage }, { $limit: +perPage }],
          productsCount: [{ $count: "count" }],
        },
      },
    ]).exec();

    const products = result[0].products;
    const productsCount = result[0].productsCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      message: "Get many products successful!",
      data: { products, productsCount },
    });
  } catch (error) {
    Logging.error("Error__ctrls__product: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
