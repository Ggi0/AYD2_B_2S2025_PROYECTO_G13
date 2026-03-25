export function getCorteDiario(params?: {
  fecha?: string;
  sede?: string;
}): Promise<any>;

export function getKPIs(params?: {
  desde?: string;
  hasta?: string;
  sede?: string;
}): Promise<any>;

export function getAlertas(params?: {
  desde?: string;
  hasta?: string;
}): Promise<any>;
