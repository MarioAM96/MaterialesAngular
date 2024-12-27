import { Component, ViewChild, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { ActiveSheetService } from '../../services/activesheet.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { HttpClientModule } from '@angular/common/http';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  providers: [ApiService],
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
  ],
})
export class DeliveriesComponent implements OnInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;
  public rowDataTecnicos: any[] | null = null;

  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', type: 'text' },
    {
      field: 'Material Solicitado',
      headerName: 'Material Solicitado',
      type: 'text',
    },
    { field: 'Cantidad', headerName: 'Cantidad', type: 'number' },
    { field: 'Observación', headerName: 'Observación', type: 'text' },
    {
      field: 'Fecha solicitada',
      headerName: 'Fecha Solicitada',
      type: 'date',
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'Paquete de Trabajo',
      headerName: 'Paquete de Trabajo',
      type: 'text',
    },
    {
      field: 'Técnico Responsable',
      headerName: 'Técnico Responsable',
      type: 'text',
    },
    { field: 'Status Entrega', headerName: 'Status Entrega', type: 'text' },
    { field: 'Bodega', headerName: 'Bodega', type: 'number' },
    { field: 'Código', headerName: 'Código', type: 'number' },
    {
      field: 'Fecha de entrega',
      headerName: 'Fecha de Entrega',
      type: 'date',
      valueFormatter: (params) => {
        if (params.value === 0) return 'N/A';
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'Cantidad Entregada',
      headerName: 'Cantidad Entregada',
      type: 'number',
    },
  ];

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] = [10, 25, 50, 100, 200];

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  isLinear = true;

  public materials: { name: string; value: string }[] = [];
  public tecnicos: { name: string; value: string }[] = [];

  // Control to show/hide the stepper
  public showStepper: boolean = false;

  constructor(
    private apiService: ApiService,
    private activeSheetService: ActiveSheetService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getDeliveries();
    this.getTecnicos();

    this.firstFormGroup = this._formBuilder.group({
      material: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      observacion: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      fechaSolicitada: ['', Validators.required],
      paqueteTrabajo: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      tecnico: ['', Validators.required],
    });
  }

  getDeliveries() {
    this.apiService.getDeliveries().subscribe(
      (response) => {
        this.rowData = response;
      },
      (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    );
  }

  getTecnicos() {
    this.apiService.getUsers().subscribe(
      (response: any[]) => {
        this.rowDataTecnicos = response;
        this.tecnicos = response
          .filter((item) => item.Nombre && item.Nombre.trim() !== '')
          .map((item) => ({
            name: item.Nombre,
            value: item.id,
          }));
      },
      (error) => {
        console.error('Error al obtener los técnicos:', error);
      }
    );
  }

  toggleStepper() {
    this.showStepper = !this.showStepper;
  }

  onSubmit() {
    const newOrder = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    };
    console.log('Nuevo pedido:', newOrder);
    // Aquí puedes agregar la lógica para enviar el nuevo pedido al backend
    // Después de enviar, puedes resetear los formularios si lo deseas
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    // Opción: Ocultar el stepper después de enviar el formulario
    this.showStepper = false;
  }
}