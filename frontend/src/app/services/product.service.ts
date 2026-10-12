import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService{
    
    private apiUrl = '/api/products';

    constructor(private http:HttpClient){}

    //getAll
    getAllProducts(): Observable<Product[]>{

        return this.http.get<Product[]>(this.apiUrl + '/list');
    }

    //findById
     findProductById(id:number): Observable<Product>{

        return this.http.get<Product>(this.apiUrl + '/list/'+id);
    }

    //add
     addProduct(product:Product): Observable<Product>{

        return this.http.post<Product>(this.apiUrl + '/add', product);
    }

    //update
     updateProduct(id:number, product:Product): Observable<Product>{

        return this.http.put<Product>(this.apiUrl + '/edit/'+ id , product);
    }

    //search

     searchProductsByKeyword(keyword:string): Observable<Product[]>{

          return this.http.get<Product[]>(this.apiUrl + '/search/'+ encodeURIComponent(keyword));
    }
    
    //delete
     deleteProductById(id:number): Observable<void>{

        return this.http.delete<void>(this.apiUrl + '/delete/'+ id);
    }

}