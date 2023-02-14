import { NextFunction, Request, Response } from 'express';
import adminService from '@services/admin.service';

class adminController {
  public adminService = new adminService();
  public updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData = req.body;
      const updatedAdmin = await this.adminService.updateAdmin(userId, userData);

      res.status(200).json({ updatedAdmin, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default adminController
