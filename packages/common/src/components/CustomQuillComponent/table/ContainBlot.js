import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");
const Container = Quill.import("blots/container");
const Block = Quill.import("blots/block");
const Parchment = Quill.import("parchment");

class ContainBlot extends Container {
  static create() {
    const tagName = "contain";
    const node = super.create(tagName);
    return node;
  }

  insertBefore(blot, ref) {
    try {
      if (blot.statics.blotName === this.statics.blotName) {
        super.insertBefore(blot.children.head, ref);
      } else {
        super.insertBefore(blot, ref);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static formats(domNode) {
    return domNode.tagName;
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]: this.statics.formats(this.domNode) };
  }

  replace(target) {
    if (target.statics.blotName !== this.statics.blotName) {
      const item = Parchment.create(this.statics.defaultChild);
      target.moveChildren(item);
      this.appendChild(item);
    }
    if (!target.parent) return;
    super.replace(target);
  }
}

ContainBlot.blotName = "contain";
ContainBlot.tagName = "contain";
ContainBlot.scope = Parchment.Scope.BLOCK_BLOT;
ContainBlot.defaultChild = "block";
ContainBlot.allowedChildren = [Block, BlockEmbed, Container];

export default ContainBlot;
