import {
    MongoClient,
  } from "https://deno.land/x/mongo@v0.28.0/mod.ts";

const client = new MongoClient();

// Connecting to a Local Database
await client.connect("mongodb://127.0.0.1:27017");

export const db = client.database("auth_jwt");
