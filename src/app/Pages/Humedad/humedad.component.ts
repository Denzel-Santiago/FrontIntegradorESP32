// humedad.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";
import { ChartModule } from 'primeng/chart';
import { HumedadService } from '../../services/humedad.service';
import { Humedad } from '../../interfaces/humedad.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-humedad',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChartModule],
  templateUrl: './humedad.component.html',
  styleUrls: ['./humedad.component.css']
})
export class HumedadComponent implements OnInit, OnDestroy {
  // Datos para la gráfica
  humidityChartData: any;
  chartOptions: any;

  // Estado actual
  currentHumidity = 0;
  idealHumidityRange = { min: 10, max: 27 };
  status = 'Óptima';
  lastUpdateTime: string = '';
  connectionStatus: string = 'Conectando...';
  messageCount: number = 0;

  // Historial de datos
  private humidityHistory: number[] = Array(24).fill(null);
  private timeLabels: string[] = [];
  private humedadSub!: Subscription;
  private connectionSub!: Subscription;

  constructor(private humedadService: HumedadService) {}

  ngOnInit() {
    this.initializeChart();
    this.initializeTimeLabels();
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    // Suscripción a los datos de humedad (usando getMessages en lugar de getCurrentHumedad)
    this.humedadSub = this.humedadService.getMessages().subscribe({
      next: (data) => {
        this.messageCount++;
        console.log('Datos recibidos:', data, 'Total mensajes:', this.messageCount);
        this.processNewData(data);
      },
      error: (err) => {
        console.error('Error en la suscripción:', err);
        this.connectionStatus = 'Error de conexión';
      }
    });

    // Suscripción al estado de la conexión
    this.connectionSub = this.humedadService.getConnectionStatus().subscribe({
      next: (connected) => {
        this.connectionStatus = connected ? 'Conectado' : 'Desconectado';
        console.log('Estado de conexión:', this.connectionStatus);
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

  private processNewData(data: Humedad): void {
    // Actualizar valores
    this.currentHumidity = data.humedad;
    this.status = this.getHumidityStatus(data.humedad);
    this.lastUpdateTime = new Date().toLocaleTimeString();

    // Agregar nuevo dato al historial
    this.humidityHistory.shift();
    this.humidityHistory.push(data.humedad);

    // Actualizar gráfica
    this.updateChartData();
  }

  private getHumidityStatus(humidity: number): string {
    if (humidity >= this.idealHumidityRange.min && humidity <= this.idealHumidityRange.max) {
      return 'Óptima';
    } else if (humidity < this.idealHumidityRange.min) {
      return 'Baja';
    } else {
      return 'Alta';
    }
  }

  private initializeChart(): void {
    this.humidityChartData = {
      labels: this.timeLabels,
      datasets: [
        {
          label: 'Humedad Actual',
          data: [...this.humidityHistory],
          borderColor: '#4C270A',
          backgroundColor: 'rgba(76, 39, 10, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: '#4C270A',
          pointRadius: 3
        },
        {
          label: 'Rango Ideal',
          data: Array(24).fill(this.idealHumidityRange.min),
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
          label: '',
          data: Array(24).fill(this.idealHumidityRange.max),
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
                label += `${context.parsed.y}%`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: '#6B7280',
            stepSize: 10
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Humedad (%)',
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
    // Actualiza solo los datos necesarios para mejor performance
    this.humidityChartData = {
      ...this.humidityChartData,
      labels: [...this.timeLabels],
      datasets: [
        {
          ...this.humidityChartData.datasets[0],
          data: [...this.humidityHistory]
        },
        ...this.humidityChartData.datasets.slice(1)
      ]
    };
  }

  ngOnDestroy(): void {
    this.humedadSub?.unsubscribe();
    this.connectionSub?.unsubscribe();
  }
}