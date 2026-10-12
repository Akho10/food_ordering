import { Component } from '@angular/core';
import { Product } from '../../../models/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-order',
  styleUrl: './order.css',
  templateUrl: './order.html',
})
export class Order {

  product:Product | null = null;
  quantity:number=1;
  total:number=0;

  constructor(private route:ActivatedRoute,
    private productService:ProductService
  ){}

  ngOnInit():void{
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.findProductById(id).subscribe(data =>{
      this.product=data;
      this.calcTotal();

    });
  }

  calcTotal():void{
    if(this.product){
      this.total = this.product.price * this.quantity;
    }
  }
}
