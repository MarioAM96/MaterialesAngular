export interface Order {
    udf: string;
    MaterialSolicitado: string;
    Cantidad: string;
    Observación: string;
    Fechasolicitada: string;
    PaquetedeTrabajo: string;
    TécnicoResponsable: string;
    StatusEntrega: string;
    Bodega: number;
    Código: number;
    Fechadeentrega: string | number;
    CantidadEntregada: number;
    id: string;
  }