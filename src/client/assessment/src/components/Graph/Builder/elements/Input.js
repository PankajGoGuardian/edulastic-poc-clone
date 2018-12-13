import { defaultInputParameters } from '../settings';

function onBlur(element, cb) {
  return () => {
    element.setLabel(this.value);
    element.label.setAttribute({ visible: true });
    cb();
  };
}

function onEnter(element, cb) {
  return (event) => {
    if (event.keyCode === 13) {
      this.onblur = null;
      event.preventDefault();
      element.setLabel(this.value);
      element.label.setAttribute({ visible: true });
      cb();
    }
  };
}

function getInputCoords(element) {
  switch (element.elType) {
    case 'point':
      return [
        element.coords.usrCoords[1],
        element.coords.usrCoords[2],
      ];
    case 'polygon':
    case 'circle':
    case 'line':
    case 'curve':
      if (element.hasLabel) {
        return [
          element.label.coords.usrCoords[1],
          element.label.coords.usrCoords[2],
        ];
      }
      element.setLabel('');
      element.label.setAttribute({ visible: false });
      return [
        element.label.coords.usrCoords[1],
        element.label.coords.usrCoords[2],
      ];

    default:
      throw new Error('Error getting label coords:', element.elType);
  }
}

export default (element) => {
  const { board } = element;
  let input = null;
  return {
    id() { return element.id; },
    sub() {
      if (!element.label.eventHandlers.up) {
        element.label.on('up', () => {
          this.update.call(this);
        });
      }
    },
    init() {
      input = this.create();
      input.rendNodeInput.focus();
      input.rendNodeInput.select();
      input.rendNodeInput.onblur = onBlur(element, () => {
        this.sub();
        this.removeInput();
      });
      input.rendNodeInput.onkeyup = onEnter(element, () => {
        this.sub();
        this.removeInput();
      });
    },
    create(value = '') {
      return board.create('input', [
        ...getInputCoords(element),
        value,
        '',
      ], defaultInputParameters());
    },
    update() {
      const { plaintext } = element.label;
      element.label.setAttribute({ visible: false });
      input = this.create(plaintext);
      setTimeout(() => {
        input.setAttribute({ visible: true, });
        input.rendNodeInput.focus();
        input.rendNodeInput.select();
        input.rendNodeInput.onblur = onBlur(element, () => {
          this.sub();
          this.removeInput();
        });
        input.rendNodeInput.onkeyup = onEnter(element, () => {
          this.sub();
          this.removeInput();
        });
      });
    },
    removeInput() {
      if (input) {
        if (!input.rendNodeInput.value) {
          element.label.setAttribute({ visible: false });
        }
        input.remove();
        input = null;
      }
    },
  };
};
