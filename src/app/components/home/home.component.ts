import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertPopupComponent } from 'src/app/dialogs/alert-popup/alert-popup.component';
import { EditTaskComponent } from 'src/app/dialogs/edit-task/edit-task.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TodoListService } from 'src/app/services/todo-list/todo-list.service';
import { UserService } from 'src/app/services/user/user.service';

export interface todoList {
  position: string;
  task: string;
  assignedTo: string;
  action: string;  
}

export interface userList {
  username: string,
  email: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumnsTask: string[] = ["position", "task", "assignedTo", "createdBy", "createdAt", "action"];
  dataSourceTask = new MatTableDataSource<todoList>;  
  
  displayedColumnsUser: string[] = ["position", "username", "email", "usertype", "action"];
  dataSourceUser = new MatTableDataSource<userList>;

  userId: string = ''; 
  usersList: any = []  

  @ViewChild(MatPaginator) paginator:any = MatPaginator;

  constructor(
    private todoService: TodoListService,
    private userService: UserService,
    private router: Router,
    private alert: AlertService,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(): void {
    this.taskList();
    this.userList()
  }

  ngAfterViewInit() {
    this.dataSourceTask.paginator = this.paginator;
    this.dataSourceUser.paginator = this.paginator;
  }

  selectUser(userId: any, element: any): void {    
    this.todoService.assignTask({taskId: element._id, userId: userId}).subscribe({
      next: (result) => {
        this.alert.openSnackBar(result.message, 'Success')
        this.taskList()
      },
      error: (e) => {
        this.todoService.unAuthorizeRequest(e)
      }
    })
  }

  taskList(): void {
    this.todoService.todoList().subscribe({
      next: (data) => {
        this.dataSourceTask.data = data.data;               
      },
      error: (e) => {
        this.todoService.unAuthorizeRequest(e)
      }
    })
  }

  userList(): void {
    this.userService.getUserList().subscribe({
      next: (data) => {
        this.usersList = data.data;
        this.dataSourceUser.data = data.data;            
      },
      error: (e) => {
        this.todoService.unAuthorizeRequest(e)
      }
    })
  }

  editTask(item: any): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {taskId : item._id, task: item.task}
    })   
    
    dialogRef.afterClosed().subscribe(response => {     
      if(response === 'Ok') 
        this.taskList()
    })
  } 

  deleteTask(data: any): void {
    this.todoService.deleteTask({taskId: data._id}).subscribe({
      next: (result) => {
        this.alert.openSnackBar(result.message, 'Success')
        this.taskList()
      },
      error: (e) => {
        this.todoService.unAuthorizeRequest(e)
      }
    })
  }

  udpateStatus(data: any) {     
    let param = {
      status: (data.status === 0) ? 1 : data.status,
      taskId: data._id
    }
    this.todoService.statusUpdate(param).subscribe({
      next: (result) => {       
        this.taskList()        
        this.alert.openSnackBar(result.message, 'Success')
      },
      error: (e) => {      
        this.todoService.unAuthorizeRequest(e)
      }
    })
  }

  deleteUser(data: any): void {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      data: {msg: `Are You Sure You Want To Delete This User?`},
      width: '600px'
    })
    dialogRef.afterClosed().subscribe(response => {
      if(response === 'Ok') {
        this.userService.deleteUser({userId: data._id}).subscribe({
          next: (result) => {
            this.alert.openSnackBar(result.message, 'Success')
            this.userList()
          },
          error: (e) => {
            this.todoService.unAuthorizeRequest(e)
          }
        })
      }
    })
    
  }
  
  logout(): void {
    this.todoService.logout().subscribe({
      next: () => {
        this.router.navigate(["/login"])
        localStorage.clear()
      },
      error: (e) => {
        this.todoService.unAuthorizeRequest(e)
      }
    })    
  }

 
}
