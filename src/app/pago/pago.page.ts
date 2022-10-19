import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Compras } from '../modelos/compras';
import { ComprasService } from '../servicios/compras.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  constructor(public comprasservice:ComprasService,public userService:UsuarioService,public alertController:AlertController,public router:Router) { }

  ngOnInit() {
  }

  compra(){
    let compra=this.comprasservice.compras;
    console.log(compra);
    this.comprasservice.poscompra(compra).subscribe(res=>{
      this.userService.ActUser.compras=[];
      this.comAlert();
    this.router.navigate(['/']);
    });
  }
  //compra alerta
  async comAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Compra',
      subHeader: '',
      message: 'Se ha relizado la compra satisfactoriamente',
      buttons: ['OK']
    });

    await alert.present();
  }
}
