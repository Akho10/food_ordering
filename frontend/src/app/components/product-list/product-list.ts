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
  message = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  private loadProducts(): void {
    this.message = '';
    this.productService.getAllProducts().subscribe({
      next: data => this.products = data,
      error: () => this.message = 'Could not load products. Check that the API is available.'
    });

  }

  //search
  searchProducts(): void {
    const keyword = this.keyword.trim();
    if (!keyword) {
      this.loadProducts();
      return;
    }

    this.message = '';
    this.productService.searchProductsByKeyword(keyword).subscribe({
      next: data => {
        this.products = data;
        if (data.length === 0) {
          this.message = `No products found for "${keyword}".`;
        }
      },
      error: () => this.message = 'Could not search products. Check that the API is available.'
    });

  }

  //delete
  deleteProduct(id: number): void {
    this.productService.deleteProductById(id).subscribe(() => {
      alert('Product deleted successfully');

      //refresh list
      this.loadProducts();

    });
  }

}