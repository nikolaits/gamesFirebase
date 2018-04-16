export class UserUpdate {
    constructor(
      public username:string,
      public email: string,
      public password: string,
      public repassword: string
    ) { }
}