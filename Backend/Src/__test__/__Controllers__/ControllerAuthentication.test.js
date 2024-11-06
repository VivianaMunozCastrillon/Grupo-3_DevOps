const { Login, createUser } = require('../../Controllers/ControllerAuthentication');
const { dataSource } = require('../../database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('../../database');
jest.mock('bcrypt');

describe('Auth Controller Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('should return a success message if AdminId and PasswordAdmin are correct', async () => {
      const mockUser = { AdminId: '123', PasswordAdmin: 'hashedPassword' };

      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const req = { body: { AdminId: '123', PasswordAdmin: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await Login(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Login exitoso' });
    });

    it('should return 400 if AdminId or PasswordAdmin are missing', async () => {
      const req = { body: { AdminId: '' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await Login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Se requiere el ID del usuario y la contraseña.' });
    });

    it('should return 401 if AdminId is incorrect', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const req = { body: { AdminId: 'wrongId', PasswordAdmin: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await Login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuario incorrecto' });
    });

    it('should return 401 if PasswordAdmin is incorrect', async () => {
      const mockUser = { AdminId: '123', PasswordAdmin: 'hashedPassword' };

      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const req = { body: { AdminId: '123', PasswordAdmin: 'wrongPassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await Login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Contraseña incorrecta' });
    });

    it('should handle errors during login', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const req = { body: { AdminId: '123', PasswordAdmin: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await Login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al realizar el login' });
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const mockHashedPassword = 'hashedPassword';

      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword);

      dataSource.getRepository = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({}),
      });

      const req = { body: { AdminId: '123', PasswordAdmin: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(res.json).toHaveBeenCalledWith({ msg: 'usuario agregado' });
    });

    it('should handle errors when creating a new user', async () => {
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockRejectedValue(new Error('Hashing error'));

      const req = { body: { AdminId: '123', PasswordAdmin: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al agregar el usuario, recuerda que el correo electronico y id de usuarios debe ser unico, ademas recuerda llenar todos los campos'
      });
    });
  });
});
