import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';


@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) { }

  todoList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/task/list`)
  }

  addTask(data: any): Observable<any> {        
    return this.http.post(`${environment.apiUrl}/task/add`, data)
  }

  updateTask(data: any): Observable<any> {   
    return this.http.put(`${environment.apiUrl}/task/update`, data)
  }

  deleteTask(data: any): Observable<any> {      
    return this.http.delete(`${environment.apiUrl}/task/delete/${data.taskId}`)
  }

  statusUpdate(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/task/status-update`, data)
  }

  logout(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/logout`)
  }

  assignTask(data: any):Observable<any> {
    return this.http.post(`${environment.apiUrl}/task/assignTaskToUser`, data)
  }

  unAuthorizeRequest(e:any) {   
    if(e.status === 401)        
      this.router.navigate(["/login"])
    if(e.status === 400)
      if(Array.isArray(e.error.errors)) 
        this.alert.openSnackBar(e.error.errors[0].msg, 'Error')
        else 
        this.alert.openSnackBar(e.error.errors, 'Error')        
    if(e.status === 404) 
      this.alert.openSnackBar(e.error.error, 'Error')
  }
}
