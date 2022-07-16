import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  getUserTypeList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usertype-list`)
  }

  signup(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, data)
  }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, data)
  }

  getUserList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user-list`)
  }

  deleteUser(data: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/user-delete/${data.userId}`)
  }

}
