import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements OnInit {
  msg: string = ''
  constructor(
    private dialog : MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA)data: any
  ) {
    this.msg = data.msg
   }

  ngOnInit(): void {
  }

  ok() {
    this.dialog.close('Ok')
  }

  close () {
    this.dialog.close()
  } 
}
