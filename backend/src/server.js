import path from "path";
import url from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";

//! imp Middleware
import { setRequestHeaders } from "./middleware/requestHeader.js";
import { passport } from "./middleware/passport/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//! imp Library
import Logging from "./library/Logging.js";
//! imp Config
import config from "./config/index.js";
//! imp Routes
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import subCategoryRouter from "./routes/subCategory.js";
import roleRouter from "./routes/role.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import paymentRouter from "./routes/payment.js";

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());

//! Middleware with standard www and add request with ipv4
app.use(setRequestHeaders);

//! Initialize passport on the app
app.use(passport.initialize());

//! static public
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

//! static /images
const imagesDir = path.join(__dirname, "..", "images");
app.use("/images", express.static(imagesDir));

//! static /data
const dataDir = path.join(__dirname, "..", "data");
app.use("/data", express.static(dataDir));

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", subCategoryRouter);
app.use("/api", roleRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", paymentRouter);

//! Not Found
app.use(notFound);
//! Error Handling
app.use(errorHandler);

config.db
  .connectMongoDB()
  .then((result) => {
    app.listen(config.db.server.port, () => {
      Logging.log(`Server running on port ${config.db.server.port} 🚀🚀🚀`);
      //! fake data
    });
  })
  .catch((err) => {
    console.log(err);
  });
