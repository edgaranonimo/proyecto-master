import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Libros } from '../modelos/libros';
import { DatosService } from '../servicios/datos.service';
import { UsuarioService } from '../servicios/usuario.service';
import { Users } from '../modelos/users';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  opt=false;
  s:number;
  libros: any;
  usuario:Users;
  busqueda:Array <any>;
  buscar:string;
  tempg:string;
  templ:string;
  temps:string;
  tempa:string;
  showPassword=false;
  passtogle='eye';
  
  constructor(public alertController: AlertController, 
    public router:Router, public userService:UsuarioService,public dato:DatosService) {
    this.buscar="";
    this.busqueda=[];
    this.libros= this.dato.ObtenLibros();
    this.s=0;
    this.usuario=new Users();
   }

   //comienza libro busqueda y adicion
   

busca(){
  this.busqueda=[];
  for(let item of this.libros){
   this.tempg=item.genero.toLowerCase();
   this.tempa=item.autor.toLowerCase();
   this.templ=item.libro.toLowerCase();
   this.temps=item.sinopsis.toLowerCase();
    if(this.tempg.search(this.buscar)!=-1 || this.tempa.search(this.buscar)!=-1 || this.templ.search(this.buscar)!=-1 || this.temps.search(this.buscar)!=-1){
      this.busqueda.push(item);
    }
    /*if(item.genero==this.buscar){
      this.busqueda.push(item);
    }*/
  }
}
redirect3(){
  if(this.userService.login){
    this.userService.login=false;
    this.userService.ActUser=new Users();
  }
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

inicReg(){
  this.userService.ObtenerUsers();
  let r=0;
  if(this.userService.correo!=''){
    this.userService.empleados.forEach(element => {
      if (this.userService.correo==element.email){
        this.userService.ActUser=element;
        this.userService.login=true;
        this.userService.correo='';
      }
      r++;
    });
  }
  return r;
}

   addlibro(form:NgForm){
     this.dato.posLibro(form.value)
     .subscribe(res=>{
      this.ObtenerLibros();
       this.resetForm(form)
       this.presentAlert();
     });
   }
   resetForm(form?:NgForm){
     if(form){
       form.reset();
       this.dato.selectLibro=new Libros();
     }
   }
   //termina libro
   //obtener libro
   ObtenerLibros(){
     this.dato.ObtenLibros()
     .subscribe(res=>{
       this.dato.libros=res as Libros[];
       this.libros=res as Libros[];
       console.log(res);
     })
   }
   
   //termina obtener libro
  toggleopt(){
    this.opt=!this.opt;
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

  toggleinfo(){
    this.opt=!this.opt;
  }

   toglepass():void{
     this.showPassword=!this.showPassword
   }
  ngOnInit() {
    this.ObtenerLibros();
    this.inicReg();
    this.rOpenModal();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Libro',
      subHeader: 'Guardado',
      message: 'El libro se guardo satisfactoriamente',
      buttons: ['OK']
    });

    await alert.present();
  }

}