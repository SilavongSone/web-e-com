const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read,
  update,
  remove,
  listBy,
  searchFilters,
} = require("../controllers/product");

// @ENDPOINT http://localhost:5000/api/product
router.post("/product", create);
router.get("/products/:count", list);
router.get("/product/:id", read);
router.get("/product/:id", update);
router.delete("/product/:id", remove);
router.post("/productBy", listBy);
router.post("/search/filters", searchFilters);

module.exports = router;
