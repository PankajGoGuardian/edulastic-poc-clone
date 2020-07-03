class MathTool {
  constructor({ ctx, doneFn }) {
    this.ctx = ctx;
    this.doneFn = doneFn || this.doneFn;
  }

  doneFn = nodeid => nodeid;

  leave() {
    this.ctx.redraw();
  }

  addLatex(mathHtml, fontColor, fontSize) {
    const mathNodeStyle = {
      top: this.top,
      left: this.left,
      "z-index": 1,
      color: fontColor,
      "font-size": `${fontSize}px`,
      position: "absolute"
    };

    this.ctx.begin();
    this.ctx.createHTMLNode("MathNode", {
      htmlStr: mathHtml,
      style: mathNodeStyle
    });
    this.ctx.commit();
    this.doneFn();
  }

  onMouseClick(x, y) {
    this.left = x;
    this.top = y;
  }
}

export default MathTool;
