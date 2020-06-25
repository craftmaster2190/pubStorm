import { Injectable } from '@angular/core';
import { Observable, timer, of } from 'rxjs';
import { Player } from './player';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerPositionService {
  public players: Array<Player> = [];

  constructor() {
    // TODO Replace with websocket updates
    navigator.geolocation.getCurrentPosition((position) => {
      this.players = Array.prototype.map.call(
        Array.from(Array(5)),
        (_, id) =>
          ({
            id,
            name: 'Name' + id,
            position: new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            ),
          } as Player)
      );

      timer(1000, 400)
        .pipe(
          tap(() => {
            this.players.forEach((player) => {
              const lat =
                player.position.lat() +
                0.0001 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
              const lng =
                player.position.lng() +
                0.0001 * Math.random() * (Math.random() > 0.5 ? 1 : -1);

              player.position = new google.maps.LatLng(lat, lng);
            });
          })
        )
        .subscribe();
    });
  }

  getPlayers() {
    return timer(0, 300).pipe(map(() => this.players));
  }
}
