import { IBinder } from '../interfaces';
import { JQuery as $ } from '../modules/jquery.module';
import { BinderWrapper } from '../services/binder.service';

export const removeClass: IBinder<string> = {
  routine(el: HTMLElement, value: string) {
    const $el = $(el);
    if (value) {
      $el.removeClass(value);
    }
    return value;
  },
};

/**
 * remove-class
 */
export const removeClassBinder: BinderWrapper = () => {
  return {
    binder: removeClass,
    name: 'remove-class',
  };
};
