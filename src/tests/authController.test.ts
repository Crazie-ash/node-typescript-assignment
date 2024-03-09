// authController.test.ts

import { Request, Response } from 'express';
import * as AuthController from '../controllers/authController';

describe('AuthController', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const req: Request = {
        body: {
          username: 'testUser',
          password: 'testPassword',
          role: 'USER',
        },
        // You may need to provide other properties/methods based on your usage in the controller
      } as Request;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await AuthController.createUser(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login and generate authentication token', async () => {
      const req: Request = {
        body: {
          username: 'testUser',
          password: 'testPassword',
        },
        // You may need to provide other properties/methods based on your usage in the controller
      } as Request;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await AuthController.loginUser(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
