  export class Order {
    udf: string;
    MaterialSolicitado: string;
    Cantidad: string;
    Observacion: string;
    Fechasolicitada: string;
    PaquetedeTrabajo: string;
    TecnicoResponsable: string;
    StatusEntrega: string;
    Bodega: number;
    Codigo: number;
    Fechadeentrega: string | number;
    CantidadEntregada: number;
    id: string;
  
    constructor(data: any) {
      this.id = data.id;
      this.udf = data['udf'];
      this.Bodega = data['Bodega'];
      this.Cantidad = data['Cantidad'];
      this.CantidadEntregada = data['Cantidad Entregada'];
      this.Codigo = data['Código'];
      this.Fechadeentrega = data['Fecha de entrega'];
      this.Fechasolicitada = data['Fecha solicitada'];
      this.MaterialSolicitado = data['Material Solicitado'];
      this.Observacion = data['Observación'];
      this.PaquetedeTrabajo = data['Paquete de Trabajo'];
      this.StatusEntrega = data['Status Entrega'];
      this.TecnicoResponsable = data['Técnico Responsable'];
    }
  }