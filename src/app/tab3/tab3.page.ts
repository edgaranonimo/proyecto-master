import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { Users } from '../modelos/users';
import { AlertController } from '@ionic/angular';
import { CompilerFacadeImpl } from '@angular/compiler/src/jit_compiler_facade';
import { compileDeclareComponentFromMetadata } from '@angular/compiler';
import { Compras } from '../modelos/compras';
import { ComprasService } from '../servicios/compras.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  articulos:Array<any>
  s:number;
  total:number;
  constructor(public router: Router,public alertController:AlertController, public userService:UsuarioService,public comprasservice:ComprasService) {
    this.s=0;
    this.total=0;
    this.articulos=[];
  }
  openModal() {
    if (this.s == 1) {
      this.s = 0;
    } else { this.s = 1; }
  }

  pagarTotal(){
    this.total=0;
    this.articulos=[];
    this.userService.ActUser.compras.forEach(element => {
      this.articulos.push(element.libro);
      this.total+=element.precio;
    });
    console.log(this.articulos);
  }
  ngOnInit(){
    this.inicReg();
    this.rOpenModal();
    this.obtencompras();
    if(this.userService.ActUser){
    this.pagarTotal();}

  }
  async delete(indice:number){
    this.userService.ActUser.compras.splice(indice,1);
    (await this.userService.actEmpleado(this.userService.ActUser)).subscribe(res=>{
      this.preAlert();
    });
    this.pagarTotal();
  }

  compra(){
    let compra= new Compras;
    this.comprasservice.compras.articulos=this.articulos;
    this.comprasservice.compras.cliente=this.userService.ActUser.email;
    this.comprasservice.compras.monto=this.total;
    this.total=0;
      this.router.navigate(['pago']);
    
    /*this.comprasservice.poscompra(compra).subscribe(res=>{
      this.userService.ActUser.compras=[];
    });*/
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
  }

  obtencompras(){
    this.comprasservice.Obtenercompras()
    .subscribe(res=>{
      this.comprasservice.historial=res as Compras[];
      console.log(res);
    });
  }

  rOpenModal() {
    this.s = 0;
  }

  redict() {
    this.router.navigate(['/tabs/tab4']);
  }
  redict3(){
    if(this.userService.login){
      this.userService.login=false;
      this.userService.ActUser=new Users();
    }
  }
  async preAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminado',
      subHeader: '',
      message: 'Se ha eliminado este título al carrito de compras',
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentConfirm() {
    this.pagarTotal();
    let alert = await this.alertController.create({
      header: 'Confirmar compra',
      message: 'Esta seguro de realizar la compra? el monto a pagar es: '+this.total,
      buttons: [
        {
          text: 'Seguir comprando',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Comprar',
          handler: () => {
            this.compra();
          }
        }
      ]
    });
    await alert.present();
  }
  
}

