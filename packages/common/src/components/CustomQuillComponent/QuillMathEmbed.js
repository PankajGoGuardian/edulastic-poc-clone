import { Quill } from "react-quill";

// embed extension
const Embed = Quill.import("blots/block/embed");

class MathInputCmp extends Embed {
  state = {
    mathField: null
  };

  static create() {
    const node = super.create();
    node.setAttribute("contenteditable", false);
    node.innerHTML = '&nbsp;<span class="input__math__field"></span>&nbsp;';
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute("data-latex");
  }

  constructor(domNode, value) {
    super(domNode, value);
    const MQ = window.MathQuill.getInterface(2);
    const mathField = MQ.StaticMath(domNode.childNodes[1]);
    mathField.latex(value);
    this.state = {
      mathField
    };
  }

  value() {
    return this.state.mathField.latex();
  }
}

MathInputCmp.blotName = "MathInput";
MathInputCmp.tagName = "span";
MathInputCmp.className = "input__math";

export default MathInputCmp;
