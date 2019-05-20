import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class RowBreak extends BlockEmbed {
  formats = () => ({ trbr: true });
}

RowBreak.blotName = "trbr";
RowBreak.tagName = "td";
RowBreak.className = "trbr";

export default RowBreak;
