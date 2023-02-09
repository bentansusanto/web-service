import {
    MongoClient,
  } from "https://deno.land/x/mongo@v0.9.0/mod.ts";

const client = new MongoClient();

// Connecting to a Local Database
client.connectWithUri("mongodb://127.0.0.1:27017/auth_jwt");

export const db = client.database("auth_jwt");
