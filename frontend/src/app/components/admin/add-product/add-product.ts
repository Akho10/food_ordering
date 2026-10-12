import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';

@Component({
  imports: [FormsModule],
  selector: 'app-add-product',
  styleUrl: './add-product.css',
  templateUrl: './add-product.html',
})
export class AddProduct {

  product:Product = {

    id:0,
    name:'',
    description:'',
    price:0,
    quantity:0,
    imageUrl:''
  };

  constructor(private productService:ProductService){}

  addProduct():void{
    this.productService.addProduct(this.product).subscribe(data =>{
      console.log('Product added'+data)
      alert('Product added succesfully');

    this.product= {

    id:0,
    name:'',
    description:'',
    price:0,
    quantity:0,
    imageUrl:''
  };
    });
  }

}
