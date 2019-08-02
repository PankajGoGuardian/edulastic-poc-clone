import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import striptags from "striptags";
import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";
import { CONSTANT } from "../config";

function init(element, board, cb, readOnly = false) {
  if (element.editor) {
    cb();
    return;
  }

  element.setLabel("");

  const selector = `#${board.$board.container}_${element.label.id}`;
  element.editor = new FroalaEditor(
    selector,
    {
      key: process.env.POI_APP_FROALA_KEY,
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

    const content = replaceLatexesWithMathHtml(label, latex => {
      if (!katex) return latex;
      return katex.renderToString(latex);
    });

    init(
      element,
      board,
      () => {
        if (label) {
          element.editor.html.set(content);
        }
      },
      readOnly
    );

    element.labelHTML = content;
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
    const content = replaceLatexesWithMathHtml(html, latex => {
      if (!katex) return latex;
      return katex.renderToString(latex);
    });

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
      element.labelHTML = content;
      if (element.type === 99 && board.elements.findIndex(el => el.id === element.id) === -1) {
        board.elements.push(element);
      }
    }

    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE);
  }
});

export default FroalaEditorInput;
