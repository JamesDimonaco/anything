import WebSocket, { WebSocketServer } from "ws";
import { Pool } from "pg";

// Ensure environment variables are loaded (if you use dotenv)
import dotenv from "dotenv";
dotenv.config();

const PORT = 8080;

console.log("Connecting to database...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
});

interface QueryMessage {
  query: string;
  params?: any[];
}

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

wss.on("connection", (ws: WebSocket) => {
  console.log("A new client has connected.");

  ws.on("message", (message: string) => {
    void (async () => {
      // The void operator is used here to prevent floating promises
      try {
        const queryMessage: QueryMessage = JSON.parse(message);
        if (
          typeof queryMessage.query !== "string" ||
          (queryMessage.params && !Array.isArray(queryMessage.params))
        ) {
          throw new Error("Invalid message format.");
        }
        const res = await pool.query(queryMessage.query, queryMessage.params);
        ws.send(JSON.stringify(res.rows));
      } catch (err: unknown) {
        const error = err as Error;
        ws.send(`Error: ${error.message}`);
      }
    })();
  });

  ws.on("close", () => {
    console.log("Client has disconnected.");
  });
});

process.on("SIGTERM", () => {
  console.log("Shutting down...");
  wss.close(() => {
    console.log("WebSocket server closed.");
    pool.end(() => {
      console.log("Database pool closed.");
      process.exit(0);
    });
  });
});
