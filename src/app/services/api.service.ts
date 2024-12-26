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
    if (!activeSheetId) {
      throw new Error('Active sheet ID is not set');
    }
    return this.http.post(this.apiUrl + 'insert-user/' + activeSheetId + '/materiales-fibramax-65bb0c225f90.json', payload);
  }

  getUsers(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    if (!activeSheetId) {
      throw new Error('Active sheet ID is not set');
    }
    return this.http.get(this.apiUrl + 'get-data/' + activeSheetId + '/EQUIPO/materiales-fibramax-65bb0c225f90.json');
  }

  getMaterials(): Observable<any> {
    const activeSheetId = this.activeSheetService.getActiveSheetId();
    if (!activeSheetId) {
      throw new Error('Active sheet ID is not set');
    }
    return this.http.get(this.apiUrl + 'get-data/' + activeSheetId + '/MATERIAL_STOCK/materiales-fibramax-65bb0c225f90.json');
  }

  getProyects(): Observable<any> {
    return this.http.get(this.apiUrl + 'get-keys');
  }
}