import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";
import { ChartModule } from 'primeng/chart';
import { LuzService } from '../../services/luz.services';
import { Luz } from '../../interfaces/luz.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-luz',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChartModule],
  templateUrl: './luz.component.html',
  styleUrls: ['./luz.component.css']
})
export class LuzComponent implements OnInit, OnDestroy {
  // Datos para la gráfica
  luzChartData: any;
  chartOptions: any;

  // Estado actual
  currentLuz: number | null = null;
  idealLuzRange = { min: 25000, max: 28000 }; // Valores en Ohmios basados en datos reales
  status: string = '--';
  lastUpdateTime: string = '';
  connectionStatus: string = 'Conectando...';
  messageCount: number = 0;

  // Historial de datos
  private luzHistory: number[] = Array(24).fill(null);
  private timeLabels: string[] = [];
  private luzSub!: Subscription;
  private connectionSub!: Subscription;

  constructor(private luzService: LuzService) {}

  ngOnInit() {
    this.initializeChart();
    this.initializeTimeLabels();
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    // Suscripción a los datos de luz
    this.luzSub = this.luzService.getMessages().subscribe({
      next: (data: Luz) => {
        this.messageCount++;
        console.log('Datos recibidos:', data);
        this.processNewData(data);
      },
      error: (err) => {
        console.error('Error en la suscripción:', err);
        this.connectionStatus = 'Error de conexión';
        this.status = 'Error';
        this.currentLuz = null;
      }
    });

    // Suscripción al estado de la conexión
    this.connectionSub = this.luzService.getConnectionStatus().subscribe({
      next: (connected) => {
        this.connectionStatus = connected ? 'Conectado' : 'Desconectado';
        if (!connected) {
          this.status = 'Sin conexión';
        }
      },
      error: (err) => {
        console.error('Error en estado de conexión:', err);
      }
    });
  }

  private initializeTimeLabels(): void {
    const now = new Date();
    this.timeLabels = Array.from({length: 24}, (_, i) => {
      const time = new Date(now);
      time.setHours(time.getHours() - (23 - i));
      return this.formatTime(time);
    });
  }

  private formatTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  private processNewData(data: Luz): void {
    if (!data || typeof data.value !== 'number') {
      console.error('Dato inválido recibido:', data);
      return;
    }

    // Actualizar valores
    this.currentLuz = data.value;
    this.status = this.getLuzStatus(data.value);
    this.lastUpdateTime = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Actualizar historial
    this.updateDataHistory(data.value);
  }

  private updateDataHistory(value: number): void {
    // Eliminar el dato más antiguo y agregar el nuevo
    this.luzHistory.shift();
    this.luzHistory.push(value);
    
    // Actualizar gráfica
    this.updateChartData();
  }

  private getLuzStatus(luzValue: number): string {
    if (luzValue >= this.idealLuzRange.min && luzValue <= this.idealLuzRange.max) {
      return 'Óptima';
    } else if (luzValue < this.idealLuzRange.min) {
      return 'Muy brillante'; // Menor resistencia = más luz
    } else {
      return 'Muy oscuro'; // Mayor resistencia = menos luz
    }
  }

  private initializeChart(): void {
    this.luzChartData = {
      labels: this.timeLabels,
      datasets: [
        {
          label: 'Resistencia LDR',
          data: [...this.luzHistory],
          borderColor: '#4C270A',
          backgroundColor: 'rgba(76, 39, 10, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: '#4C270A',
          pointRadius: 3
        },
        {
          label: 'Rango Ideal Mínimo',
          data: Array(24).fill(this.idealLuzRange.min),
          borderColor: '#4CAF50',
          borderDash: [5, 5],
          tension: 0,
          borderWidth: 1,
          pointRadius: 0,
          fill: {
            target: '-1',
            above: 'rgba(76, 175, 80, 0.1)',
            below: 'rgba(76, 175, 80, 0.1)'
          }
        },
        {
          label: 'Rango Ideal Máximo',
          data: Array(24).fill(this.idealLuzRange.max),
          borderColor: '#4CAF50',
          borderDash: [5, 5],
          tension: 0,
          borderWidth: 1,
          pointRadius: 0
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Desactiva animación para actualizaciones en tiempo real
      },
      plugins: {
        legend: {
          labels: {
            color: '#4C270A',
            font: {
              size: 14,
              family: "'Inter', sans-serif"
            },
            padding: 20,
            usePointStyle: true
          },
          position: 'bottom'
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += `${context.parsed.y.toLocaleString('es-ES')} Ω`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          min: 20000,
          max: 30000,
          ticks: {
            color: '#6B7280',
            stepSize: 1000,
            callback: (value: number) => {
              return `${(value / 1000).toFixed(0)}k Ω`;
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Resistencia (Ω)',
            color: '#4C270A',
            font: {
              weight: 'bold',
              size: 14
            }
          }
        },
        x: {
          ticks: {
            color: '#6B7280',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Hora del día',
            color: '#4C270A',
            font: {
              weight: 'bold',
              size: 14
            }
          }
        }
      }
    };
  }

  private updateChartData(): void {
    this.luzChartData = {
      ...this.luzChartData,
      labels: [...this.timeLabels],
      datasets: [
        {
          ...this.luzChartData.datasets[0],
          data: [...this.luzHistory]
        },
        ...this.luzChartData.datasets.slice(1)
      ]
    };
  }

  ngOnDestroy(): void {
    if (this.luzSub) {
      this.luzSub.unsubscribe();
    }
    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }
  }
}