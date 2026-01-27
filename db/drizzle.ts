import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from './schema';

config({ path: ".env" }); 
// connecting to the Neon database using Drizzle ORM
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql , schema});
