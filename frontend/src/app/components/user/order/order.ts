import { ChangeDetectorRef, Component } from '@angular/core';
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
  loading = true;
  loadError = '';

  constructor(private route:ActivatedRoute,
    private productService:ProductService,
    private changeDetector:ChangeDetectorRef
  ){}

  ngOnInit():void{
    const productId = this.route.snapshot.paramMap.get('id');
    const id = Number(productId);

    if (!productId || !Number.isInteger(id) || id <= 0) {
      this.loading = false;
      this.loadError = 'The product link is invalid. Return to the product list and select a product again.';
      return;
    }

    this.productService.findProductById(id).subscribe({
      next: data => {
        this.product = data;
        this.loading = false;
        if (data) {
          this.calcTotal();
        } else {
          this.loadError = 'This product was not found. Return to the product list and select another product.';
        }
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.loadError = `Could not load product ${id}. Check that the backend is running and that this product exists in its database.`;
        this.changeDetector.markForCheck();
      },
    });
  }

  calcTotal():void{
    if(this.product){
      this.total = this.product.price * this.quantity;
    }
  }
}
