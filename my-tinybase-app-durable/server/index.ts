import { Database } from "bun:sqlite";
import postgres from "postgres";
import { createMergeableStore } from "tinybase";
import { createPostgresPersister } from "tinybase/persisters/persister-postgres";
import { createSqliteBunPersister } from "tinybase/persisters/persister-sqlite-bun";
import { createWsServer } from "tinybase/synchronizers/synchronizer-ws-server";
import { WebSocketServer } from "ws";
import { env } from "./env";

const sql = postgres(env.DATABASE_URL);

const db = new Database("./db.sqlite");
// Server
const server = createWsServer(new WebSocketServer({ port: 8040 }), (pathId) => {
	console.log({ pathId });
	// return createPostgresPersister(createMergeableStore(), sql);
	return createSqliteBunPersister(createMergeableStore(), db, {
		mode: "json",
	});
});

console.log(
	`TinyBase WebSocket server running on port ${server.getWebSocketServer().address()?.toString()}`,
);

// Handle server shutdown gracefully
process.on("SIGINT", () => {
	console.log("Shutting down server...");
	server.getWebSocketServer().close();
	process.exit(0);
});
