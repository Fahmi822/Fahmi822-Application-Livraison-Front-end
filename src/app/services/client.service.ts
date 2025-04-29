import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:5287/api/clients'; // adapte selon ton API

  constructor(private http: HttpClient) {}

  getClientInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`); // `/me` = infos du client connecté
  }

  updateClientInfo(id: number, clientData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, clientData);
  }
}
