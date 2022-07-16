import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TodoListService } from 'src/app/services/todo-list/todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @ViewChild('task') el:any = ElementRef
  @ViewChild('btn') btn:any = ElementRef
  @ViewChild('span') spn:any = ElementRef
  taskList: any;
  filterList: any;
  taskForm:any = FormGroup
  constructor(
    private service: TodoListService,
    private fb: FormBuilder,   
    private alert: AlertService
  ) {
    this.taskForm = fb.group({
      taskId: [null],
      task: ["", [Validators.required]]
    })
   }
  
  ngOnInit(): void {
    this.todoList('')
  }

  todoList(element: any): void {   
    if(element) {
      [...element.parentElement.children].forEach(sib => sib.classList.remove('active'))
      element.classList.add('active')
    }
    else {
      if(this.spn.nativeElement) {
        document.querySelector('span#All')?.classList.add("active")
        this.spn.nativeElement.nextElementSibling.classList.remove('active')
        this.spn.nativeElement.nextElementSibling.parentElement.lastElementChild.classList.remove('active')
      }        
    }
    this.service.todoList().subscribe({
      next: (data) => {
        this.taskList = data.data;  
        this.filterList = this.taskList; 
      },
      error: (e) => {
        this.service.unAuthorizeRequest(e)
      }
    })
  }

  addTask(): void { 
    if(this.btn._elementRef.nativeElement.innerText == 'Submit') {
      this.service.addTask(this.taskForm.value).subscribe({
        next: (data) => {   
          this.alert.openSnackBar(data.message, 'Success')
          this.todoList('')
          this.taskForm.reset()
        },
        error: (e) => {      
          this.service.unAuthorizeRequest(e)
        }
      })
    }
    else {
      this.service.updateTask(this.taskForm.value).subscribe({
        next: () => {   
          this.btn._elementRef.nativeElement.innerText = 'Submit'          
          this.todoList('')
          this.taskForm.reset()
        },
        error: (e) => {      
          this.service.unAuthorizeRequest(e)
        }
      })
    }
  }

  edit(data:any): void {
    this.taskForm.setValue({taskId: data._id, task: data.task})
    this.btn._elementRef.nativeElement.innerText = "Edit";       
  }

  delete(data: any): void {   
    this.service.deleteTask({taskId: data._id}).subscribe({
      next: (result) => {
        this.alert.openSnackBar(result.message, 'Success')
        this.todoList('')
      },
      error: (e) => {
        this.service.unAuthorizeRequest(e)
      }
    })
  }

  udpateStatus(data: any) {     
    let param = {
      status: (data.status === 0) ? 1 : data.status,
      taskId: data._id
    }
    this.service.statusUpdate(param).subscribe({
      next: (result) => {       
        this.taskList = this.filterList.filter((item: any) => item.status == param.status)  
        this.btn._elementRef.nativeElement.innerText = 'Submit'          
        this.todoList('')
        this.taskForm.reset()
        this.alert.openSnackBar(result.message, 'Success')
      },
      error: (e) => {      
        this.service.unAuthorizeRequest(e)
      }
    })
  }

  filterTask(data: number, element: any): void {   
    [...element.parentElement.children].forEach(sib => sib.classList.remove('active'))
    element.classList.add('active')    
    this.taskList = this.filterList.filter((item: any) => item.status == data)
  }  

}
