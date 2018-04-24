export class UserAdmin {
    constructor(
      public uid:string,
      public profile_picture: string,
      public username: string,
      public isAdmin: boolean
    ) { }
  }