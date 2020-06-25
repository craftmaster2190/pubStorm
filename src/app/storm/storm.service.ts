import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { Dimensions } from '../util/dimensions';
import { map, filter } from 'rxjs/operators';
import { Heading } from '../util/heading';

@Injectable({
  providedIn: 'root',
})
export class StormService {
  // TODO Remove
  private center: google.maps.LatLng;
  private width = 1000; // meters
  private latLngBounds = new google.maps.LatLngBounds();

  constructor() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
    });
  }

  calcBounds() {
    const northEast = google.maps.geometry.spherical.computeOffset(
      this.center,
      this.width,
      Heading.NORTHEAST
    );
    const southWest = google.maps.geometry.spherical.computeOffset(
      this.center,
      this.width,
      Heading.SOUTHWEST
    );
    console.log(
      'Center:',
      this.center.toString(),
      'NE',
      northEast.toString(),
      'SW',
      southWest.toString()
    );
    return (this.latLngBounds = new google.maps.LatLngBounds(
      southWest,
      northEast
    ));
  }

  getStorm(): Observable<google.maps.LatLngBounds> {
    return timer(300, 1000).pipe(
      filter(() => !!this.center),
      map(() => {
        this.width--;
        return this.calcBounds();
      })
    );
  }
}
