import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  
  import { HomeRoutingModule } from './public-routing.module';
  import { ReactiveFormsModule } from '@angular/forms';
  
  
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      HomeRoutingModule,
      ReactiveFormsModule
    ]
  })
  export class PublicModule { }
  