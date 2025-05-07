import { Request, Response } from 'express';
import { PatientService } from '../services/patientService';

export class PatientController {
    private patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const patientData = req.body;
            const newPatient = await this.patientService.registerPatient(patientData);
            res.status(201).json(newPatient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    public async getPoints(req: Request, res: Response): Promise<void> {
        try {
            const patientId = req.params.id;
            const points = await this.patientService.getPatientPoints(patientId);
            res.status(200).json(points);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    // Outros métodos para gerenciar pacientes podem ser adicionados aqui
}