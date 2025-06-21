export interface Service {
  id: string;
  name: string;
  price: number;
  // outros campos se necessário
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  specialty?: string;
  specialization?: string;
  // outros campos se necessário
}
