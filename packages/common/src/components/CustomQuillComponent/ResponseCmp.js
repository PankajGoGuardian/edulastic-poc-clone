import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class ResponseCmp extends BlockEmbed {
  static create() {
    const node = super.create();
    const responseCount = document.querySelectorAll(".response-btn").length;
    node.setAttribute("contenteditable", false);
    node.innerHTML = `&nbsp;<span class="index">${responseCount + 1}</span><span class="text">Response</span>&nbsp;`;
    return node;
  }
}
ResponseCmp.blotName = "Response";
ResponseCmp.tagName = "p";
ResponseCmp.className = "response-btn";

export default ResponseCmp;
