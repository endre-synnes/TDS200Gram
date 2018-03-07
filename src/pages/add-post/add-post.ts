import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Post } from '../../models/Post';
import {Camera} from "@ionic-native/camera";


@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  public postCollection: AngularFirestoreCollection<Post>;
  public postText: string = "";
  private previewImage = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera) {
    this.postCollection = navParams.get('postCollection');
  }


  addPost(){
    this.postCollection.add({ body: this.postText} as Post);
  }


  executeCamera(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK
    })
      .then(imgBase64 => {
        this.previewImage = 'data:image/jpeg;base64,' + imgBase64
      });
  }


}
