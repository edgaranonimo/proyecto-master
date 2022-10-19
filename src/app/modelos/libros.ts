export class Libros {
    constructor(_id='',libro='',autor='',paginas=0,sinopsis='',precio=0,genero='',stok=0,imagen=''){
        this._id=_id
        this.libro=libro;
        this.autor=autor;
        this.paginas=paginas;
        this.sinopsis=sinopsis;
        this.genero=genero;
        this.stok=stok;
        this.precio=precio;
        this.imagen=imagen;
    }
    _id:string;
    libro:string;
    autor:string;
    paginas:number;
    sinopsis:string;
    genero:string;
    stok:number;
    precio:number;
    imagen:string;
}