import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs'; // Ajouté pour l'auto-défilement

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  showMobile = false;
  currentYear = new Date().getFullYear();

  // --- LOGIQUE CARROUSEL ---
  images: string[] = [
    'assets/images/bebe1.jpg',
    'assets/images/bebe2.jpg',
    'assets/images/bebe3.jpg',
    'assets/images/bebe4.jpg',
    'assets/images/bebe5.png',
    'assets/images/nouv_bebe1.png',
    'assets/images/nouv_bebe2.png'

  ];
  currentImageIndex: number = 0;
  private carouselSubscription: Subscription | undefined;

  ngOnInit(): void {
    // Démarrer l'auto-défilement toutes les 5 secondes
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement pour éviter les fuites de mémoire
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
  }

  startAutoScroll(): void {
    // Si l'auto-défilement n'est pas déjà actif, l'activer
    if (!this.carouselSubscription) {
      this.carouselSubscription = interval(5000).subscribe(() => {
        this.nextImage();
      });
    }
  }

  stopAutoScroll(): void {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
      this.carouselSubscription = undefined;
    }
  }

  // Passer à l'image suivante
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  // Passer à l'image précédente
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  // Aller directement à une image spécifique (utilisé par les points de navigation)
  goToImage(index: number): void {
    this.currentImageIndex = index;
    // Redémarrer l'auto-défilement après une interaction manuelle
    this.stopAutoScroll();
    this.startAutoScroll();
  }
}