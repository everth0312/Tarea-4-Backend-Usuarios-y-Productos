import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import usersRouter from "./routers/users/users-router.js";
import productsRouter from "./routers/products/products-router.js";
import { Database } from "./database/db.js";
import {rateLimitMiddleware} from "./middlewares/rateLimit.js"
import http from "http";
import { SocketHandler } from "./sockets/socket.js";

const app = express();
const server = http.createServer(app);

const database = new Database();
database.setup();

app.use(cors());
app.use(morgan());
app.use(bodyParser());
app.use(rateLimitMiddleware);

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

new SocketHandler(server);

//app.listen(8000, () => {
//    console.log("App running on port 8000");
//});

server.listen(8000);
console.log("App running on port 8000");
