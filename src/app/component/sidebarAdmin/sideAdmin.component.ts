import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sideAdmin',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sideAdmin.component.html',
})
export class SideAdminComponent {}
