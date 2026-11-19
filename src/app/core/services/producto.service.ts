import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoPayload } from '../../models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/productos`;

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(producto: ProductoPayload): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizar(id: number, producto: ProductoPayload): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Filtros opcionales existentes en ProductoController.java.
  porCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${encodeURIComponent(categoria)}`);
  }

  porPrecioMaximo(max: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/precio-max`, {
      params: new HttpParams().set('max', String(max))
    });
  }
}
