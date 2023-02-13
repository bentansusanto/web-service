// deno-lint-ignore-file
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { db } from '../database/connection.ts';
import { Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";
import { create, verify, getNumericDate } from 'https://deno.land/x/djwt@v2.2/mod.ts';
import { UserSchema } from "../schema/users.ts";

const users = db.collection<UserSchema>("users")

// Register User
export const Register = async ({request, response} : RouterContext<string>) => {
    const {name, username, email, password} = await request.body().value;
    const existUser = await users.findOne({username} || {email});
    if(existUser){
        response.status = 409;
        response.body = {
            message : "User allready exist"
        }
    }else{
        const hashPassword = await bcrypt.hash(password)
        const userId = await users.insertOne({
            name,
            username,
            email,
            password : hashPassword
        })
        const user = await users.findOne({_id : userId})
        response.status = 200;
        response.body = {
            message : "Success Created",
            user
        }        
    }
}

// Login User
export const Login = async({request, response, cookies} : RouterContext<string>) => {
    const {username, email, password} = await request.body().value;
    const user = await users.findOne({username} || {email});

    if(!user) {
        response.status = 404;
        response.body = {
            message : "User not found"
        }
        return;
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        response.status = 401;
        response.body = {
            message : "Incorrect password"
        }
        return
    }

    const payload = {
        _id : user._id,
        exp : getNumericDate(60*60)
    }

    const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, "secret")
    
    cookies.set('jwt', jwt, {httpOnly : true})

    response.status = 200;
    response.body = {
        message : "Success Login",
        token : jwt
    };
}

// Get User authentication
export const Profile = async({response, cookies}: RouterContext<string>) => {

    const jwt = await cookies.get("jwt") || '';

    if(!jwt) {
        response.status = 401;
        response.body = {
            message : "Unauthorized"
        }
        return
    }
    
    const payload = await verify(jwt, "secret", 'HS512')
    
    if(!payload) {
        response.body = 401;
        response.body = {
            message : "unauthenticated"
        }
        return
    }

    const {...userData} = await users.findOne({_id : new Bson.ObjectId(payload._id)});
    response.status = 200;
    response.body = userData;  
}

// Logout user
export const Logout = ({response, cookies}:RouterContext<any>) => {
    cookies.delete("jwt");
    response.body = {
        message : "Success Logout",
    }
}

