import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})


export class TaskComponent implements OnInit {

  closeResult!: string;
  tasks!: Task[];
  editForm! : FormGroup;
  deleteTaskId! : number;
  
  displayedColumns = ['title','description','priority','status'];
  dataSource!: MatTableDataSource<any>; 
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
    ) { }


  ngOnInit(): void {

    this.editForm = this.formBuilder.group({
      id:[''],
      title: [''],
      description: [''],
      priority: [''],
      status: [''],
      dateTime:['']
    });

    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;
      this.tasks = data;
    });

  }


  addTask(f: any) {
    //console.log(f.value);
    this.taskService.createNewTask(f.value).subscribe((data: Task[]) => {
      this.tasks = data;
      this.modalService.dismissAll(); //dismiss the modal
    });
  }

  editTask(targetModal: any , task: Task) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });

   this.editForm.patchValue( {
    id: task.id,
    title: task.title,
    description: task.description,
    priority:task.priority,
    status: task.status,
    dateTime: task.dateTime
  });
 }

  updateTask(){
    this.taskService.updateTask(this.editForm.value).subscribe((data: Task[]) => {
      this.tasks = data;
      this.modalService.dismissAll(); //dismiss the modal
    });
  }
  
  openDelete(targetModal: any, task: Task) {
    this.deleteTaskId = task.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  deleteTask(){
    this.taskService.deleteTask(this.deleteTaskId).subscribe((data: Task[]) => {
      this.tasks = data;
      this.modalService.dismissAll(); //dismiss the modal
    });
  }

  open(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
