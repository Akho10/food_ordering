import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {

  //create empty list
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

  //delete
  deleteProduct(id: number): void {
    this.productService.deleteProductById(id).subscribe(() => {
      alert('Product deleted successfully');

      //refresh list
       this.productService.getAllProducts().subscribe(data => {
      this.products = data;
        });

    });
  }

}