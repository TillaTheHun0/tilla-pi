
import { PiGpio } from '@tilla-pi/gpio'

export class PiButton extends PiGpio {
  constructor (pin, { mode = PiGpio.INPUT, pullUpDown, edge = PiGpio.EITHER_EDGE, timeout = 0, alert = false, debounce = 0 }) {
    super(pin, { mode, pullUpDown, edge, timeout, alert })

    // debounce is only applicable if alerts are enabled
    if (alert) {
      this.glitchFilter(debounce * 1000)
    }
  }
}
