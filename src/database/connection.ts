// deno-lint-ignore-file
import { MongoClient } from 'https://deno.land/x/mongo@v0.28.0/mod.ts';

const client = new MongoClient();

// await client.connect("mongodb://127.0.0.1:27017");
await client.connect("mongodb://mongo:QBF1t37ybKy8TSCNPcBn@containers-us-west-61.railway.app:7877");
/* 
mongodb://mongo:QBF1t37ybKy8TSCNPcBn@containers-us-west-61.railway.app:7877
    MONGOUSER : mongo
    MONGOPASSWORD : QBF1t37ybKy8TSCNPcBn
    MONGOPORT : 7877
    MONGOHOST : containers-us-west-61.railway.app
*/


// await client.connect({
//     db: "<db_name>",
//     tls: true,
//     servers: [
//       {
//         host: "containers-us-west-61.railway.app",
//         port: 27017,
//       },
//     ],
//     credential: {
//       username: "<username>",
//       password: "<password>",
//       db: "<db_name>",
//       mechanism: "SCRAM-SHA-1",
//     },
//   });

export const db = client.database("auth_jwt")
