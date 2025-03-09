import Valkey from "iovalkey";

const cache = new Valkey();
export const rateLimitMiddleware = async (req, res, next) => {
    const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddres ||
        "localhost";
    const limit = 5;

    await cache.incr(ip);
    await cache.expire(ip, 10);
    const requestNumber = await cache.get(ip);

    if (+requestNumber > limit) {
        return res.status(429).json({
            data: "Limite excedido",
        });
    }

    next();
};