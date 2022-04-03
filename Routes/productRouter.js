import express from "express";
import { client } from "../index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let reqData = req.body;
  let data = await client
    .db("rental_app")
    .collection("products")
    .insertMany(reqData);
  res.send(data);
});

router.get("/", async (req, res) => {
  let data = await client
    .db("rental_app")
    .collection("products")
    .find({ available: true })
    .toArray();
  res.send(data);
});

router.post("/list-cart", async (req, res) => {
  let reqData = req.body;
  let objectIds = reqData.map((id) => ObjectId(id));
  let data = await client
    .db("rental_app")
    .collection("products")
    .find({ _id: { $in: objectIds } })
    .toArray();
  res.send(data);
});
router.get("/category/:category", async (req, res) => {
  let { category } = req.params;
  console.log(category);
  let data = await client
    .db("rental_app")
    .collection("products")
    .find({ category: category })
    .toArray();
  res.send(data);
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  let data = await client
    .db("rental_app")
    .collection("products")
    .findOne({ _id: id });
  res.send(data);
});

export const productsRouter = router;
