import { environment } from "./../environments/environment";
import { Component, OnInit, ViewChild, ɵConsole } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
      metodoPago: ["METPAG_3"],

      // Cuenta
      password: ["password", [Validators.required]],
      fechaNacimiento: ["29/03/2007"],
      aceptoTerminosCondiciones: [true, [Validators.required]],
      perfilGrupo: [false, [Validators.required]],
      emailVerificado: [false, [Validators.required]],
      menorEdad: [false, [Validators.required]],
      emailResponsable: ["responsable@gmail.com"],
      id_catalogoIdiomas: ["IDI_3", [Validators.required]],
      nombreContacto: ["Angular", [Validators.required]],
      listaTipoPerfiles: [[]],
      tipoAlbum: [[]],
      archivos: [[]],
    });

    this.initConfigPaypal();
  }

  pagarStripe(): void {
    // this.pagoForm.controls.tipoPago.patchValue("stripe");
    const pagoStripe = {
      "email": "jj@gmail.com",
      "contrasena": "123456",
      "fechaNacimiento": "2016-02-01",
      "aceptoTerminosCondiciones": true,
      "perfilGrupo": false,
      "emailVerificado": false,
      "menorEdad": false,
      "emailResponsable": "leonardo-daniell06@gmail.com",
      "metodoPago":{"codigo": "METPAG_1"},
      "nombreResponsable": "Juann",
      "perfiles": [
          {
              "nombreContacto": "byronAf",
              "nombre":"Leonardo",
              "tipoPerfil": {
                  "codigo": "TIPERFIL_1"
                  },
              "album": [{
                  "nombre": "",
                  "tipo": {"codigo":"CATALB_1"},
                  "portada": {
                      "_id": "5f6decd5c07e1055c837f0e7"
                  },
                  "media": [
                  {
                      "_id": "5f6decd5c07e1055c837f0e7",
                      "traducciones": [{"descripcion": 'Se encontró el cofre perdido'}]
                  }
              ]
              }],
              "direcciones": [
                  {
                      "latitud": null,
                      "longitud": null,
                      "descripcion": "Loja",
                      "localidad": {"codigo":"LOC_735"}
                  }
              ],
              "telefonos": [
                  {
                      "numero": "012322222",
                      "pais": {"codigo":"PAI_31"}
                  }
              ]
          }
      ],
      "datosFacturacion": {
          "nombres": "Leonardo",
          "telefono": "098765432",
          "direccion": "Loja"
      }
  }
    // {
    //   nombre: this.pagoForm.controls.nombre.value,
    //   telefono: this.pagoForm.controls.telefono.value,
    //   direccion: this.pagoForm.controls.direccion.value,
    //   pais: this.pagoForm.controls.pais.value,
    //   email: this.pagoForm.controls.email.value,
    //   metodoPago: this.pagoForm.controls.metodoPago.value,
    // };

    if (true) {
      let idTransaccion: any;
      this.crearCuenta(pagoStripe).subscribe(
        (data: any) => {
          // console.log(result, "paymentintent and idTransaccion");

          // const datos = result.respuesta;
          idTransaccion = data.respuesta.datos?.idTransaccion;
          console.log(data, "datos");
          this.stripeService
            .confirmCardPayment(data.respuesta.datos.idPago, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: "nombre",
                  email: "byjose007@gmail.com",
                },
              },
            }).subscribe((result) => {
              if (result.error) {
                console.log(result.error?.message); // Mostrar un error al cleinte
              } else {
                if (result.paymentIntent?.status === "succeeded") {
                  console.log(result, "succeeded"); // si el pago es satisfactorio crear cuenta
                  this.verificarCuenta(idTransaccion).subscribe((data) => {
                    console.log(data, "Cuenta creada y verificada"); // redirigir o prensertar mensaje
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
    const pago = {
      "email": "fsffsfs@gmail.com",
      "contrasena": "123456",
      "fechaNacimiento": "2016-02-01",
      "aceptoTerminosCondiciones": true,
      "perfilGrupo": false,
      "emailVerificado": false,
      "menorEdad": false,
      "emailResponsable": "leonardo-daniell06@gmail.com",
      "metodoPago":{"codigo": "METPAG_3"},
      "nombreResponsable": "Juann",
      "perfiles": [
          {
              "nombreContacto": "leow8fssddf",
              "nombre":"Leonardo",
              "tipoPerfil": {
                  "codigo": "TIPERFIL_2"
                  },
              "album": [{
                  "nombre": "",
                  "tipo": {"codigo":"CATALB_1"},
                  "portada": {
                      "_id": "5f3174a42f91d9652034231d"
                  },
                  "media": [
                  {
                      "_id": "5f3174a42f91d9652034231d"
                  }
              ]
              }],
              "direcciones": [
                  {
                      "latitud": null,
                      "longitud": null,
                      "descripcion": "Loja",
                      "localidad": {"codigo":"LOC_735"}
                  }
              ],
              "telefonos": [
                  {
                      "numero": "012322222",
                      "pais": {"codigo":"PAI_31"}
                  }
              ]
          }
      ],
      "datosFacturacion": null
  }

    let idTransaccion: string;

    this.payPalConfig = {
      clientId:
        "ATFYWrmZeBoByifZnWG3CobzUiAoVtTo9U6pEnN7pSFi898Rwr83uZgVyhJDvPYyohdvNiH5FMwL4975",
        
      currency: "USD",
      createOrderOnServer: (data) =>
        fetch(`${this.apiUrl}/api/cuenta/`, {
          method: "POST",
          body: JSON.stringify(pago),
          headers: {
            "content-type": "application/json",
            apiKey: "d2e621a6646a4211768cd68e26f21228a81",
          },
        })
          .then((res) => res.json())
          .then((order) => {
            console.log(order, "order");
            idTransaccion = order.respuesta.datos?.idTransaccion;
            return order.respuesta.datos.idPago;
          }),
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
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log("onClientAuthorization - transacción autorizada", data);
        // this.showSuccess = true;
        this.verificarCuenta(idTransaccion).subscribe((cuenta) =>
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

  // crearPagoStripe(userData: any): Observable<PaymentIntent> {
  //   return this.http.post<PaymentIntent>(`${this.apiUrl}/api/transaccion/stripe-pago`,userData);
  // }

  crearCuenta(userData: any): Observable<any> {
    let headers = { apiKey: "d2e621a6646a4211768cd68e26f21228a81", idioma: 'es' };
    

    return this.http.post<any>(`${this.apiUrl}/api/cuenta`, userData, {
      headers,
    });
  }

  verificarCuenta(idTransaccion: any): Observable<any> {
    let headers = { apiKey: "d2e621a6646a4211768cd68e26f21228a81" };
    return this.http.post<any>(
      `${this.apiUrl}/api/cuenta/validar/`,
      { idTransaccion: idTransaccion },
      { headers }
    );
  }
}
