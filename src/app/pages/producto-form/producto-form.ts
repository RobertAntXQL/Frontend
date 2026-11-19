import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Producto, ProductoPayload } from '../../models/producto.model';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoFormComponent implements OnChanges {
  @Input() producto: Producto | null = null;
  @Output() guardado = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();
  private readonly service = inject(ProductoService);

  form: ProductoPayload = this.vacio();
  guardando = false;
  errorMessage = '';

  get esEdicion(): boolean { return this.producto?.id != null; }

  ngOnChanges(_changes: SimpleChanges): void {
    this.form = this.producto ? {
      nombre: this.producto.nombre,
      categoria: this.producto.categoria,
      precio: this.producto.precio,
      stock: this.producto.stock,
      marca: this.producto.marca,
      codigoBarras: this.producto.codigoBarras
    } : this.vacio();
    this.errorMessage = '';
  }

  guardar(): void {
    this.errorMessage = '';
    this.form.nombre = this.form.nombre.trim();
    this.form.categoria = this.form.categoria.trim();
    this.form.marca = this.form.marca.trim();
    this.form.codigoBarras = this.form.codigoBarras.trim();
    if (!this.form.nombre || !this.form.categoria || !this.form.marca || !this.form.codigoBarras) {
      this.errorMessage = 'Completa todos los campos del producto.';
      return;
    }
    if (!Number.isFinite(this.form.precio) || this.form.precio <= 0 || !Number.isInteger(this.form.stock) || this.form.stock < 0) {
      this.errorMessage = 'El precio debe ser positivo y el stock un entero mayor o igual a cero.';
      return;
    }
    this.guardando = true;
    const request = this.esEdicion && this.producto?.id
      ? this.service.actualizar(this.producto.id, this.form)
      : this.service.crear(this.form);
    request.subscribe({
      next: () => {
        this.guardando = false;
        this.guardado.emit(this.esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.errorMessage = err.status === 0
          ? 'No se puede conectar al backend.'
          : err.status === 409
            ? 'El código de barras ya está registrado.'
            : (typeof err.error?.message === 'string' ? err.error.message : 'No se pudo guardar el producto. Verifica los datos.');
      }
    });
  }

  private vacio(): ProductoPayload {
    return { nombre: '', categoria: '', precio: 0.01, stock: 0, marca: '', codigoBarras: '' };
  }
}
