import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
//When to Use Drizzle 
// You know SQL 
// You want type safety without losing control
// You want performance + simplicity
// Building scalable APIs


const sql = neon(process.env.DATABASE_URL);
 
const db =  drizzle(sql);

export {db,sql};
