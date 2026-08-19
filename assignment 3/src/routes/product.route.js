// ============================================================================
// src/routes/product.route.js
//
// ROUTE LAYER = TRAFFIC POLICE 🚦
//
// Iska kaam SIRF itna: "kaunsa URL + method aaye to kaunsi middleware chain chale"
// Yahan koi logic NAHI likhna.
// (Pehle getAllProducts ka poora DB code isi file me pada tha — ab wo service me hai.)
//
// Middleware chain LEFT se RIGHT chalti hai:
//   authMiddleware -> authorization -> validationMiddleware -> controller
//   (kaun ho?)        (allowed ho?)    (data sahi hai?)        (ab kaam karo)
//
// Koi bhi step fail hua -> next(error) -> baaki sab SKIP -> seedha errorHandler.
// ============================================================================

const express = require("express");
const productRouter = express.Router();

const productController = require("../controller/productController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const authMiddleware = require("../middlewares/authValidation");
const authorization = require("../middlewares/authorization");
const abacMiddleware = require("../middlewares/abacMiddleware");

const {
  createProductSchema,
  getAllProductsSchema,
  searchProductSchema,
  productIdSchema,
  updateProductSchema,
} = require("../validationSchema/productValidationSchema");

// ============================================================================
// 1) CREATE  ->  POST /products/createProduct
// ============================================================================
productRouter.post(
  "/createProduct",
  authMiddleware,                              // 1. Token valid hai?   fail -> 401
  abacMiddleware("product:create"),            // 2. ABAC Policy Check
  validationMiddleware(createProductSchema),   // 3. Body sahi hai?     fail -> 400
  productController.createProduct              // 4. Ab kaam karo
);

// ============================================================================
// 2) GET ALL  ->  GET /products/getAllProducts?category=Books&page=1&limit=10
// ============================================================================
productRouter.get(
  "/getAllProducts",
  authMiddleware,
  abacMiddleware("product:read"),
  validationMiddleware(getAllProductsSchema, "query"),
  productController.getAllProducts
);

// ============================================================================
// 3) SEARCH  ->  GET /products/searchProducts?q=laptop
// ============================================================================
productRouter.get(
  "/searchProducts",
  authMiddleware,
  abacMiddleware("product:read"),
  validationMiddleware(searchProductSchema, "query"),
  productController.searchProducts
);

// ============================================================================
// 4) GET ONE  ->  GET /products/getSingleProduct/:id
// ============================================================================
productRouter.get(
  "/getSingleProduct/:id",
  authMiddleware,
  abacMiddleware("product:read"),
  validationMiddleware(productIdSchema, "params"),
  productController.getSingleProduct
);

// ============================================================================
// 5) UPDATE  ->  PATCH /products/updateSingleProduct/:id
// ============================================================================
productRouter.patch(
  "/updateSingleProduct/:id",
  authMiddleware,
  abacMiddleware("product:update"),
  validationMiddleware(productIdSchema, "params"),
  validationMiddleware(updateProductSchema),
  productController.updateSingleProduct
);

// ============================================================================
// 6) DELETE  ->  DELETE /products/deleteProduct/:id
// ============================================================================
productRouter.delete(
  "/deleteProduct/:id",
  authMiddleware,
  abacMiddleware("product:delete"),
  validationMiddleware(productIdSchema, "params"),
  productController.deleteProduct
);

module.exports = productRouter;

// ============================================================================


// Express routes ko UPAR SE NEECHE match karta hai. PEHLA match jeet jaata hai.
//
// Humare naam verb-style hain (/searchProducts, /getSingleProduct/:id) isliye
// koi clash nahi ho raha. LEKIN agar aap REST style pe jaate:
//
//     productRouter.get("/:id", ...);       // ⬅ ye pehle likh diya
//     productRouter.get("/search", ...);    // ⬅ ye KABHI nahi chalega
//
// to /products/search hit karne pe Express samajhta ki id = "search",
// aur "Invalid ObjectId" 400 error aata. Student ghanton debug karta hai
// ki controller chal kyun nahi raha — kyunki DUSRA route match ho gaya!
//
// RULE: SPECIFIC routes hamesha DYNAMIC (:param) routes se PEHLE likho.
// ============================================================================
