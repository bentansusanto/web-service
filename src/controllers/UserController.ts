import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { db } from '../database/connection.ts';
import { Bson } from "https://deno.land/x/mongo@v0.28.0/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { UserSchema } from "../schema/users.ts";


const users = db.collection<UserSchema>("users")

// deno-lint-ignore no-explicit-any
export const Register = async ({request, response} : RouterContext<any>) => {
    const {firstName, lastName, email, password} = await request.body().value;
    const hashPassword = await bcrypt.hash(password)
    const insertId = await users.insertOne({
        // _id : Math.random().toString(),
        firstName,
        lastName,
        email,
        password : hashPassword
    })
    response.body = await users.findOne({_id : insertId})
}
// deno-lint-ignore no-explicit-any
export const Login = async({request, response, cookies} : RouterContext<any>) => {
    const {email, password} = await request.body().value;
    const user = await users.findOne({email});

    if(!user) {
        response.body = 404;
        response.body = {
            message : "User not found"
        }
        return;
    }

    if(!await bcrypt.compare(password, user.password)){
        response.body = 401;
        response.body = {
            message : "Incorrect password"
        }
        return
    }

    const key = await crypto.subtle.generateKey(
        { name: "HMAC", hash: "SHA-512" },
        true,
        ["sign", "verify"],
      );
    
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { _id: user._id }, key);

    cookies.set('jwt', jwt, {httpOnly : true})

    response.body = {
        message : "Success"
    };
}

// deno-lint-ignore no-explicit-any
export const Me = async({response, cookies}: RouterContext<any>) => {
    const key = await crypto.subtle.generateKey(
        { name: "HMAC", hash: "SHA-512" },
        true,
        ["sign", "verify"],
      );
    
    const jwt = cookies.get("jwt") || '';
   
    if(!jwt) {
        response.body = 401;
        response.body = {
            message : "unauthenticated"
        }
    }
    
    const payload = await verify(jwt, key, "HS512");

    if(!payload) {
        response.body = 401;
        response.body = {
            message : "unauthenticated"
        }
    }

    const {...userData} = await users.findOne({_id : new Bson.ObjectId(payload._id)});
    response.body = userData;  
}


// export const Logout = async({response, cookies} : RouterContext<any>) => {
//     cookies.delete("jwt");

//     response.body = {
//         message : "Success Logout",
//     }
// }

// deno-lint-ignore no-explicit-any
export const Logout = ({response, cookies}:RouterContext<any>) => {
    cookies.delete("jwt");
    response.body = {
        message : "Success Logout",
    }
}

