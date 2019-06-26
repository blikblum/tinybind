describe('Routines', function() {
  var el, input, trueRadioInput, falseRadioInput, checkboxInput;

  var createInputElement = function(type, value) {
    var elem = document.createElement('input');
    elem.setAttribute('type', type);
    if (value !== undefined) {
      elem.setAttribute('value', value);
    }
    document.body.appendChild(elem);
    return elem;
  };

  var createOptionEls = function(val) {
    var option = document.createElement('option');
    option.value = val;
    option.textContent = val + ' text';
    return option;
  };

  var createSelectElement = function(isMultiple, optionValues) {
    var elem = document.createElement('select');
    var options;
    if (optionValues instanceof Array) {
      options = optionValues.map(createOptionEls);
      options.forEach(function(option) {
        elem.appendChild(option);
      });
    } else {
      //grouped
      Object.keys(optionValues).forEach(function(group) {
        var optGroupEl = document.createElement('optgroup');
        optGroupEl.label = group;
        options = optionValues[group].map(createOptionEls);
        options.forEach(function(option) {
          optGroupEl.appendChild(option);
        });
        elem.appendChild(optGroupEl);
      });
    }
    if (isMultiple) elem.multiple = true;
    document.body.appendChild(elem);
    return elem;
  };

  beforeEach(function() {
    riba.configure({
      adapter: {
        subscribe: function() {},
        unsubscribe: function() {},
        read: function() {},
        publish: function() {}
      }
    });

    el = document.createElement('div');
    document.body.appendChild(el);
    input = createInputElement('text');

    // to test the radio input scenario when its value is "true"
    trueRadioInput = createInputElement('radio', 'true');

    // to test the radio input scenario when its value is "false"
    falseRadioInput = createInputElement('radio', 'false');

    // to test the checkbox input scenario
    checkboxInput = createInputElement('checkbox');
  });

  afterEach(function(){
    el.parentNode.removeChild(el);
    input.parentNode.removeChild(input);
    trueRadioInput.parentNode.removeChild(trueRadioInput);
    falseRadioInput.parentNode.removeChild(falseRadioInput);
    checkboxInput.parentNode.removeChild(checkboxInput);
  });

  describe('text', function() {
    it("sets the element's text content", function() {
      riba.binders.text.routine(el, '<em>hello</em>');
      el.textContent.should.equal('<em>hello</em>');
      el.innerHTML.should.equal('&lt;em&gt;hello&lt;/em&gt;');
    });

    it("sets the element's text content to zero when a numeric zero is passed", function() {
      riba.binders.text.routine(el, 0);
      el.textContent.should.equal('0');
      el.innerHTML.should.equal('0');
    });
  });

  describe('html', function() {
    it("sets the element's HTML content", function() {
      riba.binders.html.routine(el, '<strong>hello</strong>');
      el.textContent.should.equal('hello');
      el.innerHTML.should.equal('<strong>hello</strong>');
    });

    it("sets the element's HTML content to zero when a zero value is passed", function() {
      riba.binders.html.routine(el, 0);
      el.textContent.should.equal('0');
      el.innerHTML.should.equal('0');
    });
  });

  describe('value', function() {
    it("sets the element's value", function() {
      riba.binders.value.routine(input, 'pitchfork');
      input.value.should.equal('pitchfork');
    });

    it("applies a default value to the element when the model doesn't contain it", function() {
      riba.binders.value.routine(input, undefined);
      input.value.should.equal('');
    });

    it("sets the element's value to zero when a zero value is passed", function() {
      riba.binders.value.routine(input, 0);
      input.value.should.equal('0');
    });

    describe('in a select element', function(){
      beforeEach(function () {
        selectEl = createSelectElement(false, ['a', 'b', 'c']);
        selectMultipleEl = createSelectElement(true, ['d', 'e', 'f']);
        groupedSelectEl = createSelectElement(false, {'group1': ['a'], 'group2': ['b', 'c']});
        groupedMultipleSelectEl = createSelectElement(true, {'group1': ['a'], 'group2': ['b', 'c']});
      });

      it("sets the correct option on a select element", function() {
        riba.binders.value.routine(selectEl, 'b');
        riba.binders.value.routine(selectEl, 'c');
        selectEl.value.should.equal('c');
      });

      it("sets the correct option on a select-multiple element", function() {
        riba.binders.value.routine(selectMultipleEl, ['d', 'f']);
        Array.prototype.slice.call(selectMultipleEl.children)
          .filter(function(option) {
            return option.selected;
          })
          .map(function(option) {
            return option.value;
          })
          .should.eql(['d', 'f']);
      });

      it("sets the correct option on a grouped select element", function() {
        riba.binders.value.routine(groupedSelectEl, 'b');
        riba.binders.value.routine(groupedSelectEl, 'c');
        groupedSelectEl.value.should.equal('c');
      });

      it("sets the correct option on a select-multiple element", function() {
        var i;
        riba.binders.value.routine(groupedMultipleSelectEl, ['a', 'c']);
        Array.prototype.slice.call(groupedMultipleSelectEl.options)
          .filter(function(option) {
            return option.selected;
          })
          .map(function(option) {
            return option.value;
          })
          .should.eql(['a', 'c']);
      });

      afterEach(function () {
        selectEl.parentNode.removeChild(selectEl);
        selectMultipleEl.parentNode.removeChild(selectMultipleEl);
        groupedSelectEl.parentNode.removeChild(groupedSelectEl);
        groupedMultipleSelectEl.parentNode.removeChild(groupedMultipleSelectEl);
      });
    });
  });


  describe('show', function() {
    describe('with a truthy value', function() {
      it('shows the element', function() {
        riba.binders.show.routine(el, true);
        el.style.display.should.equal('');
      });
    });

    describe('with a falsey value', function() {
      it('hides the element', function() {
        riba.binders.show.routine(el, false);
        el.style.display.should.equal('none');
      });
    });
  });

  describe('hide', function() {
    describe('with a truthy value', function() {
      it('hides the element', function() {
        riba.binders.hide.routine(el, true);
        el.style.display.should.equal('none');
      });
    });

    describe('with a falsey value', function() {
      it('shows the element', function() {
        riba.binders.hide.routine(el, false);
        el.style.display.should.equal('');
      });
    });
  });

  describe('enabled', function() {
    describe('with a truthy value', function() {
      it('enables the element', function() {
        riba.binders.enabled.routine(el, true);
        el.disabled.should.equal(false);
      });
    });

    describe('with a falsey value', function() {
      it('disables the element', function() {
        riba.binders.enabled.routine(el, false);
        el.disabled.should.equal(true);
      });
    });
  });

  describe('disabled', function() {
    describe('with a truthy value', function() {
      it('disables the element', function() {
        riba.binders.disabled.routine(el, true);
        el.disabled.should.equal(true);
      });
    });

    describe('with a falsey value', function() {
      it('enables the element', function() {
        riba.binders.disabled.routine(el, false);
        el.disabled.should.equal(false);
      });
    });
  });

  describe('checked', function() {
    describe('with a checkbox input', function() {
      describe('and a truthy value', function() {
        it('checks the checkbox input', function() {
          riba.binders.checked.routine(checkboxInput, true);
          checkboxInput.checked.should.equal(true);
        });
      });

      describe('with a falsey value', function() {
        it('unchecks the checkbox input', function() {
          riba.binders.checked.routine(checkboxInput, false);
          checkboxInput.checked.should.equal(false);
        });
      });
    });

    describe('with a radio input with value="true"', function() {
      describe('and a truthy value', function() {
        it('checks the radio input', function() {
          riba.binders.checked.routine(trueRadioInput, true);
          trueRadioInput.checked.should.equal(true);
        });
      });

      describe('with a falsey value', function() {
        it('unchecks the radio input', function() {
          riba.binders.checked.routine(trueRadioInput, false);
          trueRadioInput.checked.should.equal(false);
        });
      });
    });

    describe('with a radio input with value="false"', function() {
      describe('and a truthy value', function() {
        it('checks the radio input', function() {
          riba.binders.checked.routine(falseRadioInput, true);
          falseRadioInput.checked.should.equal(false);
        });
      });

      describe('with a falsey value', function() {
        it('unchecks the radio input', function() {
          riba.binders.checked.routine(falseRadioInput, false);
          falseRadioInput.checked.should.equal(true);
        });
      });
    });
  });
});
