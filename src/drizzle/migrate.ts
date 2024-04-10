import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config/config";

const migrationClient = postgres(config.databaseUrl as string, {
  max: 1,
});

async function runMigrations() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "src/drizzle/migrations",
  });

  await migrationClient.end();
}

runMigrations();
