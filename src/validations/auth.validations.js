import { PgRole } from 'drizzle-orm/pg-core';
import z, { email } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    email: email().max(255).toLowerCase().trim(),
    password: z.string().min(8).max(128),
    role : z.enum(['user','admin']).default('user')
});
export const signInSchema = z.object({
    email: email().max(255).toLowerCase().trim(),
    password: z.string().min(8).max(128),
});