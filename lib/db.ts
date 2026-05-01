import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

// Konfigurasi db yang "Vercel-Safe"
const client = postgres(connectionString || "postgres://dummy:dummy@localhost:5432/dummy", { 
  prepare: false,
  max: connectionString ? undefined : 0
});

export const db = drizzle(client);
