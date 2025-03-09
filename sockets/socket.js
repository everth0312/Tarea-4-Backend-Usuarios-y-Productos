import { Server } from "socket.io";
import Products from "../routers/products/products-entity.js";
//import { disconnect } from "process";

export class SocketHandler {
    iosocket;
    /**
     *
     * 1 evento que emite el frontend para actualizar el stock y lo escucha el backend
     * 1 evento que emite el backend para devolver el stock actualizado y que escucha el frontend
     * El backend escucha update-stock
     * El backend emite el stock-updated
     */

    constructor(serverHttp) {
        this.iosocket = new Server(serverHttp);
        this.initEvents();
    }
/*
    initEvents() {
        this.iosocket.on("connection", (socket) => {
            console.log("Cliente conectado", socket.id); // añadí en este punto el socket.id

            socket.on("update-stock", async (payload) => {
                const { productId } = payload;
                const resp = await this.updateProductStock(productId);
                if (!resp) {
                    socket.emit("error", "No existe el producto");
                    return; // se agrega este return
                }

                if (resp.stock === 0) {
                    socket.emit("stock-warning", { message: "⚠️ Stock agotado", productId });
                }

                this.iosocket.emit("stock-updated", {
                    message: " Se ha actualizado el inventario",
                    product: resp,
                }); // se agrega desde el stock ===0 hasta acá
            });

            socket.on("disconnect", () => {
                console.log("Cliente disconnected");
            });
        });
    }

    async updateProductStock(productId) {
        const exists = await Products.findOne({ where: { id: productId } });

        if (!exists) {
            return null;
        }
        if (exists.stock === 0) {
            return true;
        }
        const updateProduct = { ...exists, stock: exists.stock - 1 };
        // const updateProduct = exists;
        // updateProduct.stock = updateProduct.stock - 1;
        await Products.update(updateProduct, {
            where: {
                id: productId,
            },
        });
        const newProduct = await Products.findOne({ where: { id: productId } });

        this.iosocket.emit("stock-updated", newProduct);
    }*/

        initEvents() {
            this.iosocket.on("connection", (socket) => {
                console.log("🟢 Cliente conectado:", socket.id);
    
                // Escuchar evento de reducción de stock
                socket.on("update-stock", async (payload) => {
                    const { productId } = payload;
                    const updatedProduct = await this.updateProductStock(productId);
    
                    if (!updatedProduct) {
                        socket.emit("error", { message: "❌ Producto no encontrado" });
                        return;
                    }
    
                    if (updatedProduct.stock === 0) {
                        socket.emit("stock-warning", { message: "⚠️ Stock agotado", productId });
                    }
    
                    // 🔥 Emitir el evento con el producto actualizado
                    this.iosocket.emit("stock-updated", {
                        message: "✅ Se ha actualizado el inventario",
                        product: updatedProduct,  // 🔥 Se envía el producto actualizado
                    });
                });
    
                socket.on("disconnect", () => {
                    console.log("🔴 Cliente desconectado:", socket.id);
                });
            });
        }
    
        async updateProductStock(productId) {
            const product = await Products.findOne({ where: { id: productId } });
    
            if (!product) {
                return null;
            }
    
            if (product.stock === 0) {
                return product; // Retorna el producto sin modificar
            }
    
            // Reducir stock en 1
            await Products.update({ stock: product.stock - 1 }, { where: { id: productId } });
    
            // 🔥 Obtener el producto actualizado y devolverlo
            return await Products.findOne({ where: { id: productId } });
        }
}