import { Request, Response } from 'express';
import axios from 'axios';

const proxyService = (url: string) => async (req: Request, res: Response) => {
  try {
    const { data, status } = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: { Authorization: req.headers.authorization || '' },
    });
    res.status(status).json(data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro interno' });
  }
};

export default proxyService;
