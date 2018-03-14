import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import googleApiKey from "../../app/googleApiKey";


@Injectable()
export class PlacesProvider {

  private GOOGLE_GEOCODE_API_KEY: string = googleApiKey.googleApiKey;


  constructor(public http: HttpClient) {
  }

  getLocationFromGoogle(lat, lng){
    return new Promise((resolve, reject) => {
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${this.GOOGLE_GEOCODE_API_KEY}`)
        .subscribe(
          function (data) {
            // "data" her er svaret fra Google Geocode, som bl.a. inneholder adressen/lokasjonen vår.
            resolve(data)
          },
          function (error) {
            // Ved feil vil "error" bli populert med en feilmelding
            reject(error)
          }
        );

    });
  }
}
