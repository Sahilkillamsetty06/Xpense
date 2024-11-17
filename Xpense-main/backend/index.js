  import express from "express";
  import cors from "cors";
  import { connectDB } from "./DB/Database.js";
  import bodyParser from "body-parser";
  import dotenv from "dotenv";
  import helmet from "helmet";
  import morgan from "morgan";
  import transactionRoutes from "./Routers/Transactions.js";
  import userRoutes from "./Routers/userRouter.js";
  import loanRouter from "./Routers/loanRoutes.js"
  import serverless from "serverless-http";
  import cron from 'node-cron';
  import User from "./models/UserSchema.js";
  import friendRouter from "./Routers/friendRoutes.js"

  dotenv.config();
  const app = express();

  const port = process.env.PORT;

  connectDB();

  const allowedOrigins = [
    'https://xpense-l4m1.vercel.app',
    "http://localhost:3000",
    "http://192.168.40.198:3000",
    "http://192.168.0.110:3000",
    "http://192.168.125.98:3000",
    "http://192.168.40.44:3000"
    // add more origins as needed
  ];

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin:allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");  // '*' allows all origins
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Router
  app.use("/api/v1", transactionRoutes);
  app.use("/api/auth", userRoutes);
  app.use("/api/loan",loanRouter)
  app.use("/api/friends",friendRouter)

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  


  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });

  cron.schedule('0 0 1 * *', async () => {
    console.log("cron job insideee")
    try {
      // Update all users, setting each category's limitUtilised to 0
      await User.updateMany(
        { categories: { $exists: true } },
        { $set: { "categories.$[].limitUtilised": 0 } }
      );
      console.log('All categories limitUtilised reset to 0');
    } catch (err) {
      console.error('Error resetting limitUtilised:', err);
    }
  });