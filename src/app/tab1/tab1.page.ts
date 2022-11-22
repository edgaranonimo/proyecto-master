import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Libros } from '../modelos/libros';
import { UsuarioService } from '../servicios/usuario.service';
import { DatosService } from '../servicios/datos.service';
import { Users } from '../modelos/users';
import {
  AvailableResult,
  BiometryType,
  NativeBiometric,
} from 'capacitor-native-biometric';
import * as CryptoJS from 'crypto-js';
import { proxyInputs } from '@ionic/angular/directives/proxies-utils';

//import { threadId } from 'node:worker_threads';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})



export class Tab1Page implements OnInit {
  //edgar 
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  libros: Libros[];
  libroToAdd: Libros;
  userCar = new Users();
  s: number;
  l: number;
  ms: number;
  pt: string;
  gn: number;
  key: string;
  passConfirm: string;
  gn2: number;
  passTime: boolean;
  genero: Array<string>;
  selectedGenero: string;
  libroCounter: number;
  editLibro: boolean;
  public us: boolean;
  noCredentials: boolean;
  desktop: boolean;
  slideOptions = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;

            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
  };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 4,
    loop: false,
    centeredSlides: false,
    spaceBetween: 20
  };
  //termina slide funciones

  constructor(public router: Router, public userService: UsuarioService, public dato: DatosService,
    public alertController: AlertController, public platform: Platform) {
    this.us = true;
    this.gn = this.ObtenerLibros();
    this.gn2 = this.inicReg();
    //Item object for Nature
    this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: []
    };
    this.sliderTwo = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: []
    };
    this.libroToAdd = new Libros();
    this.s = 0;
    this.l = 0;
    this.pt = "";
    this.ms = 0;
    this.genero = [
      "Accion",
      "Comedia",
      "Romance",
      "Terror",
      "Ciencia",
      "Educacion",
      "Ficcion",
      "Autosuperacion",
      "Historia",
      "Cuentos",
      "Novela",
      "Religion",
      "Psicologico"
    ]
    this.selectedGenero = "";
    this.libroCounter = 0;
    this.editLibro = false;
    this.noCredentials = true;
    this.desktop = false;
    this.passConfirm = "";
    this.passTime = false;
    this.key = '8jf0¡7wsjf09rfj@odfdjlk-d03ue?dfs';
  }

  setCredential() {
    // Save user's credentials
    NativeBiometric.setCredentials({
      username: this.userService.ActUser.email.toString(),
      password: this.userService.ActUser.password.toString(),
      server: 'Libreria',
    }).then();
  }

  checkCredential() {
    console.log(this.platform.platforms(), this.platform.is('desktop'));
    if (this.platform.is('desktop')) {
      this.noCredentials = true;
    } else {
      this.setCredential();
      NativeBiometric.isAvailable().then((result: AvailableResult) => {
        const isAvailable = result.isAvailable;
        alert('RESULT ' + JSON.stringify(result));
        // const isFaceId=result.biometryType==BiometryType.FACE_ID;
        // const isFaceId = result.biometryType == BiometryType.FACE_ID;
        if (isAvailable) {
          // Get user's credentials
          this.noCredentials = false;
          NativeBiometric.getCredentials({
            server: 'Libreria',
          }).then((credentials) => {
            alert('CREDENTIAL ' + JSON.stringify(credentials));
            // Authenticate using biometrics before logging the user in
            NativeBiometric.verifyIdentity({
              reason: 'For easy log in',
              title: 'Log in',
              subtitle: 'Maybe add subtitle here?',
              description: 'Maybe a description too?',
            })
              .then(() => {
                //     // Authentication successful
                alert('SUCCESS!!');
                //     // this.login(credentials.username, credentials.password);
              })
              .catch((err) => {
                //   // Failed to authenticate
                alert('FAIL!');
              });
          });
        } else {
          this.noCredentials = true;
        }
      });
    }
  }

  //logout

  redict3() {
    if (this.userService.login) {
      this.userService.login = false;
      this.userService.admin = false;
      this.userService.ActUser = new Users();
    }
  }

  ObtenerLibros() {
    this.dato.ObtenLibros()
      .subscribe(res => {
        this.dato.libros = res as Libros[];
        this.libros = res as Libros[];
        this.sliderOne.slidesItems = res as Libros[];
        console.log(res);
      })
    return 18;
  }

  inicReg() {
    if (this.userService.correo != '') {
      this.userService.ObtenerUsers();
      this.userService.empleados.forEach(element => {
        if (this.userService.correo == element.email) {
          this.userService.ActUser = element;
          this.userService.login = true;
          this.userService.correo = '';
        }
      });
    }
    return 0;
  }

  ngOnInit() {
    this.rOpenModal();
  }

  async btnCom(lib) {
    let libCar = new Libros();
    this.libros.forEach(element => {
      if (element._id == lib) {
        libCar = element;
      }
    });
    if (this.userService.login) {
      this.userService.ActUser.compras.push(libCar);
      (await this.userService.actEmpleado(this.userService.ActUser)).subscribe(res => {
        this.presentAlert();
      });
    } else {
      this.LoginAlert();
      /*this.inicReg();
      this.btnCom(lib);*/
    }
  }
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  openModal() {
    if (this.s == 1) {
      this.s = 0;
    } else { this.s = 1; }
  }

  rOpenModal() {
    this.s = 0;
  }

  redict() {
    this.router.navigate(['/tabs/tab4']);
  }
  btnShow() {
    if (this.ms == 1) {
      this.ms = 0;
    } else {
      this.ms = 1;
    }
  }
  getGenArray() {
    let s = "";
    let j = false;
    this.dato.libros.forEach(element => {
      s = element.genero;
      this.sliderTwo.slidesItems.forEach(element => {
        if (element.genero == s) {
          j = true;
        }
      });
      if (j == false) {
        this.sliderTwo.slidesItems.push(element);
      }
      j = false;
    });
  }

  getlibroarray() {
    let r = 0;
    this.dato.libros.forEach(element => {
      this.sliderOne.slidesItems.push(element);
      r++;
    });
    if (r == 1) {
      this.sliderOne.isEndSlide = true;
    }
    if (r > 1) {
      this.sliderOne.isEndSlide = false;
    }
  }

  showF() {
    if (this.l == 1) {
      this.l = 0;
    } else {
      this.l = 1;
      this.getGenArray()
    }
  }

  btnAct(gen) {
    this.sliderOne.slidesItems = [];
    let r = 0;
    if (this.pt == gen) {
      this.pt = "";
      this.getlibroarray();
    } else {
      this.pt = gen;
      this.dato.libros.forEach(element => {
        if (element.genero == gen) {
          this.sliderOne.slidesItems.push(element);
          r++;
        }
      });
      if (r == 1) {
        this.sliderOne.isEndSlide = true;
      }
      if (r > 1) {
        this.sliderOne.isEndSlide = false;
      }
    }
    this.sliderOne.isBeginningSlide = true;
  }

  selectChanged(selectedgen) {
    this.selectedGenero = selectedgen;
  };

  revisarCredenciales(e: string) {
    this.checkCredential();
    if (this.noCredentials) {
      this.presentAlertPass(e);
    } else {
      return true;
    }
  }

  addBook() {
    this.libroToAdd.genero = this.selectedGenero;
      if (this.libroToAdd.autor == "" || this.libroToAdd.imagen == "" || this.libroToAdd.genero == "" || this.libroToAdd.libro == "" ||
        this.libroToAdd.paginas == 0 || this.libroToAdd.precio == 0 || this.libroToAdd.sinopsis == "" || this.libroToAdd.stok == 0) {
        this.EAlert();
      } else {
        this.dato.libros.push(this.libroToAdd);
        this.dato.posLibro(this.libroToAdd).subscribe(res => {
          this.selectedGenero = "";
          this.libroToAdd = new Libros();
          this.RAlert();
        })
      }
    console.log("antes");
  }

  editBook() {
    this.libroToAdd.genero = this.selectedGenero;
    if (this.libroToAdd.autor == "" || this.libroToAdd.imagen == "" || this.libroToAdd.genero == "" || this.libroToAdd.libro == "" ||
      this.libroToAdd.paginas == 0 || this.libroToAdd.precio == 0 || this.libroToAdd.sinopsis == "" || this.libroToAdd.stok == 0) {
      this.EAlert();
    } else {
      console.log("si lo hice");
      this.dato.actLibro(this.libroToAdd).subscribe(res => {
        this.selectedGenero = "";
        console.log(res);
        this.editLibro = false;
        this.libroToAdd = new Libros();
        this.RAlert();
      })
    }
    console.log("antes");
  }

  cancelEdit(libro?: Libros) {
    this.libroToAdd = new Libros();
    this.passTime = false;
    this.desktop = false;
    this.noCredentials = true;
    this.selectedGenero = '';
    this.editLibro = false;
  }

  fillLibro(id) {
    let libro;
    this.libros.forEach(e => {
      if (e._id === id) {
        libro = e;
        this.libroToAdd = libro;
        this.selectedGenero = libro.genero;
        this.editLibro = true;
      }
    });
  }

  clearLibro(id) {
    let r = 0;
    this.libros.forEach(e => {
      if (e._id != id) {
        r++;
      }
    });
    this.dato.deleteLibro(id).subscribe(res => {
      console.log(res);
      this.libros.splice(r, 1);
    })
  }

  async desktopAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingreso desde Escritorio',
      subHeader: '',
      message: 'No se han detectado biometricos, para guardar introduzca de nuevo su contraseña ',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Agregado',
      subHeader: '',
      message: 'Se ha añadido este título al carrito de compras',
      buttons: ['OK']
    });

    await alert.present();
  }

  async EAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: '',
      message: 'Alguno de los campos está vacío o es 0, verifique los datos',
      buttons: ['OK']
    });

    await alert.present();
  }

  async RAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Hecho',
      subHeader: '',
      message: 'El libro ha sido añadido a la base de datos correctamente',
      buttons: ['OK']
    });

    await alert.present();
  }

  async LoginAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sesion',
      subHeader: '',
      message: 'Debes Iniciar sesion primero',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertEPass() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: '',
      message: 'Contraseña incorrecta',
      buttons: ['OK'],

    });
    await alert.present();
  }

  async presentAlertPass(e: string) {
    let passConfirm = '';
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Autenticaciónn requerida',
      subHeader: passConfirm,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese nuevamente su contraseña',
          value: passConfirm
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.cancelEdit();
          },
        },
        {
          text: 'Ok',
          handler: (alertData) => {
            if (alertData.password == CryptoJS.AES.decrypt(this.userService.ActUser.password.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8)) {
              if (e=='add') {
                this.addBook();
              }
              if (e=='edit') {
                this.editBook();
              }
            } else {
              console.log(alertData);
              this.presentAlertEPass();
            }
            console.log('Confirm Ok');
          },
        },
      ],
    });

    await alert.present();
  }

}