import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  currentImageIndex = 0;
  private autoScrollInterval?: number;

  // Tes images locales
  images = [
    'assets/images/bebe1.jpg',
    'assets/images/bebe2.jpg',
    'assets/images/bebe3.jpg',
    'assets/images/bebe4.jpg',
    'assets/images/nouv_bebe1.png',
    'assets/images/nouv_bebe2.jpg'
  ];

  ngOnInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = window.setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval !== undefined) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  onCarouselMouseEnter(): void {
    this.stopAutoScroll();
  }

  onCarouselMouseLeave(): void {
    this.startAutoScroll();
  }
}