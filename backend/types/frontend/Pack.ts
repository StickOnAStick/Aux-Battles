
import { Record } from 'pocketbase';

export interface Packs extends Record{
    name: string,
    desc: string,
    price: number,
    rating?: number,
    reviews?: string[], //Add relation type
    packData: PackData,
    image: string,
    creator: string
}

export interface PackData {
    prompts: string[]
}
