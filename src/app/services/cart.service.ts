import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems = signal<any[]>(this.getCartFromStorage());
    toastr = inject(ToastrService);

    cartCount = computed(() => this.cartItems().length);

    constructor() {
        effect(() => {
            localStorage.setItem('cartItem', JSON.stringify(this.cartItems()));
        });
    }

    private getCartFromStorage() {
        if (typeof localStorage !== 'undefined') {
            const storedCart = localStorage.getItem('cartItem');
            return storedCart ? JSON.parse(storedCart) : [];
        }
        return [];
    }

    addToCart(product: any) {
        this.cartItems.update(items => {
            const existingItem = items.find(item => item.id === product.id);
            if (existingItem) {
                // If item exists, increase quantity
                return items.map(item =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            }
            // Add new item with quantity 1
            return [...items, { ...product, quantity: 1 }];
        });
        this.toastr.success('Item added to cart', 'Success');
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity < 1) return;
        this.cartItems.update(items =>
            items.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }

    removeFromCart(productId: number) {
        if (confirm('are you sure delete')) {
            this.cartItems.update(items => items.filter(item => item.id !== productId));
        }
    }


    aboutData() {
        alert("aboutData");
    }
}
