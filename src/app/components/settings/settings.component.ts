import { Component, ViewChild, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ImportsModule } from '../../imports';
import { Materiales } from '../../models/materiales.model';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table'

@Component({
  selector: 'my-app',
  imports: [HttpClientModule, ImportsModule, InputTextModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ApiService],
})
export class SettingsComponent implements OnInit {
  @ViewChild('dt2') dt2: Table | undefined;
  materials!: Materiales[];
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getMaterialsFromApi();
  }

  getMaterialsFromApi(): void {
    this.apiService.getMaterials().subscribe(
      (data: any[]) => {
        this.materials = data.map((item) => new Materiales(item));
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los materiales:', error);
      }
    );
  }

  filterCustomers(event: Event) {
    console.log('busqueda', event);
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt2!.filter(value, field, 'contains');
  }
}
