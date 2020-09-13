import { Riba, textBinder, dotAdapter } from '@ribajs/core';
import { AsHoursFormatter } from './as-hours.formatter';

const riba = new Riba();
riba.module.adapter.regist(dotAdapter);
riba.module.formatter.regist(AsHoursFormatter);
riba.module.binder.regist(textBinder);

interface Model {
  obj?: {
    value: string;
  };
}

describe('riba.formatters', () => {

  describe('as-hours', () => {
    let model: Model = {};

    beforeEach(() => {
      model = {};
    });

    it('The example string should be added to the value of the model', () => {
      model.obj = {
        value: 'Hello World',
      };
      const el = document.createElement('div');
      el.setAttribute('rv-text', 'obj.value | as-hours "!"');
      riba.bind(el, model);
      expect(el.textContent).toEqual('Hello World from as-hours <strong>formatter</strong> !');
    });
  });
});
