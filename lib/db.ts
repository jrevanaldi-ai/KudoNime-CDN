import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

// Biarkan build berjalan meskipun DATABASE_URL tidak ada
// Error hanya akan muncul saat runtime jika koneksi gagal
const client = postgres(connectionString || "postgres://dummy:dummy@localhost:5432/dummy", { 
  prepare: false,
  max: connectionString ? undefined : 0 // Jangan coba connect kalau dummy
});

export const db = drizzle(client);
