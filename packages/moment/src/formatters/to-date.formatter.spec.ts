import { Riba, textBinder } from '@ribajs/core';
import { ToDateFormatter } from './to-date.formatter';

const riba = new Riba();
riba.module.formatter.regist(ToDateFormatter);
riba.module.binder.regist(textBinder);

interface Model {
  obj?: {
    value: string;
  };
}

describe('riba.formatters', () => {

  describe('to-date', () => {
    let model: Model = {};

    beforeEach(() => {
      model = {};
    });

    it('The example string should be added to the value of the model', () => {
      model.obj = {
        value: 'Hello World',
      };
      const el = document.createElement('div');
      el.setAttribute('rv-text', 'obj.value | to-date "!"');
      riba.bind(el, model);
      expect(el.textContent).toEqual('Hello World from to-date <strong>formatter</strong> !');
    });
  });
});
