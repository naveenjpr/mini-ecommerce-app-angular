import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Cart } from './pages/cart/cart';
import { Order } from './pages/order/order';

export const routes: Routes = [

    { path: '', component: Home },
    { path: 'about', component: About },

    { path: 'cart', component: Cart },
    { path: 'order', component: Order },
    { path: '**', redirectTo: '' } // Fallback to home
];
