import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class CellBreak extends BlockEmbed {
  formats = () => ({ tdbr: true });
}
CellBreak.blotName = "tdbr";
CellBreak.tagName = "td";
CellBreak.className = "tdbr";

export default CellBreak;
