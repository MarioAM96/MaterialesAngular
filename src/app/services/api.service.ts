import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.tvmax.ec/api/';

constructor(private http: HttpClient) {}

addUser(payload: any): Observable<any> {
  return this.http.post(this.apiUrl + 'insert-user/1UliJqH6oNuZEk6l72r7alxHe5QOyYGS6ZzS8NtyfYP4/' + 'materiales-fibramax-65bb0c225f90.json', payload);
}
getUsers(): Observable<any> {
  return this.http.get(this.apiUrl + 'get-data/1UliJqH6oNuZEk6l72r7alxHe5QOyYGS6ZzS8NtyfYP4/EQUIPO/' + 'materiales-fibramax-65bb0c225f90.json');
}

getMaterials(): Observable<any> {
  return this.http.get(this.apiUrl + 'get-data/1UliJqH6oNuZEk6l72r7alxHe5QOyYGS6ZzS8NtyfYP4/MATERIAL_STOCK/' + 'materiales-fibramax-65bb0c225f90.json');
}

}
