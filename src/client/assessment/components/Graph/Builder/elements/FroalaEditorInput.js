import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import striptags from "striptags";
import { CONSTANT } from "../config";

function init(element, board, cb, readOnly = false) {
  if (element.editor) {
    cb();
    return;
  }

  element.setLabel("");

  const selector = `[id*=${element.label.id}]`;
  element.editor = new FroalaEditor(
    selector,
    {
      toolbarInline: true,
      placeholder: "",
      events: {
        click: () => {
          FroalaEditorInput(element, board).setFocus();
        },
        mousedown: () => {
          element.prepareToFocus = true;
        }
      }
    },
    () => {
      cb();
      if (readOnly) {
        element.editor.edit.off();
      }
    }
  );
}

const FroalaEditorInput = (element, board) => ({
  setLabel(label, readOnly = false) {
    if (!label || element.latexIsBroken) {
      return;
    }

    init(
      element,
      board,
      () => {
        if (label) {
          element.editor.html.set(label);
        }
      },
      readOnly
    );
    element.labelHTML = label;
  },

  setFocus() {
    if (board.isAnyElementsHasFocus()) {
      return;
    }

    init(element, board, () => {
      element.editor.events.focus();
    });

    board.setElementsFixedAttribute(true);
    element.label.setAttribute({ visible: true });
    element.hasFocus = true;

    // add overlay
    const div = document.createElement("div");
    div.classList.add("toolbar-overlay");
    div.addEventListener("click", e => {
      e.stopPropagation();
      FroalaEditorInput(element, board).save();
      document.body.removeChild(div);
    });
    document.body.appendChild(div);
  },

  save() {
    if (!element.hasFocus) {
      return;
    }

    board.setElementsFixedAttribute(false);
    element.hasFocus = false;
    element.prepareToFocus = false;

    const html = element.editor.html.get();
    const text = striptags(html);

    if (element.labelHTML === html) {
      return;
    }

    if (text.length === 0 && !element.labelHTML) {
      if (element.type === 99) {
        board.$board.removeObject(element);
      } else {
        element.label.setAttribute({ visible: false });
      }
      return;
    }

    if (text.length === 0) {
      if (element.type === 99) {
        board.elements = board.elements.filter(el => el.id !== element.id);
        board.$board.removeObject(element);
      } else {
        element.label.setAttribute({ visible: false });
        element.labelHTML = null;
      }
    } else {
      element.labelHTML = html;
      if (element.type === 99 && board.elements.findIndex(el => el.id === element.id) === -1) {
        board.elements.push(element);
      }
    }

    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE);
  }
});

export default FroalaEditorInput;
