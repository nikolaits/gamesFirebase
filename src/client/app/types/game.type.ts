export class Game{
    constructor(
        public name:string,
        public userRate:number,
        public avrgRate:number,
        public isCollapsed:boolean,
        public windowWidth:number,
        public windowHeight:number,
        public savedData:any,
        public imageUri? :string,
        public active?:boolean,
        public mobileCompatible?:boolean
    ){
        if(this.active === undefined)
            this.active = false;
        if(this.mobileCompatible === undefined)
            this.mobileCompatible = false;
    }
}