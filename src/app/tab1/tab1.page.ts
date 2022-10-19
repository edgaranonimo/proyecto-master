import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Libros } from '../modelos/libros';
import { UsuarioService } from '../servicios/usuario.service';
import { DatosService } from '../servicios/datos.service';
import { Users } from '../modelos/users';
//import { threadId } from 'node:worker_threads';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})



export class Tab1Page implements OnInit{
//edgar 
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  libros: Libros[];
  userCar = new Users();
  s: number;
  l: number;
  ms: number;
  pt: string;
  gn: number;
  gn2: number;

  public us:boolean;

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

  constructor(public router: Router, public userService:UsuarioService,public dato:DatosService, public alertController:AlertController) {
    this.us=true;
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

    this.s = 0;
    this.l = 0;
    this.pt = "";
    this.ms=0;
  }

  //logout

  redict3(){
    if(this.userService.login){
      this.userService.login=false;
      this.userService.ActUser=new Users();
    }
  }

  ObtenerLibros(){
    this.dato.ObtenLibros()
    .subscribe(res=>{
      this.dato.libros=res as Libros[];
      this.libros=res as Libros[];
      this.sliderOne.slidesItems=res as Libros[];
      console.log(res);
    })
    return 18;
  }

  inicReg(){
    if(this.userService.correo!=''){
      this.userService.ObtenerUsers();
      this.userService.empleados.forEach(element => {
        if (this.userService.correo==element.email){
          this.userService.ActUser=element;
          this.userService.login=true;
          this.userService.correo='';
        }
      });
    }
    return 0;
  }

  ngOnInit() {
    this.rOpenModal();
  }

  async btnCom(lib){
    let libCar = new Libros();
    this.libros.forEach(element => {
      if(element._id==lib){
        libCar=element;
      }
    });
    if(this.userService.login){
      this.userService.ActUser.compras.push(libCar);
      (await this.userService.actEmpleado(this.userService.ActUser)).subscribe(res=>{
        this.presentAlert();
      });
    }else{
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
  btnShow(){
    if (this.ms==1){
      this.ms=0;
    }else{
      this.ms=1;
    }
  }
  getGenArray(){
    let s="";
    let j=false;
    this.dato.libros.forEach(element => {
      s=element.genero;
      this.sliderTwo.slidesItems.forEach(element => {
        if(element.genero==s){
          j=true;
        }
      });
      if(j==false){
        this.sliderTwo.slidesItems.push(element);
      }
      j=false;
    });
  }

  getlibroarray(){
    let r=0;
    this.dato.libros.forEach(element => {
      this.sliderOne.slidesItems.push(element);
      r++;
    });
    if(r==1){
      this.sliderOne.isEndSlide=true;
    }
    if(r>1){
      this.sliderOne.isEndSlide=false;
    }
  }
  
  showF(){
    if(this.l==1){
      this.l=0;
    }else{
      this.l=1;
      this.getGenArray()
    }
  }
  
  btnAct(gen) {
    this.sliderOne.slidesItems=[];
    let r=0;
    if(this.pt==gen){
      this.pt="";
      this.getlibroarray();
    }else{
      this.pt=gen;
      this.dato.libros.forEach(element => {
        if (element.genero==gen){
          this.sliderOne.slidesItems.push(element);
          r++;
        }
    });
    if(r==1){
      this.sliderOne.isEndSlide=true;
    }
    if(r>1){
      this.sliderOne.isEndSlide=false;
    }
    }
    this.sliderOne.isBeginningSlide=true;
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

}