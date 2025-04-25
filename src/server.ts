// server.ts
import { App } from "./app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WebSocket, { WebSocketServer } from "ws";
import { Server, Socket } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// for horizontal scalling
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
export interface RecoverableSocket extends Socket {
  recovered: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _queue?: Array<{ type: number; data: any[] }>;
}
(async () => {
  if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({
        PORT: 3000 + i,
      });
    }

    setupPrimary();
  } else {
    try {
      // open the database file
      const db = await open({
        filename: "chat.db",
        driver: sqlite3.Database,
      });

      // create our 'messages' table (you can ignore the 'client_offset' column for now)
      await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);
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
          origin: "*", // for all,frontend,postman and postwoman..
          methods: ["GET", "POST"],
          credentials: true,
        },
        // ← This is what we're examining}, //It restores The Rooms And Events..
        connectionStateRecovery: {
          // maxDisconnectionDuration: 30000, // 30 secs
          // skipMiddlewares: true,
        },
        adapter: createAdapter(),
      });

      io.on("connection", (socket: RecoverableSocket) => {
        console.log("A user connected");
        if (socket.recovered) {
          console.log("Recovered session. Missed packets:", socket._queue);
        }
        //for recovery
        if (!socket.recovered) {
          // if the connection state recovery was not successful
          try {
            (async () => {
              await db.each(
                "SELECT id, content FROM messages WHERE id > ?",
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                  // socket.emit("chat messageV2", row.content, row.id);
                  socket.emit("chat messageV3", row.content, row.id);
                }
              );
            })();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          } catch (e: any) {
            // something went wrong
          }
        }
        socket.on("chat-message", (msg: string) => {
          // Broadcast to all clients except sender
          // socket.broadcast.emit("chat-message", msg);
          // Or to all clients including sender:
          io.emit("chat-message", msg);
          console.log(socket.id, "Message>>", msg);
        });
        socket.on("chat messageV2", async (msg) => {
          let result;
          try {
            // store the message in the database
            result = await db.run(
              "INSERT INTO messages (content) VALUES (?)",
              msg
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          } catch (e: any) {
            // TODO handle the failure
            return;
          }
          // include the offset with the message
          io.emit("chat messageV2", msg, result.lastID);
        });
        // client side recovery
        socket.on("chat messageV3", async (msg, clientOffset, callback) => {
          let result;
          try {
            result = await db.run(
              "INSERT INTO messages (content, client_offset) VALUES (?, ?)",
              msg,
              clientOffset
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
              // the message was already inserted, so we notify the client
              callback();
            } else {
              // nothing to do, just let the client retry
            }
            return;
          }
          io.emit("chat messageV3", msg, result.lastID);
          // acknowledge the event
          callback();
        });

        socket.on("hello", (arg1, arg2, arg3) => {
          console.log(arg1); // 1
          console.log(arg2); // '2'
          console.log(arg3); // { 3: '4', 5: <Buffer 06> }
        });
        //   socket.emit("hello2", 1, "2", { 3: "4", 5: Uint8Array.from([6]) });

        //   //this is request
        //   socket.timeout(5000).emit(
        //     "requestFromServer",
        //     { foo: "bar" },
        //     "baz",
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (err: any, response: any) => {
        //       if (err) {
        //         // the client did not acknowledge the event in the given delay
        //       } else {
        //         console.log(response.status); // 'ok'
        //       }
        //     }
        //   );
        //   // this is response back to frontend
        //   socket.on("requestFromFrontEnd", (arg1, callback) => {
        //     console.log(arg1); // { foo: 'bar' }
        //     callback({
        //       status: "Server Response",
        //     });
        //   });
        //   // This Is req emit with Ack with async-await
        //   (async () => {
        //     try {
        //       const response = await socket
        //         .timeout(5000)
        //         .emitWithAck("ReqWithAcKFromServer", "EmitReqFromServerWithAck");
        //       console.log(response.status); // 'ok'
        //       // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        //     } catch (e: any) {
        //       // the client did not acknowledge the event in the given delay
        //     }
        //   })();
        //listen all events
        socket.onAny((eventName, ...args) => {
          console.log("Event Name >>", eventName, "Args>>", args);
        });
        //   // listen All Outgoing Events
        socket.onAnyOutgoing((eventName, ...args) => {
          console.log(
            "OutGoing Event",
            "Event Name >>",
            eventName,
            "Args>>",
            args
          );
        });
        // join the room named 'MY room'
        //   socket.join("MY room");

        // broadcast to all connected clients in the room
        //   io.to("MY room").emit("helloV2", "You Are in MY Room");

        //   // broadcast to all connected clients except those in the room
        //   io.except("MY room").emit("helloV2", "You Are Not in MY Room");

        // leave the room
        //   socket.leave("MY room");

        socket.on("disconnect", (reason) => {
          console.log("Disconnect reason:", reason);
          console.log("User disconnected");
        });
      });
    } catch (err) {
      console.error("Failed to start server:", err);
    }
  }
})();
