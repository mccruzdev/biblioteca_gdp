export interface ApiPeruResponse {
  success: boolean;
  message?: string;
  time: number;
  source: string;
  data?: UserReniec;
}

export interface UserReniec {
  numero: string;
  nombre_completo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  codigo_verificacion: number;
  ubigeo_sunat: string;
  ubigeo: Array<string | null>;
  direccion: string;
}
