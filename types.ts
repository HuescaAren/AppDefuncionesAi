
export interface ExtractedData {
  nombre: string;
  apellidos: string;
  fechaDefuncion: string;
  conyuge: string;
  matrimonio: string;
}

export interface DefuncionRecord extends ExtractedData {
  id: string;
  fileName: string;
}
