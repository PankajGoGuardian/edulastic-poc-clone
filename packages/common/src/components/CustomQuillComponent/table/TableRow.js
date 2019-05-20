import { Quill } from "react-quill";

const Container = Quill.import("blots/container");
const Parchment = Quill.import("parchment");

class TableRow extends Container {
  static create() {
    const tagName = "tr";
    const node = super.create(tagName);
    return node;
  }

  optimize() {
    super.optimize();
    const { parent } = this;
    if (parent && parent.statics.blotName !== "table") {
      this.processTable();
    }
  }

  processTable() {
    let currentBlot = this;
    const rows = [];
    while (currentBlot) {
      if (!(currentBlot instanceof TableRow)) {
        break;
      }
      rows.push(currentBlot);
      currentBlot = currentBlot.next;
    }
    const mark = Parchment.create("block");
    this.parent.insertBefore(mark, this.next);
    const newTable = Parchment.create("table");
    rows.forEach(row => {
      newTable.appendChild(row);
    });
    newTable.replace(mark);
  }
}

TableRow.blotName = "tr";
TableRow.tagName = "tr";
TableRow.scope = Parchment.Scope.BLOCK_BLOT;
TableRow.defaultChild = "td";

export default TableRow;
