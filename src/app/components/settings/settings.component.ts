// Import necessary Angular and Ag-Grid modules
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';

// Register all community modules with ag-Grid
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'my-app',
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ApiService],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;
  private checkboxStates: { [key: string]: boolean } = {};

  // Define columns for the grid including the custom operation column
  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'filename', headerName: 'Nombre de Archivo', editable: true },
    { field: 'size', headerName: 'Tamaño', filter: 'agNumberColumnFilter' },
    {
      field: 'last_modified',
      headerName: 'Última Modificación',
      valueFormatter: (params) => {
        const date = new Date(params.value * 1000);
        return date.toLocaleDateString();
      },
    },
    { field: 'sheetid', headerName: 'Sheet ID' },
    {
      headerName: 'Acciones',
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.checkboxStates[params.data.id] || false;

        const statusText = document.createElement('span');
        statusText.style.marginLeft = '8px';
        statusText.textContent = checkbox.checked ? 'Activo' : 'Inactivo';

        checkbox.addEventListener('change', () => {
          this.onCheckboxChange(params, checkbox.checked);
          statusText.textContent = checkbox.checked ? 'Activo' : 'Inactivo';
        });

        container.appendChild(checkbox);
        container.appendChild(statusText);
        return container;
      },
      cellStyle: (params) => {
        return this.checkboxStates[params.data.id]
          ? { backgroundColor: 'green' }
          : { backgroundColor: '' };
      },
    },
  ];

  // Default column definition for all the columns
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] = [10, 25, 50];

  constructor(private apiService: ApiService, private activeSheetService: ActiveSheetService) {}

  ngOnInit() {
    // Retrieve activeSheetId from sessionStorage
    const activeSheetId = sessionStorage.getItem('activeSheetId');
  
    this.apiService.getProyects().subscribe(
      (response) => {
        console.log('Proyectos obtenidos:', response);
        this.rowData = response;
  
        // Set checkbox states based on activeSheetId
        if (activeSheetId) {
          this.rowData?.forEach((row) => {
            this.checkboxStates[row.id] = row.sheetid === activeSheetId;
          });
        }
      },
      (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    );
  }

  ngAfterViewInit() {
    console.log(this.myGrid.api);
  }

  onCheckboxChange(params: any, isChecked: boolean) {
    const rowId = params.data.id;
  
    if (isChecked) {
      for (const key in this.checkboxStates) {
        if (this.checkboxStates.hasOwnProperty(key)) {
          this.checkboxStates[key] = false;
        }
      }
    }
  
    this.checkboxStates[rowId] = isChecked;
    this.myGrid.api.refreshCells({ force: true });
  
    if (isChecked) {
      const sheetId = params.data.sheetid;
      const filename = params.data.filename;
      this.activeSheetService.setActiveSheetId(sheetId);
      sessionStorage.setItem('activeSheetFilename', filename);
    } else {
      this.activeSheetService.setActiveSheetId(null);
      sessionStorage.removeItem('activeSheetId'); // Remove activeSheetId
      sessionStorage.setItem('activeSheetFilename', '');
    }
  }
}
