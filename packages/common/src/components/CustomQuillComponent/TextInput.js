import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class TextInput extends BlockEmbed {
  static create() {
    const node = super.create();
    const textInputCount = document.querySelectorAll(".text-input-btn").length;
    node.setAttribute("contenteditable", false);
    node.innerHTML = `<span class="text-input-index">${textInputCount +
      1}</span><span class="input-text">Text Input</span>`;
    return node;
  }
}
TextInput.blotName = "TextInput";
TextInput.tagName = "p";
TextInput.className = "text-input-btn";

export default TextInput;
