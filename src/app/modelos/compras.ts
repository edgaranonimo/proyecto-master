export class Compras {
    constructor(_id='',cliente='',articulos=[],monto=0){
        _id=_id
        this.cliente=cliente
        this.articulos=articulos;
        this.monto=monto;
    }
    _id:String;
    cliente:String;
    articulos:Array<any>;
    monto:number;
}
