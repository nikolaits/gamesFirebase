import { Component, ViewChild, Output, EventEmitter, isDevMode, enableProdMode } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/user-service/user.service';
import { UserUpdate } from "../../types/user_update.type"
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EqualValidatorDirective } from '../../signup/equal-validator.directive';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import * as firebase from "firebase";
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { prod } from '../globals';
/**
 * This class represents the toolbar component.
 */
declare var window:any;
@Component({
  moduleId: module.id,
  selector: 'update-module',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.css']
})
export class UpdateComponent {

  model: UserUpdate;
  updateForm: FormGroup;
  oldUsername: string;
  oldPassword: string
  taken: boolean = false;
  oldPicture: any;
  disabledPasswordField: boolean = false;
  data: any;
  file: File;
  progress:number;
  isProgressVisible:boolean = false;
  cropperShown: boolean = false;
  showTheCropper:boolean = true;
  cropperSettings: CropperSettings;
  isReadyForSubmit: boolean = true;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private authService: AuthService) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.keepAspect = false;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;

    this.cropperSettings.rounded = true;
    this.cropperSettings.minWithRelativeToResolution = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }
  ngOnInit() {
    this.userService.getCurrentUser();
    let email = this.userService.user.email;
    let providerId = (<any>this.userService.user.providerData)[0]["providerId"];
    if ((providerId === "google.com") || (providerId === "facebook.com")) {
      console.log("here in the if")
      this.disabledPasswordField = true;
    }
    this.model = new UserUpdate("", email, "xxxxxx", "xxxxxx");
    this.updateForm = new FormGroup({
      'username': new FormControl(this.model.username, [
        Validators.nullValidator
      ]),
      'email': new FormControl({ value: this.model.email, disabled: true }, [
      ]),
      'password': new FormControl({ value: this.model.password, disabled: this.disabledPasswordField }, [
        Validators.nullValidator,
        Validators.minLength(6)
      ]),
      'repassword': new FormControl({ value: this.model.repassword, disabled: this.disabledPasswordField }, [
        Validators.nullValidator
      ]),
    }, );



    // if()
    this.userService.getUserUsernameAndProfilePicture()
      .then((info: UserInitInfo) => {

        this.oldUsername = info.username;
        this.data.image = this.oldPicture = info.profile_picture;
        this.updateForm.controls.username.setValue(info.username);
        // this.model= new UserUpdate(this.oldUsername, email, "XXXXxxxx", "XXXXxxxx");
        // this.updateForm.get("username").value = email;
        // this.model.username = this.oldUsername;
        // this.updateForm = new FormGroup({
        //   'username': new FormControl(this.model.username, [
        //     Validators.nullValidator
        //   ]),
        //   'email': new FormControl({value:this.model.email, disabled:true}, [
        //   ]),
        //   'password': new FormControl({value:this.model.password, disabled:this.disabledPasswordField}, [
        //     Validators.nullValidator,
        //     Validators.minLength(6)
        //   ]),
        //   'repassword': new FormControl({value:this.model.repassword, disabled:this.disabledPasswordField}, [
        //     Validators.nullValidator
        //   ]),
        // }, );
      })
      .catch((err) => {
        console.log("Error");
        console.log(err);
      })

  }
  get username() { return this.updateForm.get('username'); }
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }
  get repassword() { return this.updateForm.get('repassword'); }
  onSubmit() {
    this.taken = false;
    let usernameValue = this.username.value;
    let passwordValue = this.password.value;

    if (usernameValue !== this.oldUsername) {
      this.userService.isUsernameTaken(usernameValue)
        .then((r) => {
          if (r === "free") {
            this.userService.updateUsername(usernameValue)
              .then(() => {
                this.change.emit({message:"usernameUpdated", result:usernameValue});
                console.log("username updated");
                this.updatePassword(passwordValue, true);
              })
              .catch((err) => {
                console.log("Error");
                console.log(err);
              })
          }
        })
        .catch((e) => {
          if (e === "taken") {
            this.taken = true;
            this.updateForm.controls.username.setValue(this.oldUsername);
          } else {
            console.log(e);
          }

        });
    } else {
      this.updatePassword(passwordValue, false);
    }
  }
  updatePassword(passwordValue: string, usernameUpdateFlag: boolean) {
    if ((!this.disabledPasswordField) && (passwordValue === "xxxxxx")) {
      this.userService.user.updatePassword(passwordValue)
        .then((r) => {
          console.log("password updated");
         
            this.activeModal.close("close modal");
          
        })
        .catch((e) => {
          alert("Error, while updating the password");
          console.log("Error");
          console.log(e);
        })
    }
    else {
      
        this.activeModal.close("close modal");
      
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
    that.cropperShown = true;
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
          console.log("in production mode ")
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
    this.cropperShown = false;
    this.data.image = this.oldPicture;
    this.isReadyForSubmit = true;
  }

  saveImage() {
    console.log(firebase);
    try {
      let storageRef = firebase.storage().ref('users/profile_pic_uid' + this.userService.user.uid + '.jpeg');
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
        this.cropperShown = false;
        this.oldPicture = task.snapshot.downloadURL;
        this.isReadyForSubmit = true;
        this.userService.updateUserImage(task.snapshot.downloadURL)
          .then(() => {
            console.log("username updated");
            this.change.emit({message:"profilePictureUpdated", result:task.snapshot.downloadURL});
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
  onModalClose() {
    this.activeModal.close();
  }

}

