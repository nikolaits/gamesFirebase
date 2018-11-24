import { Component, OnInit, Input, ViewChild, isDevMode, enableProdMode } from '@angular/core';
import { NameListService } from '../../shared/name-list/name-list.service';
import { AuthService } from '../../shared/auth-service/auth.service';
import { UserService } from '../../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../../types/user_init_info.type';
import * as firebase from "firebase";
import { GamesService } from '../../shared/games-service/games.service';
import { Game } from "../../types/game.type"
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewGame } from '../../types/new_game.type';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import {prod, gametmpname} from "../../core/globals";
declare var newnametmp:any;
@Component({
  moduleId: module.id,
  selector: 'create-game',
  styles: [".modal-header{background-color: 000;}   "],
  templateUrl: './game-info.component.html',
})
export class NgbdModalCreateGame {
  @Input() notification: string;
  @Input() game: Game;
  @Input() updateMode: true;
  model: NewGame
  createGameForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private gamesService: GamesService) { 

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 700;
    this.cropperSettings.height = 350;
    this.cropperSettings.keepAspect = false;

    this.cropperSettings.croppedWidth = 700;
    this.cropperSettings.croppedHeight = 350;

    this.cropperSettings.canvasWidth = 800;
    this.cropperSettings.canvasHeight = 450;

    this.cropperSettings.minWidth = 600;
    this.cropperSettings.minHeight = 250;

    this.cropperSettings.rounded = false;
    this.cropperSettings.minWithRelativeToResolution = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }
  public error = false;
  public isEmpty = false;
  public btnDisabled = true
  public buttonName: string = "Save";
  public imageUpdated:boolean = false;
  isReadyForSubmit: boolean = true;
  data: any;
  file: File;
  progress:number;
  isProgressVisible:boolean = false;
  cropperSettings: CropperSettings;
  cropperShown: boolean = true;
  showTheCropper:boolean = true;
  stlDisplay: string = "none";

  public taken = false;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  oldPicture: any;
  ngOnInit() {
    // this.data.image="";
    this.model = new NewGame("", 0, 0);
    if (this.updateMode) {
      this.buttonName = "Update"
      this.model.name = this.game.name;
      this.model.windowWidth = this.game.windowWidth;
      this.model.windowHeight = this.game.windowHeight;
      console.log("width")
      console.log(this.game.windowHeight);
      this.model = new NewGame(this.game.name, this.game.windowWidth, this.game.windowHeight);
      this.data.image = this.oldPicture = this.game.imageUri;
    }


    this.createGameForm = new FormGroup({
      'name': new FormControl({ value: this.model.name, disabled: this.updateMode }, [
        Validators.nullValidator,
        Validators.required
      ]),
      'windowWidth': new FormControl({ value: this.model.windowWidth, disabled:false }, [
        Validators.nullValidator,
        Validators.required,
        Validators.pattern("^[1-9][0-9]*$")
      ]),
      'windowHeight': new FormControl({ value: this.model.windowHeight, disabled:false }, [
        Validators.nullValidator,
        Validators.required,
        Validators.pattern("^[1-9][0-9]*$")
      ])
    }, );
  }
  ngAfterViewInit(){
    // setTimeout(() => {
    //   this.cropperShown = false;
    // }, 500);
  }
  get name() { return this.createGameForm.get('name'); }
  get windowWidth() { return this.createGameForm.get('windowWidth'); }
  get windowHeight() { return this.createGameForm.get('windowHeight'); }

  public onSubmit() {
    let name = this.name.value;
    let windowWidth = this.windowWidth.value;
    let windowHeight = this.windowHeight.value;
    if (!this.updateMode) {
      this.gamesService.isGameNameTaken(name)
        .then((r) => {
          if (r === "free") {
            // this.saveUserData(result);
            this.gamesService.createNewGame(name, windowWidth, windowHeight)
              .then((r) => {
                console.log("firebaseresult")
                console.log(r)
                this.activeModal.close(new Game(name, 0, 0, true, windowWidth, windowHeight, undefined, "https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/games%2Fimages%2Fnew_game.jpeg?alt=media&token=ad100168-8ed9-4de9-8325-0ad276511a07", false, false));
              })
              .catch((err) => {
                console.log("Error create game");
                console.log(err);
              })
          }
        })
        .catch((e) => {
          if (e === "taken") {
            this.error = true;
            this.taken = true;
          } else {
            console.log(e);
          }

        });
    }
    else {
      this.gamesService.updateGameInfo(name, windowWidth, windowHeight)
        .then((r) => {
          console.log("game info updated");
          this.activeModal.close({isImageUpdated: this.imageUpdated, newUri:this.oldPicture, gamename:this.game.name});
        })
        .catch((err) => {
          console.log("Error create game");
          console.log(err);
        })
    }

  }
  fileChangeListener($event: any) {
    this.file = $event.target.files[0];

    let fileTypes = ['jpg', 'jpeg'];
    let extension = this.file.name.split('.').pop().toLowerCase();
    if (fileTypes.indexOf(extension) == -1) {
      alert("Only JPEG images are supported");
      this.closeCropper();
      return;
    }
    let that = this;
    that.data = {}
    // that.cropperShown = true;
    this.stlDisplay = "block";
    that.isReadyForSubmit = false;
    // that.data = {}
    let myReader: FileReader = new FileReader();
    // console.log("file reader created");
    
    myReader.onerror = (e) => {
      console.log("myReader Error");

      console.log(e);
      console.log("Error");
      console.log(myReader.error);
    }
    myReader.onloadend = (loadEvent: any) => {
      let image = new Image();

      image.onload = () => {
        if (!prod) {
          console.log("in dev mode");

          that.cropper.setImage(image);
        }
        else {
          console.log("in production mode")
          this.showTheCropper = false;
          this.ResizeImage($event)
        }

      }
      image.src = myReader.result.toString();
    };
    try {
      myReader.readAsDataURL(this.file);

    } catch (error) {
    }

  }
  public ResizeImage(event:any) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // var filesToUploads = document.getElementById('imageFile').files;
        var file = event.target.files[0];
        if (file) {

            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = (e:any)=> {

                var img = document.createElement("img");
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 400;
                var MAX_HEIGHT = 400;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                let dataurl = canvas.toDataURL(file.type);
                this.data = {image:dataurl};
            }
            reader.readAsDataURL(file);

        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
  closeCropper() {
    // this.cropperShown = false;
    this.stlDisplay="none"
    this.data.image = this.oldPicture;
    this.isReadyForSubmit = true;
  }

  saveImage() {
    console.log(firebase);
    try {
      let storageRef = firebase.storage().ref('games/images' + this.game.name + '.jpeg');
      console.log("storage ref");
      console.log(storageRef);
      // let imageRef = storageRef.child('users/profile_pic_uid'+this.userService.user.uid+'.jpg');
      console.log("imageRef");
      // console.log(imageRef);
      // storageRef.getDownloadURL().then(function(url) {
      //   console.log("image url");
      //   console.log(url);
      // }); 
      let base64string = this.data.image.substring(23);
      var metadata = {
        contentType: 'image/jpeg',
      };
      var task = storageRef.putString(base64string, 'base64', metadata);

      // .then((snapshot) => {
      //   console.log('Uploaded a base64 string!');
      // })
      // .catch((err)=>{
      //   console.log('Upload error:', err);
      // });
      this.isProgressVisible = true;
      this.progress = 0;
      (<any>task).on('state_changed', (snapshot: any) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(snapshot.bytesTransferred);
        console.log(snapshot.totalBytes)

      }, (error: any) => {
        console.log("Error");
        console.log(error);
      }, () => {
        console.log("uploaded");
        // this.cropperShown = false;
        this.stlDisplay= "none";
        this.oldPicture = task.snapshot.downloadURL;
        this.isReadyForSubmit = true;
        this.gamesService.updateGameImage(task.snapshot.downloadURL, this.game.name)
          .then(() => {
            console.log("username updated");
            this.imageUpdated= true;

            this.oldPicture = task.snapshot.downloadURL;
            // this.change.emit({message:"profilePictureUpdated", result:task.snapshot.downloadURL});
            setTimeout(() => {
              this.isProgressVisible = false;
            }, 100);
            setTimeout(() => {
              alert("The profile picture was updated");
            }, 1000);
            
            
          })
          .catch((err) => {
            console.log("Error");
            console.log(err);
          })
        console.log(task.snapshot.downloadURL);
      })
      console.log("test project")
    } catch (error) {
      console.log("Error");
      console.log(error)
    }

    // console.log(this.data.image);
  }
  close() {
    
    if(this.updateMode){
      this.activeModal.close({isImageUpdated: this.imageUpdated, newUri:this.oldPicture, gamename:this.game.name});
    }
    else{
      this.activeModal.close();
    }
  }

}
declare let window: any;
declare let jQuery: any;
// declare let game: any;
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'game-admin',
  templateUrl: 'games-admin.component.html',
  styleUrls: ['games-admin.component.css'],
})
export class GamesAdminComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  currentRate = 2;
  containerWidth = 0;
  containerHeight = 0;
  games: Game[] = [];
  private tmpgmname = "";
  private gameRatingListener: any;
  public newGame = "";
  private deletedGameName = "";
  private listenerLiveScore: any;
  private settimeoutlistener: any;
  private selectedGameName: string = ""
  public changeDisplayedData: boolean = false;
  private selectedGame:Game;
  public isUnlockedSeason:boolean = true;
  @ViewChild('wrapper') wrapper: any;
  firstLoad = true;
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private navigationService: NavigationService) {

  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    console.log("main component ngOnInit2");
  }
  ngAfterViewInit() {
    
    //   jQuery("#test").kendoGrid({
    //     dataSource: {
    //         data: [
    //             {name: "Name1", score: 2},
    //             {name: "Name2", score: 22},
    //             {name: "Name3", score: 12}
    //         ],
    //         sort: {
    //             field: "score",
    //             dir: "desc"
    //         },
    //         pageSize: 20
    //     },        
    //     scrollable: false
    // });
    this.authService.isUserSignIn()
      .then((r: firebase.User) => {
        console.log("user exist");
        this.userService.user = r;
        this.userService.isUserAdmin()
          .then((r) => {
            if (!r) {
              this.navigationService.goToMainPage();
            }
            else {
              this.getAllGames();
              this.onNewGameAdded();
              this.onGameRemoved();
            }
          })
          .catch((err) => {
            console.log("Error");
            console.log(err);
            this.navigationService.goToMainPage();
          })
      })
      .catch((e) => {
        console.log("no user found");
        console.log(e);
      });

    // this.detectGamesContentChange();
  }
  // getButtonTitle(args:boolean){
  //   if(args){
  //     return 
  //   }
  //   return args == true ?  : 'Activate'
  // }
  getAllGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getAllGames()
      .then((result) => {
        console.log("activeGames");
        console.log(result);
        // result[0].isCollapsed=false;
        this.games = result;
      })
      .catch((err) => {
        console.log("Error(activeGames)");
        console.log(err)
      })
  }
  createNewGame() {
    console.log("firs tap");
    console.log(this.modalService);
    let options: NgbModalOptions = {
      beforeDismiss: () => { return true },
      windowClass: "in"
    }

    const modalRef = this.modalService.open(NgbdModalCreateGame, options);
    modalRef.componentInstance.notification = 'Enter game info';
    modalRef.componentInstance.updateMode = false;
    modalRef.componentInstance.game = null;
    modalRef.result.then((arg: any) => {
      console.log(arg);
      if (arg) {
        console.log("this.newGame");
        
        // this.newGame = arg;
        // newnametmp = arg;
        // console.log(this.newGame)
        this.games.push(arg);

      }
    })
  }
  updateGameInfo(name: string) {
    this.games.forEach((element) => {
      this.selectedGame = element;
      if (element.name === name) {
        this.selectedGame = element;
        let options: NgbModalOptions = {
          beforeDismiss: () => { return true },
          windowClass: "in",
          size:"lg"
        }

        const modalRef = this.modalService.open(NgbdModalCreateGame, options);
        modalRef.componentInstance.notification = 'Update game info';
        modalRef.componentInstance.updateMode = true;
        modalRef.componentInstance.game = element;
        modalRef.result.then((arg: any) => {
          console.log(arg);
          //this.activeModal.close({isImageUpdated: this.imageUpdated, newUri:this.oldPicture, gamename:this.game.name});
          if((arg.isImageUpdated)&&(arg.isImageUpdated === true)){
            element.imageUri = arg.newUri;
          }

        })
      }

    })

  }
  onVisibilityChange(gamename: string) {

    if (this.gameRatingListener) {
      this.removeGameRatingListener();
    }

    this.selectedGameName = gamename;
    let selectedGame = null;
    this.games.forEach((element) => {
      if (gamename === element.name) {
        element.isCollapsed = false;
        selectedGame = element;
      }
      else {
        element.isCollapsed = true;
      }

    })

    this.gamesService.getgameratings(this.selectedGameName)
      .then((r) => {
        console.log("rating result");
        console.log(r);
        this.updateGameRate(r);
      })
      .catch((err) => {
        console.log("Rating get Error");
      })
    this.detectGamesRatingChange(this.selectedGameName);
    if (this.listenerLiveScore)
      this.removeLiveScoreEventListener();
    this.detectGamesLiveScore(gamename);
  }

  updateGameRate(r: any) {
    this.games.forEach((element) => {
      if (element.name === this.selectedGameName) {
        element.avrgRate = r.avrgRate;
        element.userRate = r.userRate;
      }
    })
  }
  detectGamesRatingChange(gamename: string) {
    this.gameRatingListener = firebase.database().ref(`games/${gamename}/usersRating`).on('value', (usersRating) => {
      if (usersRating.val()) {
        let userRate = 0;
        let ratesNumber = 0;
        let avrgRate = 0;
        let rates = usersRating.val();
        if (rates) {
          for (var ratekey in rates) {
            if (ratekey === this.gamesService.user.uid) {
              userRate = rates[ratekey].rate;
            }
            avrgRate += rates[ratekey].rate;
            ratesNumber += 1;
          }
          if (ratesNumber < 1) {
            ratesNumber = 1;
          }
        }
        else {
          ratesNumber = 1;
        }
        console.log("User rate data");
        console.log({ userRate: userRate, avrgRate: avrgRate });
        this.updateGameRate({ userRate: userRate, avrgRate: (avrgRate / ratesNumber) });
      }
    });
  }
  removeGameRatingListener() {
    // this.gameRatingListener.off();
  }
  prettifyHeader(name: string) {
    let newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName;
  }
  onNewGameAdded() {
    let that = this;
    firebase.database().ref("games").on('child_added', (game, b) => {
      console.log("on child added");
      // console.log((<any>game).getKey());
      console.log(this.newGame);
      let gm = new Game(this.newGame, 0, 0, true, game.val().windowWidth, game.val().windowHeight, undefined, "https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/games%2Fimages%2Fnew_game.jpeg?alt=media&token=ad100168-8ed9-4de9-8325-0ad276511a07", false, false);
      console.log("gm");
      console.log(gm);
      // this.games.push(gm);
    });
  }
  updateGameSattus(name: string) {
    this.games.forEach((element) => {
      if (element.name === name) {
        element.active = !element.active;
        this.gamesService.updateGameStatus(name, element.active)
          .then((r) => {
            let text = "Deactivated";
            if (element.active) {
              text = "Activated"
            }
            alert(`${name} is ${text}`)
          })
      }
    })
  }

  updateGameSattusMobileCompatible(name: string) {
    this.games.forEach((element) => {
      if (element.name === name) {
        element.mobileCompatible = !element.mobileCompatible;
        this.gamesService.updateGameStatusMobileCompatible(name, element.mobileCompatible)
          .then((r) => {
            let text = "Deactivated";
            if (element.mobileCompatible) {
              text = "Activated"
            }
            alert(`${name} is ${text}`)
          })
      }
    })
  }
  deleteGame(gamename: string) {
    let r = confirm(gamename + " will be deleted! Confirm!");
    if (r) {
      this.deletedGameName = gamename;
      this.gamesService.deleteGame(gamename)
      .then((r)=>{
        alert(gamename+" is deleted");
      })
      .catch((e)=>{
        console.log("Error");
        console.log(e);
        alert("Error deleting "+gamename);
      })
    }
  }
  detectGamesLiveScore(gamename: string) {
    //  this.setintervallistener= setInterval(()=>{
    // let endtime = Date.now();
    // if((endtime - this.starttime)<30 * 1000){
    //   jQuery("#livescore_"+gamename).kendoGrid({
    //     dataSource: {
    //       date:[],
    //       sort: {
    //         field: "score",
    //         dir: "desc"
    //       },
    //       pageSize: 20
    //     },
    //     scrollable: false
    //   });
    // }
    //   }, 1000);
    let nothingToShow = true;
    this.listenerLiveScore = firebase.database().ref(`games/${gamename}/livescores`).on('value', (snapshot) => {
      // Do whatever
      // console.log("gsmes info chnaged");
      // console.log(snapshot.val());
      var now = Date.now();
      var cutoff = now - (30 * 1000);
      let object = snapshot.val();
      let data = [];
      let activeUsers = 0;
      for (let key in object) {
        if ((object[key].timestamp > cutoff) && (key !== "admin")) {
          nothingToShow = false;
          activeUsers += 1;
          if (this.settimeoutlistener) {

            clearTimeout(this.settimeoutlistener);
          }

        }
      }
      data.push({ name: "active users", number: activeUsers })
      this.showLiveRezultTable(data);
      this.settimeoutlistener = setTimeout(() => {
        this.showLiveRezultTable([]);
      }, 5000);
    });
    if (nothingToShow) {
      this.showLiveRezultTable([]);
    }
  }
  removeLiveScoreEventListener() {
    // this.listenerLiveScore.off();
  }

  showLiveRezultTable(result: any) {
    if (result.length < 1) {
      jQuery("#livedata_" + this.selectedGameName).kendoGrid({
        dataSource: {
          data: [{
            name: "",
            number: "no active users"
          }],
          sort: {
            field: "number",
            dir: "desc"
          },
          pageSize: 20
        },
        scrollable: false
      });
    }
    else {
      jQuery("#livedata_" + this.selectedGameName).kendoGrid({
        dataSource: {
          data: result,
          sort: {
            field: "score",
            dir: "desc"
          },
          pageSize: 20
        },
        scrollable: false
      });
    }
  }

  onGameRemoved() {
    firebase.database().ref("games").on('child_removed', (game) => {
      console.log("on child removed");
      console.log(game.val());
      console.log()
      if (game.val()) {
        let i = -1;
          for (let index = 0; index < this.games.length; index++) {
            const element = this.games[index];
            if (element.name === this.deletedGameName) {
              i=index;
            }

          }
        
        if (i > -1) {
          this.games.splice(i, 1);
          console.log("in if splice")
        }
      }
      // this.games.push(new Game(this.newGame, 0, 0, true, game.val().windowWidth, game.val().windowHeight, undefined, false, false));
    });
  }
  // detectGamesContentChange() {
  //   firebase.database().ref("games/").on('value', (games) => {
  //     // Do whatever
  //     // console.log("gsmes info chnaged");
  //     // console.log(snapshot.val());
  //     if (games.val()) {
  //       let gamesArray = [];
  //       let object = games.val();
  //       for (var key in object) {
  //         let userRate = 0;
  //         let ratesNumber = 0;
  //         let avrgRate = 0;
  //         console.log(key);
  //         console.log(object[key].active);
  //         let rates = object[key].usersRating;
  //         if (rates) {
  //           for (var ratekey in rates) {
  //             avrgRate += rates[ratekey].rate;
  //             ratesNumber += 1;
  //           }
  //         }
  //         else {
  //           ratesNumber = 1;
  //         }
  //         gamesArray.push(new Game(key, userRate, avrgRate / ratesNumber, true, object[key].windowWidth, object[key].windowHeight, undefined));
  //       }
  //       this.games = gamesArray;
  //     }
  //   });
  // }

  // onSubmit(email: string, password: string) {
  //   this.authService.signin(email, password)
  //     .then((r) => {
  //       console.log("Login result");
  //       console.log(r);
  //       console.log("emailVerified" + r.emailVerified);
  //       if (!r.emailVerified) {
  //         alert("Please, visit your mail box and verify your email!");
  //       }
  //       else {
  //         console.log("login");
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.log(e);
  //       alert(`Login Error ${e}`);
  //     })
  // }
  // googleSignIn() {
  //   console.log("googleSignIn");
  //   this.authService.signInGoogle()
  //     .then((result) => {
  //       var token = result.credential.accessToken;
  //       // The signed-in user info.
  //       var user = result.user;
  //       console.log("Token");
  //       console.log(token);
  //       console.log("User");
  //       console.log(user);
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.trace(e);

  //       alert(`Login Error ${e}`);
  //     })
  // }
}
