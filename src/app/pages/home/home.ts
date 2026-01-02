import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import axios from 'axios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  cartService = inject(CartService);

  products = signal<any[]>([]);
  allProducts = signal<any[]>([]);
  categoryList = signal<string[]>([]);
  selectedCategories = signal<string[]>([]);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchProducts();
    this.fetchCategoryList();
  }

  // 🔹 Products API
  fetchProducts() {
    this.loading.set(true);

    axios.get('https://dummyjson.com/products')
      .then(res => {
        this.allProducts.set(res.data.products);
        this.products.set(res.data.products);
        this.loading.set(false);
      })
      .catch(() => {
        this.error.set('Failed to load products');
        this.loading.set(false);
      });
  }

  // 🔹 Category API
  fetchCategoryList() {
    axios.get('https://dummyjson.com/products/category-list')
      .then(res => {
        this.categoryList.set(res.data);
      })
      .catch(err => console.error(err));
  }

  // 🔹 Category Checkbox Change
  onCategoryChange(category: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedCategories.update(list => [...list, category]);
    } else {
      this.selectedCategories.update(list =>
        list.filter(c => c !== category)
      );
    }

    this.applyFilter();
  }

  // 🔹 Filter Logic
  applyFilter() {
    const selected = this.selectedCategories();

    if (selected.length === 0) {
      this.products.set(this.allProducts());
      return;
    }

    const filtered = this.allProducts().filter(product =>
      selected.includes(product.category)
    );

    this.products.set(filtered);
  }

  // 🔹 Cart
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }


  //filter ka logic

  onSortChange(event: any) {
    console.log(event.target.value);
    if (event.target.value === "name-asc") {
      this.products.set(this.products().sort((a, b) => a.title.localeCompare(b.title)));
    }
    if (event.target.value === "name-desc") {
      this.products.set(this.products().sort((a, b) => b.title.localeCompare(a.title)));
    }
    if (event.target.value === "price-asc") {
      this.products.set(this.products().sort((a, b) => a.price - b.price));
    }
    if (event.target.value === "price-desc") {
      this.products.set(this.products().sort((a, b) => b.price - a.price));
    }
    if (event.target.value === "discount-asc") {
      this.products.set(this.products().sort((a, b) => a.discountPercentage - b.discountPercentage));
    }
    if (event.target.value === "discount-desc") {
      this.products.set(this.products().sort((a, b) => b.discountPercentage - a.discountPercentage));
    }

  }
}
