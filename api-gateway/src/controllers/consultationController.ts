import { Request, Response } from 'express';
import { ConsultationService } from '../services/consultationService';

export class ConsultationController {
    private consultationService: ConsultationService;

    constructor() {
        this.consultationService = new ConsultationService();
    }

    public async scheduleConsultation(req: Request, res: Response): Promise<void> {
        try {
            const consultationData = req.body;
            const result = await this.consultationService.scheduleConsultation(consultationData);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async cancelConsultation(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.consultationService.cancelConsultation(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async checkIn(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.consultationService.checkIn(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async getConsultations(req: Request, res: Response): Promise<void> {
        try {
            const consultations = await this.consultationService.getConsultations();
            res.status(200).json(consultations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}