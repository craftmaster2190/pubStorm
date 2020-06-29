import { CustomOverlay } from '../util/custom-overlay';
import { Box } from '../util/box';

export class StormOverlay extends CustomOverlay {
  constructor(public bounds: google.maps.LatLngBounds, map) {
    super(null, null, '/assets/storm-circle.png', map);
  }

  onAdd() {
    super.onAdd();
    this.div.classList.add('storm-rotate');
  }

  draw() {
    const projection = this.getProjection();
    if (projection && this.div) {
      const box = new Box();
      const northEast = projection.fromLatLngToDivPixel(
        this.bounds.getNorthEast()
      );

      const southWest = projection.fromLatLngToDivPixel(
        this.bounds.getSouthWest()
      );

      box.left = southWest.x;
      box.top = northEast.y;

      box.width = northEast.x - southWest.x;
      box.height = southWest.y - northEast.y;

      box.applyTo(this.div);
    }
  }
}
