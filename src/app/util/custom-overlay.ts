import { Dimensions } from './dimensions';
import { Box } from './box';

export class CustomOverlay extends google.maps.OverlayView {
  protected div: HTMLDivElement;

  constructor(
    public position: google.maps.LatLng,
    public dimensions: Dimensions,
    private readonly imageSrc: string,
    private readonly map: google.maps.Map
  ) {
    super();
    this.setMap(map);
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.style.borderStyle = 'none';
    this.div.style.borderWidth = '0px';
    this.div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    const img = document.createElement('img');
    img.src = this.imageSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    this.div.appendChild(img);

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.div);
  }

  draw() {
    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    const center = this.getProjection()?.fromLatLngToDivPixel(this.position);
    if (center && this.div) {
      // Resize the image's div to fit the indicated dimensions.
      Box.center(center, this.dimensions).applyTo(this.div);
    }
  }

  // The onRemove() method will be called automatically from the API if
  // we ever set the overlay's map property to 'null'.
  onRemove() {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
}
