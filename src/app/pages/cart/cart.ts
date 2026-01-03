import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  router = inject(Router);

  cartItems = this.cartService.cartItems;

  singleOrderProduct = signal<any>(null); // To track if ordering a single item

  isCheckoutModalOpen = false;

  userDetails = {
    name: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  };

  subtotal = computed(() => {
    const singleItem = this.singleOrderProduct();
    if (singleItem) {
      return singleItem.price * (singleItem.quantity || 1);
    }
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

  openCheckoutModal() {
    this.singleOrderProduct.set(null); // Ensure no single product is selected
    this.isCheckoutModalOpen = true;
  }

  closeCheckoutModal() {
    this.isCheckoutModalOpen = false;
    this.singleOrderProduct.set(null);
  }

  submitCheckout() {
    if (this.singleOrderProduct()) {
      // Order ONLY the single product
      this.cartService.placeOrder(this.userDetails, [this.singleOrderProduct()]);
    } else {
      // Order ALL items in cart
      this.cartService.placeOrder(this.userDetails, this.cartItems());
    }

    this.closeCheckoutModal();
    this.router.navigate(['/order']);
  }

  order(item: any) {
    this.singleOrderProduct.set(item);
    this.isCheckoutModalOpen = true;
  }
}
