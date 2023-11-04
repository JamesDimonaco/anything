import express from "express";
import type { Request, Response } from "express";

import http from "http";
import { WebSocketServer } from "ws";
import { Pool } from "pg";
import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "8080", 10);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
});

interface QueryMessage {
  query: string;
  params?: unknown[];
}

interface NotificationMessage {
  type: string;
}

interface NotifyUpdateRequest {
  channelId: string;
  userId?: string; // Make userId optional if not always needed
}

interface ExtendedWebSocket extends WebSocket {
  // You can extend the WebSocket type if you have additional properties per client, like a channelId
  channelId?: string;
}

interface NotifyUpdateResponse {
  success: boolean;
  message?: string;
}

// Setup the Express server
const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Create an HTTP and a WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Upgrade the HTTP server to a WebSocket connection
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// WebSocket connection logic
wss.on("connection", (ws) => {
  console.log("A new client has connected.");

  ws.on("message", (message) => {
    (async () => {
      try {
        const receivedMessage = JSON.parse(message.toString());

        if (receivedMessage.action) {
          switch (receivedMessage.action) {
            case "subscribe":
              // Handle subscription logic here
              // For example, you might save the channelId to the WebSocket object
              const extendedWs = ws as ExtendedWebSocket;
              extendedWs.channelId = receivedMessage.channelId;
              try {
                const posts = await pool.query(
                  `SELECT p.*, 
       json_build_object(
           'id', u."id",
           'email', u."email",
           'name', u."name",
           'image', u."image",
           'emailVerified', u."emailVerified",
           'status', u."status",
           'currentChannelId', u."currentChannelId",
           'homeChannelId', u."homeChannelId"
       ) AS "createdBy"
      FROM "Post" as p
      JOIN "User" as u ON p."createdById" = u."id"
      WHERE p."channelId" = $1;
`,
                  [receivedMessage.channelId],
                );
                console.log(
                  JSON.stringify(posts.rows),
                  "-----------------------------------",
                );

                ws.send(JSON.stringify(posts.rows)); // Send the posts back to the client
              } catch (error) {
                ws.send(`Error: ${(error as Error).message}`);
              }

              break;
            // Add cases for other actions like 'unsubscribe', etc.
            default:
              throw new Error("Unknown action.");
          }
        } else {
          console.log(receivedMessage, "receivedMessage likely an error");
        }
      } catch (error) {
        ws.send(`Error: ${(error as Error).message}`);
      }
    })().catch((error) => {
      ws.send(`Error: ${error}`);
    });
  });

  ws.on("close", () => {
    console.log("Client has disconnected.");
  });
});

// Endpoint for notifying about updates
app.post("/notify-update", async (req: Request, res: Response) => {
  const { channelId } = req.body as NotifyUpdateRequest; // Cast the body to your type

  console.log("here ------------------------");
  console.log(channelId);

  console.log(`Received notification about update for channel ${channelId}.`);

  try {
    const updatedPosts = await pool.query(
      `SELECT p.*, 
       json_build_object(
           'id', u."id",
           'email', u."email",
           'name', u."name",
           'image', u."image",
           'emailVerified', u."emailVerified",
           'status', u."status",
           'currentChannelId', u."currentChannelId",
           'homeChannelId', u."homeChannelId"
       ) AS "createdBy"
      FROM "Post" as p
      JOIN "User" as u ON p."createdById" = u."id"
      WHERE p."channelId" = $1;
`,
      [channelId],
    );

    console.log(updatedPosts.rows);

    // Make sure to cast the client to your ExtendedWebSocket if needed
    wss.clients.forEach((client: WebSocket) => {
      const extendedClient = client as ExtendedWebSocket; // Cast to ExtendedWebSocket
      if (
        extendedClient.readyState === WebSocket.OPEN &&
        extendedClient.channelId === channelId
      ) {
        extendedClient.send(JSON.stringify(updatedPosts.rows));
      }
    });

    console.log("Updated posts sent to subscribed clients.");
    res.status(200).json({ success: true, output: updatedPosts.rows });
  } catch (error) {
    console.error("Error sending updated posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send updated posts." });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle server shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("HTTP and WebSocket server closed.");
    pool.end(() => {
      console.log("Database pool closed.");
      process.exit(0);
    });
  });
});
