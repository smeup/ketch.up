import { MDCRipple } from '@material/ripple';
import { MDCIconButtonToggle } from '@material/icon-button';

/**
 * Instantiates Material Design button component.
 * @param el - Must be the f-component wrapper (.f-button--wrapper)
 * @see https://material-components.github.io/material-components-web-catalog/#/component/button
 */
export function FButtonMDC(el: HTMLElement): void {
    const button = el.querySelector('button');
    const ripple = MDCRipple.attachTo(button);
    if (button.classList.contains('mdc-icon-button')) {
        ripple.unbounded = true;
        if (button.classList.contains('toggable')) {
            new MDCIconButtonToggle(button);
        }
    }
}
