export class Materiales {
  id: string;
  material: string;
  codigo: string;
  descripcion: string;
  stockInicial: number;
  stockReal: number;
  bodega: string;
  nombreDelProyecto: string;

  constructor(data: any) {
    this.id = data.id;
    this.material = data['Material'];
    this.codigo = data['Código'];
    this.descripcion = data['Descripción'];
    this.stockInicial = data['Stock Inicial'];
    this.stockReal = data['Stock Real'];
    this.bodega = data['Bodega'];
    this.nombreDelProyecto = data['Nombre del proyecto'];
  }
}