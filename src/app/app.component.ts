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

import { IPayPalConfig, ICreateOrderRequest } from "ngx-paypal";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;

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

  pagoForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      // datos de pago 

      nombre: ["Angular", [Validators.required]],
      telefono: ["656566534"],
      direccion: [""],
      pais: [""],
      email: ["", [Validators.required]],
      tipoPago: [""],

      // Cuenta
      password: ["password", [Validators.required]],
      fechaNacimiento: [""],
      aceptoTerminosCondiciones: [true, [Validators.required]],
      perfilGrupo: [false, [Validators.required]],
      emailVerificado: [false, [Validators.required]],
      menorEdad: [false, [Validators.required]],
      emailResponsable: [""],
      id_catalogoIdiomas: ["IDI_3", [Validators.required]],
      nombreContacto: ["Angular", [Validators.required]],
      listaTipoPerfiles: [[]],
      tipoAlbum: [[]],
      archivos: [[]],
    });

    this.initConfigPaypal();
  }

  pagarStripe(): void {
    this.pagoForm.controls.tipoPago.patchValue("stripe");
    const pagoStripe = {
      nombre: this.pagoForm.controls.nombre.value,
      telefono: this.pagoForm.controls.telefono.value,
      direccion: this.pagoForm.controls.direccion.value,
      pais: this.pagoForm.controls.pais.value,
      email: this.pagoForm.controls.email.value,
      tipoPago: this.pagoForm.controls.direccion.value,
    };

    if (this.pagoForm.valid) {
      this.crearPagoStripe(pagoStripe).subscribe(
        (result: any) => {
          console.log(result, "paymentintent and custumer");
          this.stripeService.confirmCardPayment(result.data.clientSecret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.pagoForm.get("nombre").value,
                  email: this.pagoForm.get("email").value,
                },
              },
            })
            .subscribe((result) => {
              if (result.error) {
                console.log(result.error?.message); // Mostrar un error al cleinte
              } else {
                if (result.paymentIntent?.status === "succeeded") {
                  console.log(result, "succeeded"); // si el pago es satisfactorio crear cuenta
                  this.crearCuenta(this.pagoForm.value).subscribe((data) => {
                    console.log(data, "Cuenta creada"); // redirigir o prensertar mensaje
                  });
                }
              }
            });
        },
        (err) => {
          console.log(err, "error servidor");
        }
      );
    } else {
      console.log(this.pagoForm); // Si el formulario no es válido
    }
  }

  private initConfigPaypal(): void {
    this.payPalConfig = {
      clientId:"ATFYWrmZeBoByifZnWG3CobzUiAoVtTo9U6pEnN7pSFi898Rwr83uZgVyhJDvPYyohdvNiH5FMwL4975",
      currency: "USD",
      createOrderOnServer: (data) =>
        fetch(`${this.apiUrl}/api/transaccion/paypal-pago`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((order) => order.orderID),
      advanced: {
        commit: "true",
      },
      style: {
        label: "paypal",
        layout: "vertical",
      },

      onApprove: (data, actions) => {
        console.log(
          "onApprove - Transaccion ha sido aprovada, pero no autorizada",
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log("onApprove - you can get full order details inside onApprove: ",details);
        });
      },
      onClientAuthorization: (data) => {
        console.log("onClientAuthorization - transacción autorizada",data
        );
        // this.showSuccess = true;
        this.crearCuenta(this.pagoForm.value).subscribe((cuenta) =>
          console.log(cuenta, "cuenta creada")
        );
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
        // this.showCancel = true;
      },
      onError: (err) => {
        console.log("OnError", err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
        // this.resetStatus();
      },
    };
  }

  // ---------- Servicios ------------

  crearPagoStripe(userData: any): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.apiUrl}/api/transaccion/stripe-pago`,userData);
  }

  crearCuenta(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/crear-cuenta`,userData);
  }
}
