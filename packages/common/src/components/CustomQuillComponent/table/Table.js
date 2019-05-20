import { Quill } from "react-quill";

const Container = Quill.import("blots/container");
const Parchment = Quill.import("parchment");

class Table extends Container {
  optimize() {
    super.optimize();
    const { next } = this;
    if (
      next &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      next.domNode.tagName === this.domNode.tagName
    ) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

Table.blotName = "table";
Table.tagName = "table";
Table.scope = Parchment.Scope.BLOCK_BLOT;
Table.defaultChild = "tr";
Table.className = "quill-table";

export default Table;
