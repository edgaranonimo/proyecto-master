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

  async obtenerEmpleados() {
    try{
      return this.httpClient.get(this.urlPeticionNode + this.tokenbd.tokenBd)
    }
    catch(err){
      console.log(err);
    }
  }

  async posEmpleados(user: Users) {
    try{
      return this.httpClient.post(this.urlPeticionNode + this.tokenbd.tokenBd, user)
    }
    catch(err){
      console.log(err);
    }
  }

  async actEmpleado(user: Users) {
    try{
      return this.httpClient.put(this.urlPeticionNode + user._id, user + this.tokenbd.tokenBd)
    }
    catch(err){
      console.log(err);
    }
  }

  async deleteEmpleado(_id: string) {
    try{
      this.frr = _id;
    return this.httpClient.delete(this.urlPeticionNode + _id + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }
  
  async obtEmpleadoid(_id: string){
    try{
      return this.httpClient.get(this.urlPeticionNode + _id + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }

  async obtEmpleadoEmail(email: string){
    try{
      return this.httpClient.get(this.urlPeticionNode + email + this.tokenbd.tokenBd);
    }
    catch(err){
      console.log(err);
    }
  }

  async ObtenerUsers(){
    (await this.obtenerEmpleados())
      .subscribe(res => {
        this.empleados = res as Users[];
        console.log(res);
      })
  }
}