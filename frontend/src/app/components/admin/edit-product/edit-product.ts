import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-edit-product',
  styleUrl: './edit-product.css',
  templateUrl: './edit-product.html',
})
export class EditProduct implements OnInit {


  product: Product = {

    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageUrl: ''
  };

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  
    const id= Number(this.route.snapshot.paramMap.get('id'));

    this.productService.findProductById(id).subscribe(data => {
      this.product=data;
    });
   
  }

  updateProduct(): void {
  this.productService.updateProduct( this.product.id,this.product).subscribe(data => {

      alert('Product updated successfully');

      this.router.navigate(['/products']);
    });
  }

}
