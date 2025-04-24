// server.ts
import { App } from "./app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WebSocket, { WebSocketServer } from "ws";
import { Server } from "socket.io";
(async () => {
  try {
    const app = new App();
    const httpServer = await app.listen(); // Now properly returns http.Server
    // const wss = new WebSocketServer({ server: httpServer });

    // wss.on("connection", function connection(ws) {
    //   ws.on("error", console.error);
    //   console.log("connected to ws");

    //   ws.on("message", function message(data, isBinary) {
    //     wss.clients.forEach(function each(client) {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send(data, { binary: isBinary });
    //       }
    //     });
    //     console.log(data.toString());
    //   });

    //   ws.send("Hello! Message From Server!!");
    // });

    //with socket.io perform the same thing..
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("chat-message", (msg: string) => {
        // Broadcast to all clients except sender
        // socket.broadcast.emit("chat-message", msg);
        // Or to all clients including sender:
        io.emit("chat-message", msg);
        console.log(socket.id, "Message>>", msg);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
