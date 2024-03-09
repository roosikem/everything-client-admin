export class Lookup {
    id:string;
    value:string;
}

export interface LookupModel {
    data: any;
}

export interface LookupDto {
    data: Lookup[];
}
