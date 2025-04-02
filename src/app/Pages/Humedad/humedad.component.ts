import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-humedad',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChartModule],
  templateUrl: './humedad.component.html',
  styleUrls: ['./humedad.component.css']
})
export class HumedadComponent implements OnInit {
  humidityChartData: any;
  chartOptions: any;
  
  // Datos estáticos
  currentHumidity = 70;
  idealHumidityRange = { min: 65, max: 75 };
  status = 'Óptima';

  ngOnInit() {
    this.initializeChart();
  }

  private initializeChart() {
    // Datos fijos para la gráfica
    const staticData = [68, 67, 66, 67, 68, 69, 70, 71, 72, 71, 70, 69, 
                        70, 71, 72, 73, 72, 71, 70, 69, 68, 67, 68, 69];

    this.humidityChartData = {
      labels: Array.from({length: 24}, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Humedad Actual',
          data: staticData,
          borderColor: '#4C270A',
          backgroundColor: 'rgba(76, 39, 10, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: '#4C270A',
          pointRadius: 3
        },
        {
          label: 'Humedad Ideal',
          data: Array(24).fill(70),
          borderColor: '#4CAF50',
          borderDash: [5, 5],
          tension: 0,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
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
          intersect: false
        }
      },
      scales: {
        y: {
          min: 50,
          max: 80,
          ticks: {
            color: '#6B7280',
            stepSize: 5
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
}