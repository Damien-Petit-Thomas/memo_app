import bcrypt from 'bcrypt';
import { CoreController } from './coreController';
import { authentifyUser } from '../../services/auth.service';


export class UserController extends CoreController {
  async create(data) {
    const newData = { ...data };
    delete newData.confirmPassword;
    if (await this.datamapper.findByEmail(newData.email)) throw new Error('Email already exists', { statusCode: 400 });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newData.password, salt);
    newData.password = hashedPassword;
    const newUser = await this.datamapper.create(newData);
    return newUser;
  }

  async getOne(data) {
    console.log('data', data);
    const userFound = await this.datamapper.findByEmail(data.email);
    if (!userFound) throw new Error('Email not found', { statusCode: 400 });
    const token = await authentifyUser(userFound, data.password);
    if (!token) throw new Error('Invalid password', { statusCode: 400 });
    return { token };
  }
}
