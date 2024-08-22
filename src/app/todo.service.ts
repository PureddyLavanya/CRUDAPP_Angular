import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiData } from './ApiData';
@Injectable({
  providedIn: 'root'
})
export class TodoService implements OnInit{
  constructor(private http:HttpClient) { }

  ngOnInit():void{
    }

  getData():Observable<any>{
    let gapi="https://jsonplaceholder.typicode.com/posts";
    return this.http.get(gapi);
  }
  createData(postdt:ApiData):Observable<any>{
    let papi="https://jsonplaceholder.typicode.com/posts";
    return this.http.post(papi,postdt);
  }
  updateData(updt:any,uid:number):Observable<any>{
    let upapi="https://jsonplaceholder.typicode.com/posts";
    let upid=uid;
    const url=`${upapi}/${upid}`;
    return this.http.patch(url,updt);
  }
  deleteData(delid:number):Observable<any>{
    let emplid=delid;
    let dlapi="https://jsonplaceholder.typicode.com/posts";
    const myurl=`${dlapi}/${emplid}`;
    return this.http.delete(myurl);
  }

}
