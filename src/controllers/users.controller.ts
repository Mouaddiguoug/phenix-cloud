import { NextFunction, Request, Response } from 'express';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData = await this.userService.findAllUser();

      res.status(200).json({ findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const subscriptions = await this.userService.findSubscription(userId);
      res.status(200).json({ subscriptions, message: 'findSubscription' });
    } catch (error) {
      console.log(error);
    }
  };

  public getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);

      const payments = await this.userService.findPayments(userId);
      res.status(200).json({ payments, message: 'findPayments' });
    } catch (error) {
      console.log(error);
    }
  };

  public createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentData = req.body;
      const payment = await this.userService.createPayment(paymentData);

      res.status(201).json({ payment: payment });
    } catch (error) {
      console.log(error);
    }
  };

  public createMandate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const mandateData = req.body;
      const mandate = await this.userService.createMandate(mandateData, userId);

      res.status(201).json({ mandate });
    } catch (error) {
      console.log(error);
    }
  };

  public getMandates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const mandates = await this.userService.getMandates(userId);

      res.status(200).json({ mandates, message: 'findMandates' });
    } catch (error) {
      console.log(error);
    }
  };

  public createSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionData = req.body
      
      const subscription = await this.userService.createSubscription(subscriptionData);

      res.status(200).json({ subscription });
    } catch (error) {
      console.log(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const findOneUserData = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const customer = await this.userService.createCustomer(userData);

      res.status(201).json({ customer });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData = req.body;
      const updateCustomer = await this.userService.updateCustomer(userId, userData);

      res.status(200).json({ updateCustomer, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      await this.userService.deleteCustomer(userId);

      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
