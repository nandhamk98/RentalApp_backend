import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "Razorpay";
import { productsRouter } from "./Routes/productRouter.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/products", productsRouter);

// const auth = (req, res, next) => {
//   try {
//     const token = request.header("x-auth-token");
//     jwt.verify(token, process.env.SECRET_KEY);
//     next();
//   } catch (err) {
//     console.error(err);
//   }
// };

// app.use(auth());

const razorpay = new Razorpay({
  key_id: "rzp_test_30sii7OAmoxSM0",
  key_secret: "L9js2X9YAztAhcU7ytNsc7Sn",
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

// app.post("/verification", (req, res) => {
//   // do a validation
//   const secret = "12345678";

//   console.log(req.body);

//   const crypto = require("crypto");

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   console.log(digest, req.headers["x-razorpay-signature"]);

//   if (digest === req.headers["x-razorpay-signature"]) {
//     console.log("request is legit");
//     // process it
//     require("fs").writeFileSync(
//       "payment1.json",
//       JSON.stringify(req.body, null, 4)
//     );
//   } else {
//     // pass it
//   }
//   res.json({ status: "ok" });
// });

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const { amount } = req.body;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: "qwsaq1",
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await getHashedPassword(password);

  const data = await client
    .db("rental_app")
    .collection("users")
    .findOne({ username: username });

  if (!data) {
    const createUser = await client
      .db("rental_app")
      .collection("users")
      .insertOne({ username: username, password: hashedPassword });

    res.send({ message: "successfully created" });
  } else {
    res.send({ message: "username exists" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const data = await client
    .db("rental_app")
    .collection("users")
    .findOne({ username: username });

  if (!data) {
    res.send({ message: "invalid Credentails" });
  } else {
    const isCorrect = bcrypt.compare(password, hashedPassword);
    if (isCorrect) {
      res.send({ message: "logged in successful" });
    } else {
      res.send({ message: "incorrect password" });
    }
  }

  res.send({ message: "successfully created" });
});

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

app.listen(PORT, () => {
  console.log(`The server started in ${PORT}`);
});
