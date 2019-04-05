import { getInputParameters } from "../settings";

function onBlur(element, input, cb) {
  return () => {
    element.setLabel(input.Value());
    element.label.setAttribute({ visible: true });
    cb();
  };
}

function onEnter(element, input, cb) {
  return event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      input.rendNodeInput.onblur = null;
      input.rendNodeInput.onchange = null;

      if (!element.label) {
        element.setLabel(input.Value());
      } else {
        element.label.setText(input.Value());
        element.label.setAttribute({ visible: true });
      }
      cb();
    }
  };
}

function getInputCoords(element) {
  if (!element.hasLabel) {
    element.setLabel("");
    element.label.setAttribute({ visible: false });
  }
  return [element.label.coords.usrCoords[1], element.label.coords.usrCoords[2]];
}

export default element => {
  const { board } = element;
  let input = null;
  return {
    id() {
      return element.id;
    },
    sub() {
      if (element.hasLabel) {
        if (!element.label.eventHandlers.up) {
          element.label.on("up", () => {
            this.update.call(this);
          });
        }
      }
    },
    init() {
      input = this.create();
      input.rendNodeInput.focus();
      input.rendNodeInput.select();
      input.rendNodeInput.onblur = onBlur(element, input, () => {
        this.sub();
        this.removeInput();
      });
      input.rendNodeInput.onkeyup = onEnter(element, input, () => {
        this.sub();
        this.removeInput();
      });
    },
    create(value = "") {
      return board.create("input", [...getInputCoords(element), value, ""], getInputParameters(element.type));
    },
    update() {
      const { plaintext } = element.label;
      element.label.setAttribute({ visible: false });
      input = this.create(plaintext);
      setTimeout(() => {
        input.setAttribute({ visible: true });
        input.rendNodeInput.focus();
        input.rendNodeInput.select();
        input.rendNodeInput.onblur = onBlur(element, input, () => {
          this.sub();
          this.removeInput();
        });
        input.rendNodeInput.onkeyup = onEnter(element, input, () => {
          this.sub();
          this.removeInput();
        });
      });
    },
    removeInput() {
      if (input) {
        if (!input.rendNodeInput.value) {
          if (element.hasLabel) {
            element.label.setAttribute({ visible: false });
          }
        }
        input.remove();
        input = null;
      }
    }
  };
};
