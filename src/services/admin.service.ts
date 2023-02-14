import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import createMollieClient, { Subscription } from '@mollie/api-client';
import 'dotenv/config';
import { con } from '@/app';

class adminService {
  public async updateAdmin(email: string, userData) {
    try {
      const password = userData.data.newPassword;
      const [result] = await con.query(`update admin set admin.password = '${password}' where admin.email = '${email}'`);
      return result.affectedRows;
    } catch (error) {
      console.log(error);
    }
  }
}

export default adminService
