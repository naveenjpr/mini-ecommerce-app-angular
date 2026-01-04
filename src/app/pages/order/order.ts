import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  cartService = inject(CartService);
  order = this.cartService.order;

  subtotal = computed(() => {
    const ord = this.order();
    if (!ord || !ord.items) return 0;
    return ord.items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
  });
}
