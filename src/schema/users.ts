export interface UserSchema {
    _id : {$oid :string},
    name : string,
    username : string,
    email : string,
    password : string,
}