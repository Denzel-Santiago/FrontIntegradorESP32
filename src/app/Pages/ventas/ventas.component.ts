import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmacenService } from '../../services/almacen.service';
import { Almacen } from '../../interfaces/almacen.interface';
import { OrderService } from '../../services/order.service';
import { OrderCreate, OrderResponse } from '../../interfaces/order.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-ventas',
    templateUrl: './ventas.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class VentasComponent implements OnInit {
  isModalOpen: boolean = false;
  isPurchaseModalOpen: boolean = false;
  modalContent: any = {};
  almacenes: Almacen[] = [];
  loading: boolean = true;
  orderForm: FormGroup;
  currentProduct: any = null;
  orderSuccess: boolean = false;
  orderError: boolean = false;

  constructor(
    private almacenService: AlmacenService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      bed_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAlmacenes();
  }

  loadAlmacenes(): void {
    this.almacenService.getAllAlmacenes().subscribe({
      next: (data) => {
        this.almacenes = data.slice(0, 2);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar almacenes:', error);
        this.loading = false;
      }
    });
  }

  getImageForTipoCama(tipoId: number): string {
    return tipoId === 1 ? 'assets/ventas5.png' : 'assets/ventas6.png';
  }

  getNombreTipoCama(tipoId: number): string {
    return tipoId === 1 ? 'Modelo Estándar' : 'Modelo Automático';
  }

  getPrecioTipoCama(tipoId: number): string {
    return tipoId === 1 ? '10,000$' : '12,000$';
  }

  openModal(productId: number): void {
    this.modalContent = this.productsInfo.find(product => product.id === productId);
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  openPurchaseModal(almacen: Almacen): void {
    this.currentProduct = almacen;
    this.orderForm.patchValue({
      bed_name: this.getNombreTipoCama(almacen.tipo_cama_id),
      quantity: 1
    });
    this.isPurchaseModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isPurchaseModalOpen = false;
    this.orderSuccess = false;
    this.orderError = false;
    document.body.style.overflow = 'auto';
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const orderData: OrderCreate = this.orderForm.value;
    this.orderService.createOrder(orderData).subscribe({
      next: (response: OrderResponse) => {
        console.log('Pedido creado exitosamente:', response);
        this.orderSuccess = true;
        this.orderError = false;
        this.orderForm.reset();
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        this.orderError = true;
        this.orderSuccess = false;
      }
    });
  }

  productsInfo = [
    {
      id: 1,
      title: 'Camas Africanas Para Un Secado De Café Superior',
      image: 'assets/ventas2.png',
      description: [
        'Adaptación a cada clima: Medidas duchadas para diversas condiciones ambientales.',
        'Estructura integrativa: Seguros cambios climáticos y fábricos.',
        'Utilizar trabajos de favorito, incluso los terminales de manera inferior para realizar la capacidad del transporte o cualquier forma de recuperar todas estas y adaptaciones o usarse frente.',
        'Proyecto en calidad, potencia al servicio y acceso de las más frecuentes salidas federales y que se pueden producir su uso productivo.'
      ]
    },
    // ... otros productos
  ];
}