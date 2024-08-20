import { Component,ViewChild,OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit } from '@angular/core';
import {Sort, MatSortModule} from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';

export interface Emp{
  id:number,
  employee_name:string,
  employee_salary:number,
  employee_age:number
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{
    title = 'todoApp';
    showForm:boolean=false;
    ob:number=0;
    cols:string[]=['id','employee_name','employee_salary','employee_age','Action1','Action2'];
    empl=[];
    empid:number=6;
    eid:number=0;
    ename:string="";
    esalary:number=0;
    eage:number=0;
    formHeader="";
    ri:boolean=false;
    sortedData:Emp[];
    datasource:any;
    constructor(private http:HttpClient){
        
    }
    
    ngOnInit(): void {
      this.http.get<any>("https://dummy.restapiexample.com/api/v1/employees").subscribe(
        (res)=>{
          this.empl=res.data;
        }
      )
      this.datasource=new MatTableDataSource(this.empl);
      this.sortedData = this.empl.slice();
      this.datasource.paginator=this.paginator;
      this.datasource.data=this.empl;
    }   
    @ViewChild('paginator') paginator:MatPaginator;
    
    sortData(sort: Sort) {
      const data = this.empl.slice();
      this.sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'emid':
            return compare(a.id, b.id, isAsc);
          case 'emname':
            return compare(a.employee_name, b.employee_name, isAsc);
          case 'emsalary':
            return compare(a.employee_salary,b.employee_salary,isAsc);
          case 'emage':
            return compare(a.employee_age,b.employee_age,isAsc);
          default:
            return 0;
        }
      });
      this.datasource.data=this.sortedData;
    }
    openForm(data:any){
    this.showForm=true;
    if(data){
      this.eid=data.id;
      this.ename=data.employee_name;
      this.esalary=data.employee_salary;
      this.eage=data.employee_age;
      this.formHeader="Edit Employee";
      this.ri=true;
   }
   else{
    this.formHeader="Add Employee";
    this.empid=Math.max(...this.empl.map((itm)=>itm.id));
    this.eid=++this.empid;
    this.ename="";
    this.esalary=null;
    this.eage=null;
    this.ri=false;
   }
  }
  saveForm(){
    this.showForm=false;
    if(this.formHeader=="Edit Employee"){
      const found=this.empl.some(el=>el.employee_name==this.ename);
      if(!found){
        for(let ele of this.empl){
          if(ele.id==this.eid){
            ele.employee_name=this.ename;
            ele.employee_salary=this.esalary;
            ele.employee_age=this.eage;
          }
        }
      }
      else{
        alert("Employee is existed!");
      }
    }
    else if(this.formHeader=="Add Employee"){
      const fd=this.empl.some(el=>el.employee_name==this.ename);
      if(!fd){
        this.empl.push({id:this.eid,employee_name:this.ename,employee_salary:this.esalary,employee_age:this.eage});
         this.datasource.data=this.empl;
      }
      else{
        alert("Employee is existed!")
      }
    }
  }
  deltodo(ind:any){
    this.empl = this.empl.filter(item => item.id !== ind.id);
    this.datasource.data=this.empl;
  }
  closeForm(){
    this.showForm=false;
    this.clearForm();
  }
  clearForm(){
    this.eid=null;
    this.ename="";
    this.esalary=null;
    this.eage=null;
  } 
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
