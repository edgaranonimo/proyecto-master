import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Libros } from '../modelos/libros';
import { tokens } from '../modelos/Token';


@Injectable({
  providedIn: 'root'
})
export class DatosService {
  //public libros:Array<any>;
  selectLibro: Libros;
  libros: Libros[];
  tokenbd: tokens;
  urlPeticionNode = "http://localhost:3000/api/libros/";
  constructor(public httpClient: HttpClient) {
    this.selectLibro = new Libros();
    this.tokenbd = new tokens();
  }
  public ObtenLibros() {
    return this.httpClient.get(this.urlPeticionNode + this.tokenbd.tokenBd)
  }

  posLibro(libro: Libros) {
    return this.httpClient.post(this.urlPeticionNode + this.tokenbd.tokenBd, libro)
  }

  actLibro(libro: Libros) {
    return this.httpClient.put(this.urlPeticionNode + libro._id + this.tokenbd.tokenBd, libro)
  }

  deleteLibro(_id: string) {
    return this.httpClient.delete(this.urlPeticionNode + _id + this.tokenbd.tokenBd);
  }


}
