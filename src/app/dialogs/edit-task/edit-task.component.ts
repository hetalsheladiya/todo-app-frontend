import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TodoListService } from 'src/app/services/todo-list/todo-list.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  task: string = '';
  taskId: string = ''
  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private todoService: TodoListService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private alert: AlertService
  ) {     
    this.task = data.task;
    this.taskId = data.taskId    
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }

  save() {
    const param = {
      taskId: this.taskId,
      task: this.task
    }
    this.todoService.updateTask(param).subscribe({
      next: (data) => {            
        this.dialogRef.close('Ok');
        this.alert.openSnackBar(data.message, 'Success')
      },
      error: (e) => {      
        this.todoService.unAuthorizeRequest(e)
      }
    })
  } 

}
