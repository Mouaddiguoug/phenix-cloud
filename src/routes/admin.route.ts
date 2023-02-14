import { Router } from 'express';
import adminController from '@controllers/admin.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class adminRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public admin = new adminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/:id`, authMiddleware, this.admin.updateAdmin);
  }
}

export default adminRoute;