import { Component, ViewChild, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from '../../services/api.service';
import { ActiveSheetService } from '../../services/activesheet.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Deliveries } from '../../models/deliveries.model';
import { Table } from 'primeng/table';
import { ImportsModule } from '../../imports';


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  providers: [ApiService,MessageService],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ToastModule,
    ImportsModule
  ],
})
export class DeliveriesComponent implements OnInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;
  @ViewChild('dt1') dt1: Table | undefined;
  deliveries!: Deliveries[];
  public rowData: any[] | null = null;
  public rowDataTecnicos: any[] | null = null;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] = [10, 25, 50, 100, 200];
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  isLinear = true;
  loading: boolean = true;

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
      (response: Deliveries[]) => {
        this.rowData = response;
        this.deliveries = response;
        console.log("DELIVERIES", this.deliveries);
        this.loading = false;
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

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt1!.filter(value, field, 'contains');
  }
}
