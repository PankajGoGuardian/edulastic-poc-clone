import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class TextDropDown extends BlockEmbed {
  static create() {
    const node = super.create();
    const textDropdownCount = document.querySelectorAll(".text-dropdown-btn").length;
    node.setAttribute("contenteditable", false);
    node.innerHTML = `<span class="dropdown-index">${textDropdownCount +
      1}</span><span class="dropdown-text">Text Dropdown</span>`;
    return node;
  }
}
TextDropDown.blotName = "TextDropDown";
TextDropDown.tagName = "p";
TextDropDown.className = "text-dropdown-btn";

export default TextDropDown;
