import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-user-home',
  styleUrl: './user-home.css',
  templateUrl: './user-home.html',
})
export class UserHome {

  products: Product[] = [];
   keyword: string = '';
  
    constructor(private productService: ProductService) { }
  
    ngOnInit(): void {
  
      //call service
      this.productService.getAllProducts().subscribe(data => {
        console.log("Product reveived: ", data);
        this.products = data;
      });
  
    }
  
    //search
    searchProducts(): void {
      this.productService.searchProductsByKeyword(this.keyword).subscribe(data => {
        this.products = data;
      });
  
    }
}
