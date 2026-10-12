import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';

    constructor(private http:HttpClient){}

    //addOrder
    addOrder(order:any): Observable<any>{
    
            return this.http.post<any>(this.apiUrl + '/add', order);
        }

    //getById
    getOrderById(id:number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/list/' + id);

    }
}
