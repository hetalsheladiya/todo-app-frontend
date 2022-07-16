import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListService } from 'src/app/services/todo-list/todo-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private service: TodoListService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.service.logout().subscribe({
      next: () => {
        this.router.navigate(["/login"]);
        localStorage.clear()
      },
      error: (e) => {
        this.service.unAuthorizeRequest(e)
      }
    })    
  }

}
