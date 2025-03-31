// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,
  FormsModule 
} from '@angular/forms';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.services';
import { SideAdminComponent } from "../../component/sidebarAdmin/sideAdmin.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    SideAdminComponent
]
})
export class AdminComponent implements OnInit {
  // Datos
  users: Usuario[] = [];
  
  // Estado de la UI
  showUserModal = false;
  isEditing = false;
  currentUserId: number | null = null;
  
  // Filtros y paginación
  filterText: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = 'name';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 20, 50];

  // Formularios
  userForm!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private initForms(): void {
    // Formulario de usuario
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      isPremium: [false]
    });
  }

  loadUsers(): void {
    this.usuarioService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.sortUsers();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  openAddUserModal(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.userForm.reset({ isPremium: false });
    this.showUserModal = true;
  }

  onEditUser(user: Usuario): void {
    this.isEditing = true;
    this.currentUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      isPremium: user.isPremium
    });
    this.userForm.controls['password'].clearValidators();
    this.userForm.controls['password'].updateValueAndValidity();
    this.showUserModal = true;
  }

  togglePremiumStatus(user: Usuario): void {
    const updatedUser: UsuarioUpdate = {
      id: user.id,
      isPremium: !user.isPremium
    };
    
    this.usuarioService.updateUser(user.id, updatedUser).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error updating user', err)
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  onSubmitUser(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    
    if (this.isEditing && this.currentUserId) {
      const updateData: UsuarioUpdate = {
        id: this.currentUserId,
        ...userData
      };
      
      if (!userData.password) {
        delete updateData.password;
      }

      this.usuarioService.updateUser(this.currentUserId, updateData).subscribe({
        next: () => {
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => console.error('Error updating user', err)
      });
    } else {
      const createData: UsuarioCreate = {
        ...userData,
        roleId: 1
      };
      
      this.usuarioService.createUser(createData).subscribe({
        next: () => {
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => console.error('Error creating user', err)
      });
    }
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.userForm.reset({ isPremium: false });
    this.userForm.controls['password'].setValidators([Validators.minLength(6)]);
    this.userForm.controls['password'].updateValueAndValidity();
  }

  // Métodos de utilidad
  filterUsers(): Usuario[] {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      user.lastname.toLowerCase().includes(this.filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  sortUsers(): void {
    this.users.sort((a, b) => {
      const valueA = a[this.sortField as keyof Usuario];
      const valueB = b[this.sortField as keyof Usuario];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortUsers();
  }

  get paginatedUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterUsers().slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filterUsers().length / this.itemsPerPage);
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filterUsers().length);
    return `Mostrando ${start} a ${end} de ${this.filterUsers().length} usuarios`;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  getFullName(user: Usuario): string {
    return `${user.name} ${user.lastname}`.toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}