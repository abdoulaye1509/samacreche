import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  
  import { HomeRoutingModule } from './home-routing.module';
  import { ReactiveFormsModule } from '@angular/forms';
  
  
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      HomeRoutingModule,
      ReactiveFormsModule
    ]
  })
  export class HomeModule { }
  