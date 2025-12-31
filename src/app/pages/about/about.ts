import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  constructor(private cartService: CartService) { }

  aboutData() {
    this.cartService.aboutData();
  }

}
