import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Compras } from '../modelos/compras';
import { tokens } from '../modelos/Token';
@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  compras:Compras;
  historial:Compras[];
  tokenbd: tokens;
  urlPeticionNode="http://localhost:3000/api/compras/";
  constructor(public httpClient:HttpClient) { 
    this.compras=new Compras;
    this.tokenbd = new tokens();
  }

  public Obtenercompras(){
    return this.httpClient.get(this.urlPeticionNode+ this.tokenbd.tokenBd)
}

poscompra(compra:Compras){
    return this.httpClient.post(this.urlPeticionNode,compra+ this.tokenbd.tokenBd)
  }
  
}
