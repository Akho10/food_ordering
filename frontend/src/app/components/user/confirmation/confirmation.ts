import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';

@Component({
  imports: [],
  selector: 'app-confirmation',
  styleUrl: './confirmation.css',
  templateUrl: './confirmation.html',
})
export class Confirmation implements OnInit{

  order: any = null;
  loading = true;
  loadError = '';

  constructor(private route:ActivatedRoute,
    private orderService:OrderService,
    private changeDetector: ChangeDetectorRef
  ){}

  ngOnInit(): void {
      const id= Number(this.route.snapshot.paramMap.get('id'));
      

      this.orderService.getOrderById(id).subscribe({
        next: data => {
          this.order = data;
          this.loading = false;
          this.changeDetector.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.loadError = `Could not load order ${id}. Check that the backend is running and that this order exists.`;
          this.changeDetector.markForCheck();
        },
      });
  }

}
