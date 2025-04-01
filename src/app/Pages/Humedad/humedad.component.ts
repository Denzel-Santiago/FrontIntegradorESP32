import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";

@Component({
  selector: 'app-humedad',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './humedad.component.html',
})
export class HumedadComponent {}