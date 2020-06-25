import { CustomOverlay } from '../util/custom-overlay';

export class PlayerOverlay extends CustomOverlay {
  constructor(position, map) {
    super(
      position,
      { width: 40, height: 40 },
      '/assets/person-running.png',
      map
    );
  }
}
