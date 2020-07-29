import IconBold from "./bold";
import IconItalic from "./italic";
import IconUnderline from "./underline";
import IconDiv from "./div";
import IconOrdered from "./ordered";
import IconBullet from "./bullet";
import IconAlignLeft from "./alignleft";
import IconAlignCenter from "./aligncenter";
import IconAlignRight from "./alignright";
import IconAlignJustify from "./alignjustify";
import IconBlockQuote from "./blockquote";
import IconScriptSub from "./scriptsub";
import IconScriptSuper from "./scriptsuper";
import IconIndent from "./indent";
import IconOutdent from "./outdent";
import IconDirectionRtl from "./directionrtl";
import IconFormula from "./formula";
import IconImage from "./image";
import IconTable from "./table";
import IconRedo from "./redo";
import IconUndo from "./undo";

export default {
  bold: IconBold,
  italic: IconItalic,
  underline: IconUnderline,
  strikeThrough: () => "st",
  h1: () => "h1",
  h2: () => "h2",
  div: IconDiv,
  formatOL: IconOrdered,
  formatUL: IconBullet,
  alignLeft: IconAlignLeft,
  alignCenter: IconAlignCenter,
  alignRight: IconAlignRight,
  alignJustify: IconAlignJustify,
  quote: IconBlockQuote,
  subscript: IconScriptSub,
  superscript: IconScriptSuper,
  indent: IconIndent,
  outdent: IconOutdent,
  paragraphFormat: IconDirectionRtl,
  clearFormatting: () => "FC",
  math: IconFormula,
  specialCharacters: () => "S",
  insertImage: IconImage,
  insertLink: () => "li",
  table: IconTable,
  undo: IconUndo,
  redo: IconRedo
};
