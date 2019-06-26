import { IBinder } from '../interfaces';

/**
 * Sets the element's text value.
 */
export const text: IBinder<string> = {
  routine(el: HTMLElement, value: string) {
    el.textContent = value != null ? value : '';
  },
};
