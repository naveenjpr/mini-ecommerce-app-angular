import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

import axios from 'axios';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  cartService = inject(CartService);

  products = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading.set(true);

    axios.get('https://dummyjson.com/products')
      .then((response) => {
        this.products.set(response.data.products);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.error.set('Failed to load products');
        this.loading.set(false);
      });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

}
