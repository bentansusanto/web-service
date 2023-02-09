// deno-lint-ignore-file
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { db } from "../database/connection.ts";
import { CustomerSchema } from "../schema/customer.ts";

const customers = db.collection<CustomerSchema>("customers");

// Get All Customers
export const getCustomer = async ({ response }: RouterContext<any>) => {
  const allCustomers = await customers.find({}).toArray();
  response.body = 200;
  response.body = {
    message: "Success",
    data: allCustomers,
  };
};

// Get Customer by Id
export const getCustomerById = async ({
  response,
  params,
}: RouterContext<any>) => {
  const customerId = params.customerId;

  const customer = await customers.findOne({ _id: new ObjectId(customerId) });

  if (!customer) {
    response.body = 404;
    response.body = {
      message: "Customer not found",
    };
    return;
  }

  response.body = 200;
  response.body = {
    message: "Success",
    data: customer,
  };
};

// Add Customers
export const createCustomer = async ({request,response}: RouterContext<any>) => {
  const { name, email, phoneNumber, nameCompany, kebutuhan, description, filePhoto} = await request.body().value;

  if (!request.hasBody) {
    response.status = 401;
    response.body = {
      message: "Failed Created",
    };
  }
  const customer : any = {
    name,
    email,
    phoneNumber,
    nameCompany,
    kebutuhan,
    description,
    filePhoto,
  };

  const id = await customers.insertOne(customer)
  customer._id = id;

  response.status = 201;
  response.body = {
    message: "Success created",
    data : customer
  };
};

// Update Customer
export const updateCustomer = async ({
  request,
  response,
  params,
}: RouterContext<any>) => {
  const customerId = params.customerId;

  if (!customerId) {
    response.status = 404;
    response.body = {
      message: "Customer not found",
    };
  }

  const {
    name,
    email,
    phoneNumber,
    nameCompany,
    kebutuhan,
    description,
    filePhoto,
  } = await request.body().value;

  const customer = await customers.updateOne(
    { _id: new ObjectId(customerId) },
    {
      $set: {
        name,
        email,
        phoneNumber,
        nameCompany,
        kebutuhan,
        description,
        filePhoto,
      },
    }
  );


  response.status = 201;
  response.body = {
    message: "Success Updated",
    data: customer,
  };
};

// Delete Customer
export const deleteCustomer = async ({
  response,
  params,
}: RouterContext<any>) => {
  const customerId = params.customerId;

  if (!customerId) {
    response.status = 404;
    response.body = {
      message: "Customer not found",
    };
    return;
  }

  const customer = await customers.deleteOne({ _id: new ObjectId(customerId) });

  response.status = 200;
  response.body = {
    message: "Success Delete Customer",
  };
};
