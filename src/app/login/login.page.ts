import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Users } from '../modelos/users';
import { UsuarioService } from '../servicios/usuario.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  tbUser: string;
  usertbinfo: string;
  tbEmail: string;
  emailtbinfo: string;
  tbDir: string;
  dirtbinfo: string;
  tbPass: string;
  passtbinfo: string;
  tbPass2: string;
  pass2tbinfo: string;
  key: '8jf0¡7wsjf09rfj@odfdjlk-d03ue?dfs'
  crypt: CryptoJS;
  usuario: Users;
  password: string;
  password2: string;
  opt: boolean;
  bandera = false;
  showPassword = false;
  passtogle = 'eye';
  s: number;
  eq = false;
  nameC = false;
  dirC = false;
  emailC = false;
  error = false;
  constructor(public alertController: AlertController,
    public router: Router, public userService: UsuarioService) {
    this.opt = true;
    this.usuario = new Users();
    this.s = 0;
  }

  toggleopt() {
    this.opt = !this.opt;
    console.log(this.opt);
  }

  toglepass(): void {
    this.showPassword = !this.showPassword
  }

  ngOnInit() {
    this.userService.ObtenerUsers();
  }
  //pendiente
  /*iniciarSesion(form: NgForm) {
    this.validar(form);
    if (this.userService.login) {
      this.userService.tipoUser = this.userService.ActUser.role;
      if (this.userService.ActUser.role == 'admin') {
        this.userService.admin = true;
      }
      this.noregAlert();
      this.resetForm(form);
      this.router.navigate(['/tabs/tab1']);
    } else {
      this.noAlert();
    }
  }
  revisar() {
    if (this.password2 == this.userService.selecteduser.password) {
      this.bandera = true;
    } else this.bandera = false;
    this.eq = true;
  }*/

  async singIn() {
    let r;
    let email;
    email = this.repeatedemail();
    console.log(email);
    if (email.lenght>=1) {
      if (this.finalvaliduser() && this.finalvalidemail && this.finalvaliddir && this.finalvalidpass && this.pass2tbinfo=='' && this.tbPass2!='') {
        this.usuario.name = this.tbUser;
        this.usuario.email = this.tbEmail;
        this.usuario.direccion = this.tbDir;
        this.usuario.password = CryptoJS.AES.encrypt(this.tbPass, this.key).toString();
        this.usuario.role='humano';
        this.usuario.compras= [];
        (await this.userService.posEmpleados(this.usuario)).subscribe(res => {
          r=res;
          console.log(res);
        })
      }
    }else{
      this.emailtbinfo='Este correo electrónico ya ha sido registrado';
    }
  }

  Rpass2(key){
    if (key.targe.value!=this.tbPass) {
      this.pass2tbinfo='Las contraseñas no coinciden'
    }else{
      this.pass2tbinfo=''
    }
  }

  Rname(key) {
    this.usertbinfo = '';
  }

  Remail(key) {
    this.emailtbinfo = '';
  }

  Rdir(key) {
    this.dirtbinfo = '';
  }

  Rpass(key) {
    this.passtbinfo = '';
  }

  finalvaliduser() {
    switch (this.validusertb()) {
      case 1:
        return true
        break;
      case 0:
        this.usertbinfo = 'El campo debe contener al menos 5 letras y 2 espacios';
        return false
        break;
      case 2:
        this.usertbinfo = 'El campo contiene simbolos prohibidos ("{}[]=+()|/' + "')";
        return false
        break;

      default:
        return false
        break;
    }
  }

  validusertb() {
    let E1 = 0;
    let E2 = 0;
    for (let i = 0; i < this.tbUser.length; i++) {
      if (this.tbUser.substring(i) == " ") {
        E1++;
      }
      if (this.tbUser.substring(i) != " ") {
        E2++;
      }
      if (this.tbUser.substring(i) == '(' || this.tbUser.substring(i) == ')' || this.tbUser.substring(i) == '"'
        || this.tbUser.substring(i) == "'" || this.tbUser.substring(i) == "=" || this.tbUser.substring(i) == "+"
        || this.tbUser.substring(i) == "{" || this.tbUser.substring(i) == "}" || this.tbUser.substring(i) == "["
        || this.tbUser.substring(i) == "]" || this.tbUser.substring(i) == "/" || this.tbUser.substring(i) == "|") {
        return 2
      }
    }
    if (E1 < 2 && E2 < 5) {
      return 1
    } else {
      return 0
    }
  }

  finalvalidemail() {
    switch (this.validemailtb()) {
      case 1:
        return true
        break;
      case 0:
        this.emailtbinfo = 'El campo no contiene un email válido';
        return false
        break;
      case 2:
        this.emailtbinfo = 'El campo contiene simbolos prohibidos ("{}[]=+()|/" "' + "')";
        return false
        break;

      default:
        return false
        break;
    }
  }

  async repeatedemail(){
    let r;
    let s;
    (await this.userService.obtEmpleadoEmail(this.tbEmail))
      .subscribe(res => {
        return res;
        console.log(res);
      });
    /*async function loademail(){
      try{
        this.userService.obtEmpleadoEmail(this.tbEmail)
      .subscribe(res => {
        r=res as Users;
        console.log(res);
      })
      }
      catch(err){
        console.log(err);
      }
    }
    loademail();*/
    return r;
  }

  validemailtb() {
    let E1 = false;
    let E2 = false;
    for (let i = 0; i < this.tbEmail.length; i++) {
      if (this.tbEmail.substring(i) == "@") {
        E1 = true
      }
      if (this.tbEmail.substring(i) != ".") {
        E2 = true;
      }
      if (this.tbEmail.substring(i) == '(' || this.tbEmail.substring(i) == ')' || this.tbEmail.substring(i) == '"'
        || this.tbEmail.substring(i) == "'" || this.tbEmail.substring(i) == "=" || this.tbEmail.substring(i) == "+"
        || this.tbEmail.substring(i) == "{" || this.tbEmail.substring(i) == "}" || this.tbEmail.substring(i) == "["
        || this.tbEmail.substring(i) == "]" || this.tbEmail.substring(i) == "/" || this.tbEmail.substring(i) == "|"
        || this.tbEmail.substring(i) == " ") {
        return 2
      }
    }
    if (E1 == true && E2 == true) {
      return 1
    } else {
      return 0
    }
  }

  finalvaliddir() {
    switch (this.validdirtb()) {
      case 1:
        return true
        break;
      case 0:
        this.dirtbinfo = 'El campo no contiene una dirección válida';
        return false
        break;
      case 2:
        this.dirtbinfo = 'El campo contiene simbolos prohibidos ("{}[]=+()|/' + "')";
        return false
        break;

      default:
        return false
        break;
    }
  }

  validdirtb() {
    let E1 = 0;
    let E2 = 0;
    let E3 = false;
    for (let i = 0; i < this.tbDir.length; i++) {
      if (this.tbDir.substring(i) == ",") {
        E1++;
      }
      if (this.tbDir.substring(i) != " ") {
        E2++;
      }
      if (this.tbDir.substring(i) == '(' || this.tbDir.substring(i) == ')' || this.tbDir.substring(i) == '"'
        || this.tbDir.substring(i) == "'" || this.tbDir.substring(i) == "=" || this.tbDir.substring(i) == "+"
        || this.tbDir.substring(i) == "{" || this.tbDir.substring(i) == "}" || this.tbDir.substring(i) == "["
        || this.tbDir.substring(i) == "]" || this.tbDir.substring(i) == "|") {
        return 2
      }
      if (this.tbDir.substring(i) == '1' || this.tbDir.substring(i) == '2' || this.tbDir.substring(i) == '3'
        || this.tbDir.substring(i) == "4" || this.tbDir.substring(i) == "5" || this.tbDir.substring(i) == "6"
        || this.tbDir.substring(i) == "7" || this.tbDir.substring(i) == "8" || this.tbDir.substring(i) == "9"
        || this.tbDir.substring(i) == "0") {
        E3 = true;
      }
    }
    if (E1 == 3 && E2 < 5 && E3==true) {
      return 1
    } else {
      return 0
    }
  }

  finalvalidpass() {
    switch (this.validpasstb()) {
      case 1:
        return true
        break;
      case 0:
        this.passtbinfo = 'La contraseña debe tener entre 8 y 20 caracteres';
        return false
        break;
      case 2:
        this.passtbinfo = 'El campo contiene simbolos prohibidos ("{}[]=+()|/"_".,-_' + "')";
        return false
        break;

      default:
        return false
        break;
    }
  }

  validpasstb() {
    for (let i = 0; i < this.tbPass.length; i++) {
      if (this.tbPass.substring(i) == '(' || this.tbPass.substring(i) == ')' || this.tbPass.substring(i) == '"'
        || this.tbPass.substring(i) == "'" || this.tbPass.substring(i) == "=" || this.tbPass.substring(i) == "+"
        || this.tbPass.substring(i) == "{" || this.tbPass.substring(i) == "}" || this.tbPass.substring(i) == "["
        || this.tbPass.substring(i) == "]" || this.tbPass.substring(i) == "/" || this.tbPass.substring(i) == "|"
        || this.tbPass.substring(i) == " " || this.tbPass.substring(i) == "." || this.tbPass.substring(i) == "-"
        || this.tbPass.substring(i) == "_" || this.tbPass.substring(i) == ":" || this.tbPass.substring(i) == ";"
        || this.tbPass.substring(i) == ",") {
        return 2
      }
    }
    if (this.tbPass.length>7 && this.tbPass.length<21) {
      return 1
    } else {
      return 0
    }
  }


  /*Registrarse(form: NgForm) {
    this.eq = true;
    this.regvalidar(form);
    if (this.s == 0 && this.bandera && this.nameC && this.dirC && this.emailC) {
      this.userService.selecteduser.role = "humano";
      this.userService.posEmpleados(this.userService.selecteduser).subscribe(
        res => {
          if (res = !'error') {
            console.log('Entré');
          }
          if (!this.error) {
            this.userService.ActUser.name = this.userService.selecteduser.name.toString();
            this.userService.correo = this.userService.selecteduser.email.toString();
            this.resetForm(form);
            this.userService.login = true;
            this.presentAlert();
            this.router.navigate(['/tabs/tab1']);
            console.log(res);
          } else {
            this.error = false;
            this.inAlert();
          }
        });
    }
    else {
      this.reAlert()
      this.s = 0;
      this.eq = false;
    }
  }*/

  /*regvalidar(form: NgForm) {
    if (this.userService.selecteduser.name != "") {
      for (let index = 0; index < this.userService.selecteduser.name.length; index++) {
        if (this.userService.selecteduser.name.substring(index) != "") {
          this.nameC = true;
        }
      }
    } else { this.nameC = false; }
    if (this.password2 == "") {

    }
    if (this.password2 == this.userService.selecteduser.password) {
      this.bandera = true;
    } else { this.bandera = false; }
    if (this.userService.selecteduser.direccion != "") {
      for (let index = 0; index < this.userService.selecteduser.direccion.length; index++) {
        if (this.userService.selecteduser.direccion.substring(index) != "") {
          this.dirC = true;
        }

      }
    }
    if (this.userService.selecteduser.email != "") {
      this.emailC = true;
      this.userService.empleados.forEach(element => {
        if (this.userService.selecteduser.email == element.email) {
          this.s++;
        }
      });
    } else { this.emailC = false }
  }*/

  /*validar(form: NgForm) {
    this.ObtenerUsers();
    this.userService.empleados.forEach(gf => {
      if (this.userService.selecteduser.email == gf.email) {
        if (this.userService.selecteduser.password == gf.password) {
          this.userService.ActUser = gf;
          this.userService.login = true;
        }
      }
    });
  }*/

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.userService.selecteduser = new Users();
      this.bandera = false;
      this.eq = false;
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Registro',
      message: 'Se a registrado satisfactoriamente',
      buttons: ['OK']
    });

    await alert.present();
  }

  async inAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Error',
      message: 'Hubo un error interno de la aplicación, El servicio no se encuentra disponible',
      buttons: ['OK']
    });

    await alert.present();
  }

  async noregAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Login',
      message: 'Login correcto bienvenido ' + this.userService.ActUser.name,
      buttons: ['OK']
    });

    await alert.present();
  }
  async reAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Registro',
      message: 'El correo ya ha sido registrado verifique los datos',
      buttons: ['OK']
    });
    await alert.present();
  }

  async noAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Login',
      message: 'Login incorrecto verifique las credenciales',
      buttons: ['OK']
    });
    await alert.present();
  }
  //pass show
}