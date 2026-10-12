import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  imports: [FormsModule],
  selector: 'app-payment',
  styleUrl: './payment.css',
  templateUrl: './payment.html',
})
export class Payment implements OnInit{
  product:Product | null = null;
  quantity:number=1;
  total:number=0;
  loading = true;
  loadError = '';

  constructor(private route:ActivatedRoute,
    private router:Router,
    private productService:ProductService,
    private orderService:OrderService,
    private changeDetector:ChangeDetectorRef

  ){}

  ngOnInit():void{
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.quantity= Number(this.route.snapshot.queryParamMap.get('quantity'));

    this.productService.findProductById(id).subscribe(data =>{
      this.product=data;
      this.total = this.product.price * this.quantity;
      this.loading = false;
      this.changeDetector.markForCheck();
    }, () => {
      this.loading = false;
      this.loadError = `Could not load product ${id}. Check that the backend is running and that this product exists in its database.`;
      this.changeDetector.markForCheck();
    });
  }

  processPayment():void{
    if(!this.product){
      return;
    }

    const order = {
      product:{
        id:this.product.id
      },
      quantity:this.quantity
    };

    this.orderService.addOrder(order).subscribe((data:any) =>{
      console.log("Payment "+data);
      alert('Payment successfull');
    
      this.router.navigate(['/confirmation',data.id])
      
    });
  }
}
