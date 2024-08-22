import { Component,ViewChild,OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Sort, MatSortModule} from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { ApiData } from './ApiData';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{  
  @ViewChild('paginator') paginator:MatPaginator;
  
    title = 'todoApp';
    showForm:boolean=false;
    ob:number=0;
    cols:string[]=['userId','id','title','Action1','Action2'];
    posts=[];
    puid:number;
    pid:number;
    ptitle:string="";
    pstid:number;
    formHeader="";
    sorteddt:ApiData[];
    datasource:any;
    dta:any;
    ri:boolean=false;
    postdt=new ApiData();
    delid:number;
    constructor(private http:HttpClient,private ap:TodoService){
        
    }
    
    ngOnInit(): void {
      this.datasource=new MatTableDataSource(this.posts);
      this.ap.getData().subscribe(res=>{
        this.posts=res;
        this.datasource.data=this.posts;
        this.datasource.paginator=this.paginator;
        console.log("Data fetched successfully!",this.posts);
      })
    }     
    
    sortData(sort: Sort) {
      const data = this.posts.slice();
      this.sorteddt = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'psuid':
            return compare(a.userIdid, b.userId, isAsc);
          case 'psid':
            return compare(a.id, b.id, isAsc);
          case 'pstitle':
            return compare(a.title,b.title,isAsc);
          default:
            return 0;
        }
      });
      this.datasource.data=this.sorteddt;
    }
    openForm(data:any){
    this.showForm=true;
    if(data){
      this.puid=data.userId;
      this.pid=data.id;
      this.ptitle=data.title;
      this.formHeader="Edit Post";
      this.ri=true;
   }
   else{
    this.formHeader="Add Post";
    this.pstid=Math.max(...this.posts.map(it=>it.id));
    this.puid=null;
    this.pid=++this.pstid;
    this.ptitle="";
    this.ri=false;
   }
  }
  saveForm(){
    this.showForm=false;
    if(this.formHeader=="Edit Post"){
        let uid=this.pid;
        let updt={
          userId:this.puid,
          id:this.pid,
          title:this.ptitle
        };
        this.ap.updateData(updt,uid).subscribe(
          (res)=>{
            for(let ele of this.posts){
              if(ele.id==res.id){
                ele.userId=res.userId;
                ele.id=res.id;
                ele.title=res.title;
              }
            }
            this.datasource.data=this.posts;
            console.log("Data Updated Successfully!",res);
          }
        )
      
    }
    else if(this.formHeader=="Add Post"){
      const fd=this.posts.some(el=>el.id==this.pid && el.userId==this.puid);
      if(!fd){
          this.postdt={userId:this.puid,id:this.pid,title:this.ptitle};
          this.ap.createData(this.postdt).subscribe(
            (res)=>{
              this.posts.push(res);
              this.datasource.data=this.posts;
              console.log("Data Inserted successfully!",res);
            }
          )
      }
      else{
        alert("Post is existed!");
      }
    }
  }
  deltodo(ind:any){
    this.delid=ind;
    this.ap.deleteData(this.delid).subscribe(
      (res)=>{
        this.posts=this.posts.filter(it=>it.id!=this.delid);
        this.datasource.data=this.posts;
        console.log("Data Deleted Successfully!",res);
      }
    )
  }
  closeForm(){
    this.showForm=false;
    this.clearForm();
  }
  clearForm(){
    this.puid=null;
    this.pid=null;
    this.ptitle="";
  } 
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
