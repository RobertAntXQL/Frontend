import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto.service';
import { ProductoFormComponent } from '../producto-form/producto-form';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoFormComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  private readonly service = inject(ProductoService);
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly aviso = signal('');
  readonly busqueda = signal('');
  readonly categoria = signal('Todas');
  readonly pagina = signal(1);
  readonly porPagina = 7;
  readonly categorias = computed(() => [...new Set(this.productos().map(p => p.categoria))].sort());
  readonly filtrados = computed(() => this.productos().filter(producto => {
    const q = this.busqueda().trim().toLocaleLowerCase();
    const match = `${producto.nombre} ${producto.marca} ${producto.codigoBarras} ${producto.categoria}`.toLocaleLowerCase().includes(q);
    return match && (this.categoria() === 'Todas' || producto.categoria === this.categoria());
  }));
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / this.porPagina)));
  readonly paginaProductos = computed(() => this.filtrados().slice((this.pagina() - 1) * this.porPagina, this.pagina() * this.porPagina));
  readonly unidadesStock = computed(() => this.productos().reduce((s, p) => s + p.stock, 0));
  readonly bajosStock = computed(() => this.productos().filter(p => p.stock <= 5).length);

  mostrarFormulario = false;
  seleccionado: Producto | null = null;
  paraEliminar: Producto | null = null;
  eliminando = false;

  ngOnInit(): void { this.cargarProductos(); }

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set('');
    this.service.listar().subscribe({
      next: productos => {
        this.productos.set(productos);
        this.cargando.set(false);
        if (this.pagina() > this.totalPaginas()) this.pagina.set(this.totalPaginas());
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(err.status === 0
          ? `No se pudo conectar al backend en ${environment.apiUrl}.`
          : 'No se pudieron cargar los productos. Comprueba el JWT y el servidor.');
      }
    });
  }

  nueva(): void { this.seleccionado = null; this.mostrarFormulario = true; }
  editar(producto: Producto): void { this.seleccionado = producto; this.mostrarFormulario = true; }
  cerrarFormulario(): void { this.mostrarFormulario = false; this.seleccionado = null; }
  guardado(mensaje: string): void { this.cerrarFormulario(); this.aviso.set(mensaje); this.cargarProductos(); }
  cambiarBusqueda(valor: string): void { this.busqueda.set(valor); this.pagina.set(1); }
  cambiarCategoria(valor: string): void { this.categoria.set(valor); this.pagina.set(1); }
  cambiarPagina(valor: number): void { this.pagina.set(Math.max(1, Math.min(valor, this.totalPaginas()))); }

  confirmarEliminar(producto: Producto): void { this.paraEliminar = producto; this.error.set(''); }
  cancelarEliminar(): void { if (!this.eliminando) this.paraEliminar = null; }
  eliminar(): void {
    if (!this.paraEliminar?.id || this.eliminando) return;
    this.eliminando = true;
    this.service.eliminar(this.paraEliminar.id).subscribe({
      next: () => {
        this.eliminando = false;
        this.paraEliminar = null;
        this.aviso.set('Producto eliminado correctamente.');
        this.cargarProductos();
      },
      error: (err: HttpErrorResponse) => {
        this.eliminando = false;
        this.paraEliminar = null;
        this.error.set(err.status === 500 || err.status === 409
          ? 'No se pudo eliminar. El producto podría estar asociado a un pedido.'
          : 'No se pudo eliminar el producto. Revisa la conexión y las restricciones de la base de datos.');
      }
    });
  }
}
