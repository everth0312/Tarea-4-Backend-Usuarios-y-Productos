import { Router } from "express";
import {
    CreateProducts,
    DeleteProducts,
    GetAllProducts,
    UpdateProducts,
} from "./products-controllers.js";
import { body, param } from "express-validator";
import validate from "../../middlewares/validate.js";
import { middlewareCustom } from "../../middlewares/middlewareCustom.js";
import { authMiddleware } from "../../middlewares/aut.js";

const productsRouter = Router();

productsRouter.get("/", GetAllProducts);

productsRouter.post(
    "/",
    [
        body("name").exists().isString().isAlphanumeric(),
        body("price").exists().isNumeric(),
        body("stock").exists().isNumeric(),
        validate,
    ],
    CreateProducts
);

//  [Patch] localhost:8000/products/2
productsRouter.patch(
    "/:id",
    [
        authMiddleware,
        param("id").exists().isNumeric(),
        body("id").not().exists(),
        body("name").optional().isString().isAlphanumeric(),
        body("price").optional().isNumeric(),
        body("stock").optional().isNumeric(),
        validate,
    ],
    UpdateProducts
);
//  [DELETE] localhost:8000/products/2
productsRouter.delete(
    "/:id",
    [authMiddleware, param("id").exists().isNumeric(), validate],
    DeleteProducts
);

export default productsRouter;