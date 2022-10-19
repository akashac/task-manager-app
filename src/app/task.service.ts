import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = "http://localhost:8080/taskmanger";

  constructor(private http: HttpClient) { }

  //Get All Tasks
  getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(`${this.baseUrl}`);
  }


  //Create New Task
  createNewTask(data: any): Observable<Task[]> {
    return this.http.post<Task[]>(this.baseUrl + '/add', data);
  }

  //Update Task
  updateTask(data: any): Observable<Task[]> {
    return this.http.put<Task[]>(this.baseUrl + '/update', data);
  }

  //Delete Task
  deleteTask(id: number): Observable<any> {
    return this.http.delete<Task[]>(this.baseUrl + '/delete/'+ id);
  }

}
