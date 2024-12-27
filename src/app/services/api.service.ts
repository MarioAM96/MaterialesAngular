import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveSheetService } from './activesheet.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.tvmax.ec/api/';

  constructor(private http: HttpClient, private activeSheetService: ActiveSheetService) {}

  addUser(payload: any): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.post(this.apiUrl + 'insert-user/' + activeSheetId + '/' + activeSheetFilename, payload);
  }

  addOrder(payload: any): Observable<any> {
    console.log("PAY", payload);
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.post(this.apiUrl + 'get-data/' + activeSheetId + '/PEDIDOS/' + activeSheetFilename, payload);
  }

  getUsers(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.get(this.apiUrl + 'get-data/' + activeSheetId + '/EQUIPO/' + activeSheetFilename);
  }

  getMaterials(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.get(this.apiUrl + 'get-data/' + activeSheetId + '/MATERIAL_STOCK/' + activeSheetFilename);
  }

  getOrders(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.get(this.apiUrl + 'get-orders/' + activeSheetId + '/PEDIDOS/' + activeSheetFilename);
  }

  getDeliveries(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    const activeSheetFilename = this.activeSheetService.getActiveSheetFilename();
    if (!activeSheetId || !activeSheetFilename) {
      throw new Error('Datos API GOOGLE no disponibles');
    }
    return this.http.get(this.apiUrl + 'get-deliveries/' + activeSheetId + '/PEDIDOS/' + activeSheetFilename);
  }

  getProyects(): Observable<any> {
    return this.http.get(this.apiUrl + 'get-keys');
  }
}