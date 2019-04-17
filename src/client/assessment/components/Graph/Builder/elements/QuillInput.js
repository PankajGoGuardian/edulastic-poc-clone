import "react-quill/dist/quill.bubble.css";
import { Quill } from "react-quill";
import { CONSTANT } from "../config";

function init(element, board, readOnly = false) {
  if (element.quillInput) {
    return;
  }

  element.setLabel("");
  const selector = `[id*=${element.label.id}]`;
  element.quillInput = new Quill(selector, {
    theme: "bubble",
    readOnly,
    modules: {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          // ['bold', 'italic', 'underline'],
          [{ color: [] }]
        ]
      }
    }
  });

  element.quillInput.root.addEventListener("click", () => {
    QuillInput(element, board).setFocus();
  });
}

const QuillInput = (element, board) => ({
  setLabel(label, readOnly = false) {
    if (!label) {
      return;
    }

    init(element, board, readOnly);
    element.quillInput.root.innerHTML = label;
    element.labelHTML = label;
  },

  setFocus() {
    if (board.isAnyElementsHasFocus()) {
      return;
    }

    init(element, board);

    board.setElementsFixedAttribute(true);
    element.label.setAttribute({ visible: true });
    element.quillInput.theme.tooltip.root.style.display = "block";
    element.quillInput.container.style.zIndex = 2000;
    element.quillInput.theme.tooltip.show();
    element.quillInput.focus();
    element.quillInput.setSelection(0, 1000);
    element.hasFocus = true;

    // add overlay
    const div = document.createElement("div");
    div.classList.add("toolbar-overlay");
    div.addEventListener("click", e => {
      e.stopPropagation();
      QuillInput(element, board).save();
      document.body.removeChild(div);
    });
    document.body.appendChild(div);
  },

  save() {
    if (!element.hasFocus) {
      return;
    }

    board.setElementsFixedAttribute(false);
    element.quillInput.theme.tooltip.root.style.display = "none";
    element.quillInput.container.style.zIndex = 9;
    element.hasFocus = false;

    const html = element.quillInput
      .getLines()
      .map(l => l.domNode.outerHTML)
      .join("");
    const text = element.quillInput
      .getLines()
      .map(l => l.domNode.innerText)
      .join("")
      .trim();

    if (element.labelHTML === html) {
      return;
    }

    if (text.length === 0 && !element.labelHTML) {
      element.label.setAttribute({ visible: false });
      return;
    }

    if (text.length === 0) {
      element.label.setAttribute({ visible: false });
      element.labelHTML = null;
    } else {
      element.labelHTML = html;
    }

    board.events.emit(CONSTANT.EVENT_NAMES.CHANGE_UPDATE);
  }
});

export default QuillInput;
