import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// stripe
import { NgxStripeModule } from 'ngx-stripe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    NgxStripeModule.forRoot('pk_test_51H7p9XHBVcdcrZQAhAQK81lD4du7n0CxEIxoCIILNNL9s1Fy44O9hZkD6qTPVHixtGNqWhI5D2EyYGsN4xtUy9bp00syWkrOeR'),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
