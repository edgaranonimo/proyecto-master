import { Libros } from "./libros";

export class Users {
    constructor(_id='',name='',role='',password='',email='',direccion='',compras=[]){
        _id="";
        name="";
        role="";
        password="";
        email="";
        direccion="";
        compras=[];
    }
    _id:string;
    name:string;
    role:  String;
    password: String;
    email:String;
    direccion:string;
    compras:Libros[];
}
