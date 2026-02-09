import { eq } from "drizzle-orm";
import logger from "../config/logger.js";
import bcrypt from 'bcrypt';
import { db } from "../config/database.js";
import { users } from "../models/user.mode.js";

export const hashPassword = async (password) => {
    try{
        return await bcrypt.hash(password, 12);
    }
    catch(e){
            logger.error("Error hashing password", { error: e });
            throw new Error('Error hashing password');
    }
}

export const createUser = async ({name,email,password,role}) => {
    try{
        const exisitingUser = db.select().from(users).where(eq(users.email,email)).limit(1);

        if(exisitingUser.length > 0){
            throw new Error('User with this email already exists');
        }
        const passwordHash = await hashPassword(password);
        const [newUser] = await db.insert(users)
        .values({name,email,password:passwordHash,role})
        .returning({id:users.id},{name:users.name},{email:users.email},{role:users.role},{created_at:users.created_at});
        
        logger.info(`User created with email: ${email} and role: ${role}`);
        return newUser;
    }
    catch(e){
        logger.error("Error creating user", { error: e });
        throw e;
    }
}