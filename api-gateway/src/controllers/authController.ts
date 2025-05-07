import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, cpf, email, cep } = req.body;
            const result = await AuthService.register(name, cpf, email, cep);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await AuthService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

export default new AuthController();