// usuario.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-Luz',
     standalone: true,
    imports: [CommonModule, SidebarComponent, BaseChartDirective],
    templateUrl: './luz.component.html',
    styleUrls: ['./luz.component.css']
})

export class LuzComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Datos para la gráfica de humedad
  public humidityChartData: ChartConfiguration<'line'>['data'] = {
    labels: Array(24).fill(0).map((_, i) => `${i}:00`), // 24 horas
    datasets: [
      {
        label: 'Humedad Actual',
        data: this.generateRandomData(65, 75),
        borderColor: '#4C8BFF',
        backgroundColor: 'rgba(76, 139, 255, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 0 // Para mejor rendimiento con muchos puntos
      },
      {
        label: 'Humedad Ideal',
        data: Array(24).fill(70),
        borderColor: '#4C270A',
        backgroundColor: 'rgba(76, 39, 10, 0.1)',
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0
      }
    ]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000 // Animación suave
    },
    plugins: {
      title: {
        display: true,
        text: 'MONITOREO DE HUMEDAD - ÚLTIMAS 24 HORAS',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        displayColors: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Humedad (%)',
          font: {
            weight: 'bold',
            size: 12
          }
        },
        min: 50,
        max: 80,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: 5,
          font: {
            size: 11
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hora del día',
          font: {
            weight: 'bold',
            size: 12
          }
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Datos para los paneles
  currentHumidity = 70;
  idealHumidityRange = { min: 65, max: 75 };
  status = 'Óptima';

  ngOnInit() {
    // Inicializar con datos actuales
    this.updateCurrentData();
    
    // Simular datos en tiempo real
    setInterval(() => {
      this.simulateNewData();
    }, 2000); // Actualizar cada 2 segundos
  }

  private generateRandomData(min: number, max: number): number[] {
    return Array(24).fill(0).map(() => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  private updateCurrentData() {
    // Tomar el último dato como valor actual
    this.currentHumidity = this.humidityChartData.datasets[0].data[23] as number;
    this.updateStatus();
  }

  private updateStatus() {
    this.status = this.currentHumidity >= this.idealHumidityRange.min && 
                 this.currentHumidity <= this.idealHumidityRange.max ? 'Óptima' : 'Fuera de rango';
  }

  private simulateNewData() {
    // Generar nueva humedad aleatoria entre 60 y 80
    const newHumidity = Math.floor(Math.random() * 21) + 60;
    this.currentHumidity = newHumidity;
    this.updateStatus();

    // Mover todos los datos una posición a la izquierda
    const newData = [...this.humidityChartData.datasets[0].data.slice(1), newHumidity];
    
    // Actualizar gráfica
    this.humidityChartData = {
      ...this.humidityChartData,
      datasets: [
        {
          ...this.humidityChartData.datasets[0],
          data: newData
        },
        this.humidityChartData.datasets[1]
      ]
    };

    // Forzar actualización de la gráfica
    setTimeout(() => {
      this.chart?.update();
    }, 0);
  }
}