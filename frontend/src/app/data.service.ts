import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:1337'; 
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/graph`);
  }

  getColor(): Observable<any> {
    return this.http.get(`${this.apiUrl}/color`);
  }

  getPosition(): Observable<any> {
    return this.http.get(`${this.apiUrl}/position`);
  }
}
