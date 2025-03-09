import { query, Router } from "express";
import { middlewareCustom } from "../../middlewares/middlewareCustom.js";
import {
    CreateUsers,
    DeleteUser,
    GetAllUsers,
    Login,
    UpdateUser,
} from "./users-controllers.js";
import { body, param } from "express-validator";
import validate from "../../middlewares/validate.js";
import { authMiddleware} from "../../middlewares/aut.js";

const usersRouter = Router();

usersRouter.get("/", [authMiddleware], GetAllUsers);

usersRouter.post(
    "/",
    [
        body("name").exists().isString().isAlphanumeric(),
        body("email").exists().isString().isEmail(),
        body("password").exists().isString().isLength({ min: 4 }),
        validate,
    ],
    CreateUsers
);

usersRouter.post(
    "/login",
    [
        body("email").exists().isString().isEmail(),
        body("password").exists().isString().isLength({ min: 4 }),
        validate,
    ],
    Login
);


//  [Patch] localhost:8000/users/2
usersRouter.patch(
    "/:id",
    [
        authMiddleware,
        param("id").exists().isNumeric(),
        body("id").not().exists(),
        body("name").optional().isString().isAlphanumeric(),
        body("email").optional().isString().isEmail(),
        body("password").optional().isString().isLength({ min: 4 }),
        validate,
    ],
    UpdateUser
);

//  [DELETE] localhost:8000/users/2
usersRouter.delete(
    "/:id",
    [authMiddleware, param("id").exists().isNumeric(), validate],
    DeleteUser
);



export default usersRouter;
