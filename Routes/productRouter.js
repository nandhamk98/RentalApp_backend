import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";
import cors from "cors";

const router = express.Router();
router.use(cors());

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

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let objId = ObjectId(id);
  let data = await client
    .db("rental_app")
    .collection("products")
    .deleteOne({ _id: objId });

  res.send(data);
});

router.put("/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let reqData = req.body;
  let objId = ObjectId(id);
  let data = await client
    .db("rental_app")
    .collection("products")
    .updateOne({ _id: objId }, { $set: reqData });

  res.send(data);
});

export const productsRouter = router;
