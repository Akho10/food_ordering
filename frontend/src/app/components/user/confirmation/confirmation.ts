import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';

@Component({
  imports: [],
  selector: 'app-confirmation',
  styleUrl: './confirmation.css',
  templateUrl: './confirmation.html',
})
export class Confirmation implements OnInit{

  order:any = null;

  constructor(private route:ActivatedRoute,
    private orderService:OrderService
  ){}

  ngOnInit(): void {
      const id= Number(this.route.snapshot.paramMap.get('id'));
      

      this.orderService.getOrderById(id).subscribe(data => {
        console.log("Order ",data);
        this.order = data;
      });
  }

}
