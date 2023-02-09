import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { Register, Login, Me, Logout } from './src/controllers/UserController.ts';
import { getCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from './src/controllers/CustomerController.ts';

export const router = new Router()
// User
router.post('/api/register', Register)
      .post('/api/login', Login)
      .get('/api/me', Me)
      .post('/api/logout', Logout)

// Product
router.get('/api/customers', getCustomer)
      .get('/api/customers/:customerId', getCustomerById)
      .post('/api/customers', createCustomer)
      .put('/api/customers/:customerId', updateCustomer)
      .delete('/api/customers/:customerId', deleteCustomer)