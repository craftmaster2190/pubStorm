import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  NgZone,
  ElementRef,
} from '@angular/core';
import {} from 'googlemaps';
import { timer, Observable, ReplaySubject, throwError, of } from 'rxjs';
import { switchMap, tap, take, catchError } from 'rxjs/operators';
import { CustomOverlay } from './util/custom-overlay';
import { PlayerPositionService } from './players/player-position.service';
import { PlayerOverlay } from './players/player-overlay';
import { StormService } from './storm/storm.service';
import { StormOverlay } from './storm/storm-overlay';
import { jsonifyError } from './util/errors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('mapDiv') mapElement: ElementRef<HTMLDivElement>;
  map: google.maps.Map;
  coordinates = new ReplaySubject<Coordinates>(1);
  players: { [key: string]: CustomOverlay } = {};
  storm: StormOverlay;
  error;

  constructor(
    private readonly playerPositionService: PlayerPositionService,
    private readonly stormService: StormService,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    timer(0, 1000)
      .pipe(
        switchMap(
          () =>
            new Observable<Position>((sub) => {
              if (navigator.geolocation) {
                try {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      sub.next(position);
                    },
                    (err) => {
                      sub.error(err);
                    },
                    {
                      enableHighAccuracy: true,
                      maximumAge: 1000,
                      timeout: 1000,
                    }
                  );
                } catch (err) {
                  sub.error(err);
                }
              } else {
                sub.error(new Error("Geolocation doesn't work!"));
              }
            })
        ),
        tap((position) =>
          this.ngZone.run(() => this.coordinates.next(position.coords))
        ),
        catchError((err) => {
          console.log(err);
          this.error = jsonifyError(err);
          return of();
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.coordinates
      .pipe(
        take(1),
        tap((coordinates) => {
          console.log('coordinates', coordinates);

          this.ngZone.runOutsideAngular(() => {
            const center = new google.maps.LatLng(
              coordinates.latitude,
              coordinates.longitude
            );
            const mapProperties: google.maps.MapOptions = {
              center,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.TERRAIN,
              disableDefaultUI: true,
            };
            this.mapElement.nativeElement.innerHTML = '';
            this.map = new google.maps.Map(
              this.mapElement.nativeElement,
              mapProperties
            );
            new PlayerOverlay(center, this.map);
          });

          this.playerPositionService
            .getPlayers()
            .pipe(
              tap((players) => {
                players.forEach((player) => {
                  if (!this.players[player.id]) {
                    this.players[player.id] = new PlayerOverlay(
                      player.position,
                      this.map
                    );
                  }
                  this.players[player.id].position = player.position;
                  this.ngZone.runOutsideAngular(() =>
                    this.players[player.id].draw()
                  );
                });
              })
            )
            .subscribe();

          this.stormService
            .getStorm()
            .pipe(
              tap((stormBounds) => {
                if (!this.storm) {
                  this.storm = new StormOverlay(stormBounds, this.map);
                }
                this.storm.bounds = stormBounds;
                this.ngZone.runOutsideAngular(() => this.storm.draw());
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
