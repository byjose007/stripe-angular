import { environment } from './../environments/environment';
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { StripeService, StripeCardNumberComponent, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  apiUrl = environment.apiUrl;

  cardOptions: StripeCardElementOptions = {

    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['Angular v10', [Validators.required]],
      amount: [1001, [Validators.required, Validators.pattern(/\d+/)]],
    });
  }

  pay(): void {
    if (this.stripeTest.valid) {
      this.createPaymentIntent(this.stripeTest.value)
        .subscribe((result: any) => {
          console.log(result.clientSecret, 'piiiiiiii');
          this.stripeService.confirmCardPayment(result.clientSecret, {
            payment_method: {
              card: this.card.element,
              billing_details: {
                name: this.stripeTest.get('name').value,
              },
            },
          }).subscribe(result => {
        
            if (result.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.log(result.error?.message);
            } else {
              // The payment has been processed!
              if (result.paymentIntent?.status === 'succeeded') {
                // Show a success message to your customer
                console.log(result, 'succeeded');
              }
            }

          });


        });
    } else {
      console.log(this.stripeTest);
    }
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/api/transaccion/intento-pago`, { amount }
    );
  }
}