
export interface CustomerSchema{
    _id : {$uuid : string};
    name : string;
    email : string;
    phoneNumber : string;
    nameCompany : string;
    kebutuhan : string;
    description : string;
    filePhoto : string;
}