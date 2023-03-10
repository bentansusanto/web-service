import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { Register, Login, Logout, Profile } from './src/controllers/UserController.ts';
import { getCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from './src/controllers/CustomerController.ts';
// import { Profile } from './src/controllers/UserController';

export const router = new Router()
// User
router.post('/api/register', Register)
      .post('/api/login', Login)
      .get('/api/user', Profile)
      .post('/api/logout', Logout)

// Product
router.get('/api/customers', getCustomer)
      .get('/api/customers/:customerId', getCustomerById)
      .post('/api/customers', createCustomer)
      .put('/api/customers/:customerId', updateCustomer)
      .delete('/api/customers/:customerId', deleteCustomer)