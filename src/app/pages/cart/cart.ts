import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;

  subtotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  });

  tax = computed(() => {
    return this.subtotal() * 0.05; // Assuming 5% tax
  });

  total = computed(() => {
    return this.subtotal() + this.tax();
  });

  updateQuantity(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }
}
