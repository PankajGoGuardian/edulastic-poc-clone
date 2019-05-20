import { Quill } from "react-quill";

import ContainBlot from "./ContainBlot";
import CellBreak from "./CellBreak";
import RowBreak from "./RowBreak";
import MathInputCmp from "../QuillMathEmbed";

const BlockEmbed = Quill.import("blots/block/embed");
const Container = Quill.import("blots/container");
const Block = Quill.import("blots/block");
const Parchment = Quill.import("parchment");

class TableCell extends ContainBlot {
  format = () => "td";

  optimize() {
    super.optimize();
    const { next, parent } = this;
    if (parent && parent.statics.blotName !== "tr") {
      this.processTR();
    }

    // merge same TD id
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

  static cleanEmptyChildren(blot) {
    if (!blot.children) return;
    let child = blot.children.tail;
    if (child === blot.children.head) return; // In case of only one element, don't do this.
    while (child) {
      if (child instanceof Block && child.domNode.innerHTML === "<br>") {
        // Check for empty children
        const childToRemove = child;
        child = child.prev;
        blot.removeChildren(childToRemove);
      } else {
        break;
      }
      child = child.prev;
    }
  }

  processTR() {
    // find next row break
    let currentBlot = this;
    const rowItems = [];
    let prevBlot = null;
    while (currentBlot) {
      if (currentBlot.statics.tagName !== "TD" && currentBlot.statics.name !== "MathInputCmp") {
        break;
      }
      if (
        !(currentBlot instanceof TableCell && prevBlot && prevBlot instanceof TableCell) &&
        !(currentBlot instanceof CellBreak && prevBlot && prevBlot instanceof CellBreak) &&
        !(currentBlot instanceof CellBreak && currentBlot.next && currentBlot.next instanceof RowBreak) &&
        !(currentBlot instanceof MathInputCmp)
      ) {
        rowItems.push(currentBlot);
      } else {
        const blotToRemove = currentBlot;
        prevBlot.next = currentBlot.next;
        currentBlot.next.prev = prevBlot;
        currentBlot = currentBlot.next;
        if (blotToRemove instanceof TableCell && prevBlot && prevBlot instanceof TableCell) {
          blotToRemove.moveChildren(prevBlot);
          blotToRemove.remove();
          TableCell.cleanEmptyChildren(prevBlot);
        } else if (blotToRemove instanceof MathInputCmp) {
          prevBlot.appendChild(blotToRemove);
        } else {
          blotToRemove.remove();
        }
        continue;
      }
      if (currentBlot instanceof RowBreak) {
        break;
      }
      TableCell.cleanEmptyChildren(currentBlot);
      prevBlot = currentBlot;
      currentBlot = currentBlot.next;
    }

    // create row, add row items as TDs
    // let prevItem;
    let cellItems = [];
    const cells = [];
    rowItems.forEach(rowItem => {
      cellItems.push(rowItem);
      if (rowItem instanceof TableCell) {
        // prevItem = rowItem;
      } else if (rowItem instanceof CellBreak) {
        cells.push(cellItems);
        cellItems = [];
      }
    });
    if (cellItems.length > 0) {
      cells.push(cellItems);
    }
    const mark = Parchment.create("block");
    this.parent.insertBefore(mark, this.next);

    // create row
    const row = Parchment.create("tr");
    cells.forEach(cell => {
      // add row elements
      cell.forEach(cellItem => {
        if (cellItem instanceof TableCell) {
          cellItem.domNode.classList.add(`ql-td-${cells.length}`);
        }
        row.appendChild(cellItem);
      });
    });
    row.replace(mark);
  }
}

TableCell.blotName = "td";
TableCell.tagName = "td";
TableCell.scope = Parchment.Scope.BLOCK_BLOT;
TableCell.defaultChild = "block";
TableCell.allowedChildren = [Block, BlockEmbed, Container];

export default TableCell;
