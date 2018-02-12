export interface Movimiento {
    id?: number;
    importe: number;
    fecha: Date|string;
    descripcion: string;
    notas: string;
}