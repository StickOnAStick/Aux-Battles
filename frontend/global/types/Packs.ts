import { Record } from 'pocketbase';

export interface Packs extends Record{
    name: string,
    desc: string,
    price: number,
    rating?: number,
    reviews?: string[], //Add relation type
    packData: JSON,
    image: string,
}