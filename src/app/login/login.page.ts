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
  key: string;
  crypt: CryptoJS;
  usuario: Users;
  password: string;
  password2: string;
  opt: boolean;
  uemail: Users;
  checkmail: any;
  repeatemail = true;
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
    this.uemail = new Users();
    this.s = 0;
    this.key = '8jf0¡7wsjf09rfj@odfdjlk-d03ue?dfs';
  }

  toggleopt() {
    this.opt = !this.opt;
    this.Remail("s");
  }

  toglepass(): void {
    this.showPassword = !this.showPassword
  }

  ngOnInit() {
    this.userService.ObtenerUsers();
  }

  login(form: NgForm) {
    if (this.uemail.email!='none' && this.tbEmail != '') {
      if (this.tbEmail==this.uemail[0].email) {
        if (this.tbPass == CryptoJS.AES.decrypt(this.uemail[0].password.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8)) {
        this.userService.ActUser = this.uemail[0];
        if(this.userService.ActUser.role == "admin"){
          this.userService.admin=true;
        }
        this.userService.login = true;
        this.resetForm(form);
        this.noregAlert();
        this.router.navigate(['/tabs/tab1']);
        }else{
          this.passtbinfo = "Contraseña incorrecta";
        }
      }
    }else{
      this.emailtbinfo = "No existe el correo electrónico"
    }
  }

  revisar() {
    if (this.password2 == this.userService.selecteduser.password) {
      this.bandera = true;
    } else this.bandera = false;
    this.eq = true;
  }

  registro(form: NgForm) {
    let r;
    if (this.uemail.email == "none") {
      this.repeatemail = false;
    }else{
      this.repeatemail = true
    }
    if (!this.repeatemail) {
      if (this.finalvaliduser() && this.finalvalidemail() && this.finalvaliddir() && this.finalvalidpass() && this.pass2tbinfo == '' && this.tbPass2 != '') {
        this.usuario.name = this.tbUser;
        this.usuario.email = this.tbEmail;
        this.usuario.direccion = this.tbDir;
        this.usuario.password = CryptoJS.AES.encrypt(this.tbPass.trim(), this.key.trim()).toString(); 
        this.usuario.role = 'humano';
        this.usuario.compras = [];
        this.userService.posEmpleados(this.usuario).subscribe(res => {
          r = res;
          this.userService.login = true;
          this.userService.ActUser = this.usuario;
          this.resetForm(form);
          this.presentAlert();
          this.router.navigate(['/tabs/tab1']);
        })
      }
    } else {
      this.emailtbinfo = 'Este correo electrónico ya ha sido registrado';
    }
  }

  Rpass2(key) {
    if (this.tbPass2 != this.tbPass) {
      this.pass2tbinfo = 'Las contraseñas no coinciden'
    } else {
      this.pass2tbinfo = ''
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
      if (this.tbUser.substring(i,i+1)==" ") {
        E1++;
      }
      if (this.tbUser.substring(i,i+1) == '(' || this.tbUser.substring(i,i+1) == ')' || this.tbUser.substring(i,i+1) == '"'
        || this.tbUser.substring(i,i+1) == "'" || this.tbUser.substring(i,i+1) == "=" || this.tbUser.substring(i,i+1) == "+"
        || this.tbUser.substring(i,i+1) == "{" || this.tbUser.substring(i,i+1) == "}" || this.tbUser.substring(i,i+1) == "["
        || this.tbUser.substring(i,i+1) == "]" || this.tbUser.substring(i,i+1) == "/" || this.tbUser.substring(i,i+1) == "|") {
        return 2
      }
    }
    if (E1 > 1 && this.tbUser.length > E1) {
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

  repeatedemail() {
    var str: string | undefined;
    this.userService.obtEmpleadoEmail(this.tbEmail)
      .subscribe(res => {
        this.uemail = res as Users;
        this.checkmail = res;
        if (this.uemail.email == "none") {
          this.repeatemail = false;
        }else{
          this.repeatemail = true
        }
      });
      console.log(this.repeatemail);
  }

  validemailtb() {
    let E1 = false;
    let E2 = false;
    for (let i = 0; i < this.tbEmail.length; i++) {
      if (this.tbEmail.substring(i,i+1) == "@") {
        E1 = true
      }
      if (this.tbEmail.substring(i,i+1) == ".") {
        E2 = true;
      }
      if (this.tbEmail.substring(i,i+1) == '(' || this.tbEmail.substring(i,i+1) == ')' || this.tbEmail.substring(i,i+1) == '"'
        || this.tbEmail.substring(i,i+1) == "'" || this.tbEmail.substring(i,i+1) == "=" || this.tbEmail.substring(i,i+1) == "+"
        || this.tbEmail.substring(i,i+1) == "{" || this.tbEmail.substring(i,i+1) == "}" || this.tbEmail.substring(i,i+1) == "["
        || this.tbEmail.substring(i,i+1) == "]" || this.tbEmail.substring(i,i+1) == "/" || this.tbEmail.substring(i,i+1) == "|"
        || this.tbEmail.substring(i,i+1)== " ") {
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
      if (this.tbDir.substring(i,i+1) == ",") {
        E1++;
      }
      if (this.tbDir.substring(i,i+1) != " ") {
        E2++;
      }
      if (this.tbDir.substring(i,i+1) == '(' || this.tbDir.substring(i,i+1) == ')' || this.tbDir.substring(i,i+1) == '"'
        || this.tbDir.substring(i,i+1) == "'" || this.tbDir.substring(i,i+1) == "=" || this.tbDir.substring(i,i+1) == "+"
        || this.tbDir.substring(i,i+1) == "{" || this.tbDir.substring(i,i+1) == "}" || this.tbDir.substring(i,i+1) == "["
        || this.tbDir.substring(i,i+1) == "]" || this.tbDir.substring(i,i+1) == "|") {
        return 2
      }
      if (this.tbDir.substring(i,i+1) == '1' || this.tbDir.substring(i,i+1) == '2' || this.tbDir.substring(i,i+1) == '3'
        || this.tbDir.substring(i,i+1) == "4" || this.tbDir.substring(i,i+1) == "5" || this.tbDir.substring(i,i+1) == "6"
        || this.tbDir.substring(i,i+1) == "7" || this.tbDir.substring(i,i+1) == "8" || this.tbDir.substring(i,i+1) == "9"
        || this.tbDir.substring(i,i+1) == "0") {
        E3 = true;
      }
    }
    if (E1 == 3 && E2 > 5 && E3 == true) {
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
      if (this.tbPass.substring(i,i+1) == '(' || this.tbPass.substring(i,i+1) == ')' || this.tbPass.substring(i,i+1) == '"'
        || this.tbPass.substring(i,i+1) == "'" || this.tbPass.substring(i,i+1) == "=" || this.tbPass.substring(i,i+1) == "+"
        || this.tbPass.substring(i,i+1) == "{" || this.tbPass.substring(i,i+1) == "}" || this.tbPass.substring(i,i+1) == "["
        || this.tbPass.substring(i,i+1) == "]" || this.tbPass.substring(i,i+1) == "/" || this.tbPass.substring(i,i+1) == "|"
        || this.tbPass.substring(i,i+1) == " " || this.tbPass.substring(i,i+1) == "." || this.tbPass.substring(i,i+1) == "-"
        || this.tbPass.substring(i,i+1) == "_" || this.tbPass.substring(i,i+1) == ":" || this.tbPass.substring(i,i+1) == ";"
        || this.tbPass.substring(i,i+1) == ",") {
        return 2
      }
    }
    if (this.tbPass.length > 7 && this.tbPass.length < 21) {
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