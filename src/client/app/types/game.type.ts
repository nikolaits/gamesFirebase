export class Game{
    constructor(
        public name:string,
        public userRate:number,
        public avrgRate:number,
        public isCollapsed:boolean,
        public windowWidth:number,
        public windowHeight:number,
        public savedData:any,
        public active?:boolean
    ){
        if(this.active === undefined)
            this.active = false;
    }
}