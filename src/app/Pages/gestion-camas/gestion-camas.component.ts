// gestion-camas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TipoCamaService } from '../../services/tipo-cama.service';
import { AlmacenService } from '../../services/almacen.service';
import { CamaService } from '../../services/cama.service';
import { UsuarioService } from '../../services/usuario.services';
import { TipoCama, TipoCamaCreate } from '../../interfaces/tipo-cama.interface';
import { Almacen } from '../../interfaces/almacen.interface';
import { Cama, CamaCreate, CamaUpdate } from '../../interfaces/cama.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { SideAdminComponent } from '../../component/sidebarAdmin/sideAdmin.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestion-camas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SideAdminComponent,
    HttpClientModule
  ],
  templateUrl: './gestion-camas.component.html',
})
export class GestionCamasComponent implements OnInit {
  // Datos
  tiposCama: TipoCama[] = [];
  almacenes: Almacen[] = [];
  camas: Cama[] = [];
  usuarios: Usuario[] = [];
  filteredCamass: Cama[] = [];
  
  // Filtros
  selectedTipoId: number | null = null;
  searchText: string = '';
  
  // Modales
  showCamaModal: boolean = false;
  showTipoModal: boolean = false;
  showAlmacenModal: boolean = false;
  showIncrementModal: boolean = false;
  isEditing: boolean = false;
  currentCamaId: number | null = null;
  currentAlmacen: Almacen | null = null;
  
  // Formularios
  camaForm: FormGroup;
  tipoCamaForm: FormGroup;
  almacenForm: FormGroup;
  incrementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tipoCamaService: TipoCamaService,
    private almacenService: AlmacenService,
    private camaService: CamaService,
    private usuarioService: UsuarioService
  ) {
    this.camaForm = this.fb.group({
      modelo: ['', [Validators.required, Validators.minLength(3)]],
      tipo_id: [null, [Validators.required]],
      usuario_id: [null]
    });

    this.tipoCamaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clima: ['', [Validators.required]]
    });

    this.almacenForm = this.fb.group({
      tipo_cama_id: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.incrementForm = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Cargar tipos de cama
    this.tipoCamaService.getAllTiposCama().subscribe({
      next: (tipos) => {
        this.tiposCama = tipos || [];
      },
      error: (err) => console.error('Error cargando tipos de cama:', err)
    });
    
    // Cargar almacenes
    this.almacenService.getAllAlmacenes().subscribe({
      next: (almacenes) => {
        this.almacenes = almacenes || [];
      },
      error: (err) => console.error('Error cargando almacenes:', err)
    });
    
    // Cargar camas
    this.camaService.getAllCamas().subscribe({
      next: (camas) => {
        this.camas = camas || [];
        this.filteredCamass = [...this.camas];
      },
      error: (err) => console.error('Error cargando camas:', err)
    });

    // Cargar usuarios
    this.usuarioService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios || [];
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  // Filtros
  filterByTipo(): void {
    if (!this.camas) {
      this.filteredCamass = [];
      return;
    }
    
    this.filteredCamass = this.selectedTipoId 
      ? this.camas.filter(c => c.tipo_id === this.selectedTipoId)
      : [...this.camas];
    this.applySearch();
  }

  applySearch(): void {
    if (!this.searchText) {
      return;
    }
    
    const search = this.searchText.toLowerCase();
    this.filteredCamass = this.filteredCamass.filter(c => 
      c.modelo.toLowerCase().includes(search)
    );
  }

  // Helpers
  getTipoNombre(tipoId: number): string {
    if (!this.tiposCama) return 'Desconocido';
    const tipo = this.tiposCama.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : 'Desconocido';
  }

  getStockByTipo(tipoId: number): number {
    if (!this.almacenes) return 0;
    const almacen = this.almacenes.find(a => a.tipo_cama_id === tipoId);
    return almacen ? almacen.cantidad : 0;
  }

  getUsuarioNombre(usuarioId: number | null): string {
    if (!usuarioId || !this.usuarios) return 'No asignada';
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? `${usuario.name} ${usuario.lastname}` : 'Usuario desconocido';
  }

  // Modal Cama
  openAddCamaModal(): void {
    this.isEditing = false;
    this.currentCamaId = null;
    this.camaForm.reset();
    this.showCamaModal = true;
  }

  editCama(cama: Cama): void {
    this.isEditing = true;
    this.currentCamaId = cama.id;
    this.camaForm.patchValue({
      modelo: cama.modelo,
      tipo_id: cama.tipo_id,
      usuario_id: cama.usuario_id
    });
    this.showCamaModal = true;
  }

  closeCamaModal(): void {
    this.showCamaModal = false;
  }

  // Modal Tipo Cama
  openAddTipoModal(): void {
    this.tipoCamaForm.reset();
    this.showTipoModal = true;
  }

  closeTipoModal(): void {
    this.showTipoModal = false;
  }

  // Modal Almacén
  openAddAlmacenModal(): void {
    this.almacenForm.reset({ cantidad: 1 });
    this.showAlmacenModal = true;
  }

  closeAlmacenModal(): void {
    this.showAlmacenModal = false;
  }

  // Modal Incrementar Stock
  openIncrementModal(almacen: Almacen): void {
    this.currentAlmacen = almacen;
    this.incrementForm.reset({ cantidad: 1 });
    this.showIncrementModal = true;
  }

  closeIncrementModal(): void {
    this.showIncrementModal = false;
    this.currentAlmacen = null;
  }

  // CRUD Operations
  onSubmitCama(): void {
    if (this.camaForm.invalid) return;
  
    const formData = this.camaForm.value;
  
    const camaData: CamaCreate = {
      modelo: formData.modelo,
      tipo_id: Number(formData.tipo_id),
      usuario_id: formData.usuario_id ? Number(formData.usuario_id) : null
    };
  
    if (this.isEditing && this.currentCamaId) {
      const updateData: CamaUpdate = {
        id: this.currentCamaId,
        ...camaData
      };
      
      this.camaService.updateCama(this.currentCamaId, updateData).subscribe({
        next: () => {
          this.loadData();
          this.closeCamaModal();
        },
        error: (err) => {
          console.error('Error al actualizar cama:', err);
          alert('Error al actualizar cama: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.camaService.createCama(camaData).subscribe({
        next: () => {
          this.almacenService.incrementarStock(camaData.tipo_id, -1).subscribe({
            next: () => {
              this.loadData();
              this.closeCamaModal();
            },
            error: (err) => {
              console.error('Error al actualizar stock:', err);
              alert('Cama creada pero error al actualizar stock: ' + err.message);
            }
          });
        },
        error: (err) => {
          console.error('Error al crear cama:', err);
          alert('Error al crear cama: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  onSubmitTipoCama(): void {
    if (this.tipoCamaForm.invalid) return;

    const tipoData: TipoCamaCreate = this.tipoCamaForm.value;

    this.tipoCamaService.createTipoCama(tipoData).subscribe({
      next: (nuevoTipo) => {
        // Crear registro en almacén para el nuevo tipo de cama
        this.almacenService.getOrCreateAlmacen(nuevoTipo.id).subscribe({
          next: () => {
            this.tiposCama.push(nuevoTipo);
            this.closeTipoModal();
            this.tipoCamaForm.reset();
            this.loadData();
            alert('Tipo de cama creado exitosamente!');
          },
          error: (err) => {
            console.error('Error al crear registro en almacén:', err);
            alert('Tipo de cama creado pero error al crear registro en almacén');
          }
        });
      },
      error: (err) => {
        console.error('Error al crear tipo de cama:', err);
        alert('Error al crear tipo de cama. Por favor intente nuevamente.');
      }
    });
  }

  onSubmitAlmacen(): void {
    if (this.almacenForm.invalid) return;

    const formData = this.almacenForm.value;
    const tipoId = Number(formData.tipo_cama_id);
    const cantidad = Number(formData.cantidad);

    // Verificar si ya existe un almacén para este tipo
    const existingAlmacen = this.almacenes.find(a => a.tipo_cama_id === tipoId);

    if (existingAlmacen) {
      // Si existe, incrementar el stock
      this.almacenService.incrementarStock(existingAlmacen.id, cantidad).subscribe({
        next: () => {
          this.loadData();
          this.closeAlmacenModal();
          alert('Stock actualizado exitosamente!');
        },
        error: (err) => {
          console.error('Error al incrementar stock:', err);
          alert('Error al actualizar stock: ' + err.message);
        }
      });
    } else {
      // Si no existe, crear un nuevo registro
      this.almacenService.createAlmacen({
        tipo_cama_id: tipoId,
        cantidad: cantidad
      }).subscribe({
        next: () => {
          this.loadData();
          this.closeAlmacenModal();
          alert('Registro de almacén creado exitosamente!');
        },
        error: (err) => {
          console.error('Error al crear registro en almacén:', err);
          alert('Error al crear registro en almacén: ' + err.message);
        }
      });
    }
  }

  onSubmitIncrement(): void {
    if (this.incrementForm.invalid || !this.currentAlmacen) return;

    const cantidad = Number(this.incrementForm.value.cantidad);

    this.almacenService.incrementarStock(this.currentAlmacen.id, cantidad).subscribe({
      next: () => {
        this.loadData();
        this.closeIncrementModal();
        alert('Stock incrementado exitosamente!');
      },
      error: (err) => {
        console.error('Error al incrementar stock:', err);
        alert('Error al incrementar stock: ' + err.message);
      }
    });
  }

  deleteCama(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cama?')) {
      const cama = this.camas.find(c => c.id === id);
      
      if (cama) {
        this.camaService.deleteCama(id).subscribe({
          next: () => {
            this.almacenService.incrementarStock(cama.tipo_id, 1).subscribe({
              next: () => {
                this.loadData();
              },
              error: (err) => {
                console.error('Error al actualizar stock:', err);
                alert('Cama eliminada pero error al actualizar stock: ' + err.message);
              }
            });
          },
          error: (err) => {
            console.error('Error al eliminar cama:', err);
            alert('Error al eliminar cama: ' + err.message);
          }
        });
      }
    }
  }
}