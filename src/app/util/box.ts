import { Dimensions } from './dimensions';
import { element } from 'protractor';
import { pixels } from './pixels';

export class Box implements Dimensions {
  public left: number;
  public top: number;
  public width: number;
  public height: number;

  static center(point: google.maps.Point, dimensions: Dimensions) {
    const box = new Box();
    box.left = point.x - dimensions.width / 2;
    box.top = point.y - dimensions.height / 2;
    box.width = dimensions.width;
    box.height = dimensions.height;
    return box;
  }

  applyTo(element: HTMLElement) {
    element.style.left = pixels(this.left);
    element.style.top = pixels(this.top);
    element.style.width = pixels(this.width);
    element.style.height = pixels(this.height);
  }
}
