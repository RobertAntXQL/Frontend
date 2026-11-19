/** Coincide con la entidad Producto.java del backend adjunto. */
export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  marca: string;
  codigoBarras: string;
}

export type ProductoPayload = Omit<Producto, 'id'>;
