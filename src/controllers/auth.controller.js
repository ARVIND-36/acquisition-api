import logger from '../config/logger.js';
import { signupSchema } from '../validations/auth.validations.js';
import { formatValidationErrors } from '../utils/format.js';
import { createUser } from '../service/auth.service.js';
import { cookies } from '../utils/cookies.js';
import jwttoken from '../utils/jwt.js';

export const signup = async (req, res,next) => {
    try{
        const validationResult = signupSchema.safeParse(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                error : "validation Failed",
                details : formatValidationErrors(validationResult.error)
            })
        }
        const {name,email,password,role} = validationResult.data;
        
        const user = await createUser({name,email,password,role});

        const token = jwttoken.sign({ userId: user.id, role: user.role });

        cookies.set(res,'token',token)        

        logger.info(`user registered with email: ${email} and role: ${role}`);
        res.status(201).json({
            message : "User Registerd Successfully",
            user : { id: user.id ,name : user.name,email: user.email,role: user.role}   
        })
    }
    catch(e){
        logger.error("SignUp error", { error: e });
        if(e.message == 'User with this email already exists'){
            return res.status(400).json({ message: e.message });
        }
        next(e);
    }
}