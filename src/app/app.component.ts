import { environment } from "./../environments/environment";
import { Component, OnInit, ViewChild, ɵConsole } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import {
  StripeService,
  StripeCardNumberComponent,
  StripeCardComponent,
} from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from "@stripe/stripe-js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  apiUrl = environment.apiUrl;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "es",
  };

  stripeTestForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.stripeTestForm = this.fb.group({
      nombre: ["Angular", [Validators.required]],
      telefono: [""],
      direccion: [""],
      pais: [""],
      codigoPostal: [""],
      email: ["", [Validators.required]],
      // email: ['', [Validators.required]],
      // amount: [1001, [Validators.required, Validators.pattern(/\d+/)]],
    });
  }

  pay(): void {
    if (this.stripeTestForm.valid) {
      this.createPaymentIntent(this.stripeTestForm.value).subscribe(
        (result: any) => {
          console.log(result, "paymentintent and custumer");
          this.stripeService
            .confirmCardPayment(result.clientSecret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTestForm.get("nombre").value,
                  email: this.stripeTestForm.get("email").value,
                },
              },
            })
            .subscribe((result) => {
              if (result.error) {
                // Mostrar un error al cleinte
                console.log(result.error?.message);
              } else {
                // El pago ha sido precesado correctamente
                if (result.paymentIntent?.status === "succeeded") {
                  // Mostrar un mensaje al cliente
                  console.log(result, "succeeded");
                  // guardar informacion de la transacción
                  this.guardarTransaccion().subscribe((data) => {
                    console.log(data, "transacción guardada");
                  });
                }
              }
            });
        },
        (err) => {
          console.log(err, "error");
        }
      );
    } else {
      console.log(this.stripeTestForm);
    }
  }

  // ---------- Servicios ------------

  createPaymentIntent(userData: any): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/api/transaccion/intento-pago-stripe`,
      userData
    );
  }

  guardarTransaccion(transaccion:any = {}): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/api/transaccion/guardar-transaccion`,
      transaccion
    );
  }
}
