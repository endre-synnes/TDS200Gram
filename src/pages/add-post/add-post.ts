import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Post } from '../../models/Post';
import {Camera} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {PlacesProvider} from "../../providers/places/places";
import {AngularFireStorage} from "angularfire2/storage";



@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  public postCollection: AngularFirestoreCollection<Post>;
  public postText: string = "";
  private previewImage: string = "";
  public location: { latitude: number, longitude: number } = { latitude: 0, longitude: 0};
  private locationName: string = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private geolocation: Geolocation,
              private placesProvidor: PlacesProvider,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage) {
    this.postCollection = navParams.get('postCollection');
  }


  addPost(){
    let imageFileName = `${this.af.app.auth().currentUser.email}_${new Date().getTime()}.png`;

    let task = this.afStorage
                .ref(imageFileName)
                .putString(this.previewImage, 'base64', {contentType: 'image/png'});

    let uploadEvent = task.downloadURL();

    uploadEvent.subscribe((uploadImageUrl) => {
      this.postCollection.add({
        body: this.postText,
        author: this.af.app.auth().currentUser.email,
        imgUrl: uploadImageUrl
      } as Post);
    });

  }


  executeCamera() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK
    })
      .then(imgBase64 => {
        // Etter å ha tatt bildet får vi det returnert i filtypen "base64", som er en lang tekststreng (som vist i forelesningen).
        // For at HTML-en vår skal vite hvordan den skal presentere base64, må vi før tekststrengen slenge på litt metadata så HTML skal vite at tekststrengen er av typen base64:
        this.previewImage = imgBase64;
        //'data:image/jpeg;base64,'
      });
  }


  findGeolocation() {

    // Her kaller vi på Cordova sin Geolocation plugin
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    })
      .then(location => {
        // "location" vi får tilgang til er et objekt som blant annet inneholder et "coords"-objekt, som igjen holder koordinatene våre (latitude og longitude)

        this.location.latitude = location.coords.latitude;
        this.location.longitude = location.coords.longitude;

        // Så kaller vi på vår egen PlacesProvider, som skal hente geografisk lokasjon fra Google Geocode basert på koordinatene vi sender til den
        this.placesProvidor.getLocationFromGoogle(location.coords.latitude, location.coords.longitude)
          .then((place: any) => {
            // Hvis Google Geocode returnerer en feilmelding, så viser vi frem den
            if (place.error_message) {
              console.log(place.error_message)
            } else {
              // Hvis svaret fra Google Geocode var positivt, så henter vi ut adressen/plasseringen vår.
              // "results" er et array med adresser, hvor vi velger å hente adressen tilgjengelig på array-indeks 1 fordi den adressen virker best for oss, (f.eks. "Grünerløkka" i stedet for "Christian Krohgs gate").
              this.locationName = place.results[1].formatted_address;
            }
          });
      })
      .catch(error => {
        console.error(error)
      });
  }


}
