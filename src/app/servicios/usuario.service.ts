import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Users } from '../modelos/users';
import { tokens } from '../modelos/Token';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  userName: string;
  ActUser: Users;
  correo: string;
  tipoUser: String;
  selecteduser: Users;
  empleados: Users[];
  loguser: Users;
  admin: boolean;
  login: boolean;
  frr: string;
  tokenbd: tokens;
  urlPeticionNode = "http://localhost:3000/api/users/";
  constructor(private httpClient: HttpClient) {
    this.admin = false;
    this.userName = '';
    this.tipoUser = '';
    this.login = false;
    this.correo = '';
    this.selecteduser = new Users();
    this.ActUser = new Users();
    this.frr = '';
    this.tokenbd = new tokens();
  }

  obtenerEmpleados() {
    try{
      return this.httpClient.get(this.urlPeticionNode + this.tokenbd.tokenBd)
    }
    catch(err){
      console.log(err);
    }
  }

  posEmpleados(user: Users) {
    try{
      return this.httpClient.post(this.urlPeticionNode + this.tokenbd.tokenBd, user)
    }
    catch(err){
      console.log(err);
    }
  }

  actEmpleado(user: Users) {
    try{
      return this.httpClient.put(this.urlPeticionNode + user._id + "&" + this.tokenbd.tokenBd, user)
    }
    catch(err){
      console.log(err);
    }
  }

  deleteEmpleado(_id: string) {
    try{
      this.frr = _id;
    return this.httpClient.delete(this.urlPeticionNode + _id + "&" + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }
  
  obtEmpleadoid(_id: string){
    try{
      return this.httpClient.get(this.urlPeticionNode + _id + "&" + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }

  obtEmpleadoEmail(email: string){
    try{
      return this.httpClient.get(this.urlPeticionNode + email + "&" + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }

  ObtenerUsers(){
    this.obtenerEmpleados()
      .subscribe(res => {
        this.empleados = res as Users[];
        console.log(res);
      })
  }
}