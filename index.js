import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "Razorpay";
import { productsRouter } from "./Routes/productRouter.js";
// import bcrypt from "bcrypt";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/products", productsRouter);

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

const createConnection = async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Db connected");
  return client;
};

export const client = await createConnection();

app.get("/", (req, res) => {
  res.send("home page");
});

// app.post("/razorpay", async (req, res) => {
//   const payment_capture = 1;
//   const { amount } = req.body;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency,
//     receipt: "qwsaq1",
//     payment_capture,
//   };

//   try {
//     const response = await razorpay.orders.create(options);
//     console.log(response);
//     res.json({
//       id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.post("/signup", async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await getHashedPassword(password);

//   const data = await client
//     .db("rental_app")
//     .collection("users")
//     .findOne({ username: username });

//   if (!data) {
//     const createUser = await client
//       .db("rental_app")
//       .collection("users")
//       .insertOne({ username: username, password: hashedPassword });

//     res.send({ message: "successfully created" });
//   } else {
//     res.send({ message: "username exists" });
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await getHashedPassword(password);

//   // console.log(hashedPassword);

//   const data = await client
//     .db("rental_app")
//     .collection("users")
//     .findOne({ username: username });

//   // console.log(data);

//   if (!data) {
//     res.send({ message: "invalid Credentails" });
//   } else {
//     const isCorrect = await bcrypt.compare(password, hashedPassword);
//     console.log(isCorrect);
//     if (isCorrect) {
//       res.send({ message: "logged in successful" });
//     } else {
//       res.send({ message: "incorrect password" });
//     }
//   }
//   res.send({ message: "successfully created" });
// });

// const getHashedPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   console.log("q2w2e ", hashedPassword);
//   return hashedPassword;
// };

app.listen(PORT, () => {
  console.log(`The server started in ${PORT}`);
});
