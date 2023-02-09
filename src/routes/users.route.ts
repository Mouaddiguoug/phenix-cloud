import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/payments/:id`, this.usersController.getPayments);
    this.router.post(`${this.path}/payments/`, this.usersController.createPayment);
    this.router.get(`${this.path}/subscriptions/:id`, this.usersController.getSubscription);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.get(`${this.path}/mandates/:id`, this.usersController.getMandates);
    this.router.post(`${this.path}/mandates/:id`, this.usersController.createMandate);
    this.router.post(`${this.path}/subscriptions/`, this.usersController.createSubscription);
    this.router.post(`${this.path}`, this.usersController.createCustomer);
    this.router.put(`${this.path}/:id`, this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteCustomer);
  }
}

export default UsersRoute;
