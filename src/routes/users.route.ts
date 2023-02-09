import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/payments/:id`, authMiddleware, this.usersController.getPayments);
    this.router.post(`${this.path}/payments/`, authMiddleware, this.usersController.createPayment);
    this.router.get(`${this.path}/subscriptions/:id`, authMiddleware, this.usersController.getSubscription);
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.get(`${this.path}/mandates/:id`, authMiddleware, this.usersController.getMandates);
    this.router.post(`${this.path}/mandates/:id`, authMiddleware, this.usersController.createMandate);
    this.router.post(`${this.path}/subscriptions/`, authMiddleware, this.usersController.createSubscription);
    this.router.post(`${this.path}`, authMiddleware, this.usersController.createCustomer);
    this.router.put(`${this.path}/:id`, authMiddleware, this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteCustomer);
  }
}

export default UsersRoute;
