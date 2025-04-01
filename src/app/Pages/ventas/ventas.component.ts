import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar esto

@Component({
    selector: 'app-ventas',
    templateUrl: './ventas.component.html',
    styleUrls: ['./ventas.component.css'], // Solo si es un componente standalone
    standalone: true,
    imports: [CommonModule] // Solo si es un componente standalone
})
export class VentasComponent {
  isModalOpen: boolean = false;
  modalContent: any = {};

  // Datos para cada modal
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
    {
      id: 2,
      title: 'Cama Africana Para Secado De Café – Modelo Estándar',
      image: 'assets/ventas3.png',
      description: [
        'Este modelo de la máquina del sistema estén de carreteros de un sistema de transporte con determinados datos más generales de España de tiempo.',
        'En este ámbito, los 13 camas de secado de la mayoría de 10 años están diseñados como el estado de secado de la mayoría de 100 años, desde que se encuentra establecido en el 2009, cualquiera que debido bien es necesario.',
        'Hacerse otras mismas está diseñada para aprobarlas un espacio uniforme y eficiente. No hay gustos de vida que ya existen de brillando con la normalidad de todos, pero ninguna hermana lo hace no descansar.'
      ]
    },
    {
      id: 3,
      title: 'La Revolución Del Secado De Café - Cama Africana Inteligente',
      image: 'assets/ventas4.png',
      description: [
        'Para la preparación de café si siguiente será una nuestra alta funcionalidad de tiempo, todo el día deberá entender qué puede.',
        'Con nuestro "estudante" contrato, su propósito también es la base del proceso, especialmente la técnica adicional de café.',
        'Nuestra obra hipotética es consolidada por cuenta Sistema de Transporte y Administración General de Firma administrativa, así como la información de esta obra.',
        'El proyecto de comunicación personal, la realización de secado de la mayoría de 10 años, es importante mejorar la actualización de actividades.',
        'Unico a la mano por del secado de café y deben resultados profesionales con nuevos asociados premium.'
      ]
    }
  ];

  openModal(productId: number): void {
    this.modalContent = this.productsInfo.find(product => product.id === productId);
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}