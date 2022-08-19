import { Users } from './../users';
import { UserService } from './../user.service';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserComponent } from './user/user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'place', 'action'];
  // dataSource = new MatTableDataSource();
  // @ViewChild(MatSort) sort!: MatSort;

  membersList: Array<any> = [];
  user: any = {};
  authorName: any;
  @ViewChild(UserComponent)
  userOne!: UserComponent;

  constructor(private userService: UserService, private dialog: MatDialog, private route: Router) {
  }

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  // }

  ngOnInit() {
    this.getUsers();
    this.authorName = JSON.parse(localStorage.getItem('user') || '').name;
  }

  addUser(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  postUser() {
    this.userService.postUser(this.user)
    this.user = {};
  }

  getUsers() {
    this.membersList = [];

    this.userService.getUser().snapshotChanges().subscribe(res => {
      this.membersList = res.map(res => ({ key: res.key, ...res.payload.val() }));
      console.log(this.membersList,"memberlist")
      this.membersList.forEach((user: any) => {
        if (user.name != this.authorName) {
          user.sendMsg = true;
        }
        else {
          user.sendMsg = false;
        }
      })
    });

  }

  showChat(user: any) {
    this.userOne.loadMessages(user);
  }

  logout() {
    this.userService.isUserExist = false;
    localStorage.setItem('isUser', 'false');
    localStorage.setItem('user', '');
    this.userService.hide();
    this.route.navigate(['login'])
  }



}
