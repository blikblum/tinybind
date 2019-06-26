import {
    Riba,
} from '../riba';

import { IBinder } from '../interfaces';

/**
 * Sets the element's text value.
 */
export const custom: IBinder<string> = {
  routine(el: HTMLElement, value: string) {
    el.innerHTML = 'received ' + value;
  },
};

describe('Custom binder with no attribute value', () => {

    const riba = new Riba();
    riba.module.binderService.regist(custom, 'custom-binder');

    let el: HTMLDivElement;
    let model: any;
    let fragment: DocumentFragment;

    beforeEach(() => {
        model = {};
        fragment = document.createDocumentFragment();
        el = document.createElement('div');
        fragment.appendChild(el);
    });

    it('receives undefined when html attribute is not specified', () => {
      el.innerHTML = '<div rv-custom-binder></div>';
      riba.bind(fragment, model);
      expect(el.children[0].innerHTML).toEqual('received undefined');
    });
    it('receives undefined when html attribute is not specified', () => {
      el.innerHTML = '<div rv-custom-binder=""></div>';
      riba.bind(fragment, model);
      expect(el.children[0].innerHTML).toEqual('received undefined');
    });
  });
