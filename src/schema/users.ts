// export default interface UserSchema {
//     id : {$oid : string},
//     firstName : string,
//     lastName : string,
//     email : string,
//     password : string,
// }
export interface UserSchema {
    _id : {$oid :string},
    firstName : string,
    lastName : string,
    email : string,
    password : string,
}