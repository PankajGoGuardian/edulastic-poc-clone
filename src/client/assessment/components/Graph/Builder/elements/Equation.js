import { CONSTANT } from "../config";
import { fixApiLatex } from "../utils";
import { Area } from ".";

const jxgType = 98;

const defaultConfig = {
  fixed: true,
  strokeWidth: 2,
  highlightStrokeWidth: 2
};

function getColorParams(color) {
  return {
    fillColor: "transparent",
    strokeColor: color,
    highlightStrokeColor: color,
    highlightFillColor: "transparent"
  };
}

const EMPTY = 0;
const FINISHED = -1;
const VALID = 1;
const MAX_SPLIT = 32;
const RES_COARSE = 8;
const MAX_DEPTH = 4;
const T0101 = 5;

const equals = (x, y, eps) => {
  if (x === y) return true;
  return x - eps < y && y < x + eps;
};

class Node {
  constructor(elem, next, prev) {
    this.elem = elem;
    this.next = next;
    this.prev = prev;
  }

  detach() {
    this.next.prev = this.prev;
    this.prev.next = this.next;
    this.next = null;
    this.prev = null;
    this.elem = null;
  }
}

class LinkedList {
  constructor() {
    this.head = new Node(null, null, null);
    this.head.next = this.head;
    this.head.prev = this.head;
  }

  shift = () => {
    this.head.next.detach();
  };

  pop = () => {
    this.head.prev.detach();
  };

  push = e => {
    const node = new Node(e, this.head, this.head.prev);
    this.head.prev.next = node;
    this.head.prev = node;
  };

  unshift = e => {
    const node = new Node(e, this.head.next, this.head);
    this.head.next.prev = node;
    this.head.next = node;
  };

  merge = list => {
    if (list.isEmpty()) return;
    this.head.prev.next = list.head.next;
    list.head.next.prev = this.head.prev;
    list.head.prev.next = this.head;
    this.head.prev = list.head.prev;
    list.destroy();
  };

  isEmpty = () => this.head === this.head.next;

  destroy = () => {
    this.head = new Node(null, null, null);
  };

  toArray = () => {
    let node = this.head.next;
    const array = [];
    while (node !== this.head) {
      array.push(node.elem);
      node = node.next;
    }
    return array;
  };

  remove = current => {
    if (current instanceof Node) current.detach();
  };

  forEach = callback => {
    let current = this.head.next;
    let next;
    while (current !== this.head) {
      next = current.next;
      callback(current.elem, current);
      current = next;
    }
  };
}

class Point {
  constructor(x, y, lineTo) {
    this.x = x;
    this.y = y;
    this.lineTo = lineTo;
  }

  equals = p => equals(this.x, p.x, 1e-6) && equals(this.y, p.y, 1e-6);
}

class PointList {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.start.lineTo = false;
    this.end.lineTo = true;
    this.points = new LinkedList();
  }

  merge = list => {
    this.points.push(this.end);
    list.start.lineTo = true;
    this.points.push(list.start);
    this.end = list.end;
    if (list.points.length === 0) return;
    this.points.merge(list.points);
  };

  push = point => {
    point.lineTo = true;
    this.points.push(this.end);
    this.end = point;
  };

  unshift = point => {
    point.lineTo = false;
    this.start.lineTo = true;
    this.points.unshift(this.start);
    this.start = point;
  };
}

class Rectangle {
  constructor(func) {
    this.eval = [0, 0, 0, 0];
    this.rect = [0, 0, 0, 0];
    this.x = 0;
    this.y = 0;
    this.children = null;
    this.status = null;
    this.singular = false;
    this.func = func;
  }

  copy = r => {
    for (let i = 0; i < 4; i++) {
      this.eval[i] = r.eval[i];
      this.rect[i] = r.rect[i];
    }
    this.x = r.x;
    this.y = r.y;
    this.singular = r.singular;
  };

  set = (x, y, fx, fy, singular) => {
    this.x = x;
    this.y = y;
    this.rect[2] = fx;
    this.rect[3] = fy;
    this.singular = singular;
  };

  split = () => {
    if (this.children === null) {
      this.children = [];
      for (let i = 0; i < 4; i++) {
        this.children.push(new Rectangle(this.func));
      }
    }
    const r = this.children;
    const w2 = this.rect[2] * 0.5;
    const h2 = this.rect[3] * 0.5;
    for (let i = 0; i < 4; i++) {
      r[i].copy(this);
      r[i].rect[2] = w2;
      r[i].rect[3] = h2;
    }
    r[1].rect[0] += w2;
    r[2].rect[0] += w2;
    r[2].rect[1] += h2;
    r[3].rect[1] += h2;
    r[0].eval[1] = this.func(r[1].rect[0], r[1].rect[1]);
    r[0].eval[2] = this.func(r[2].rect[0], r[2].rect[1]);
    r[0].eval[3] = this.func(r[3].rect[0], r[3].rect[1]);
    r[1].eval[2] = this.func(r[2].rect[0] + w2, r[2].rect[1]);
    r[2].eval[3] = this.func(r[2].rect[0], r[2].rect[1] + h2);
    r[1].eval[0] = r[0].eval[1];
    r[1].eval[3] = r[0].eval[2];
    r[2].eval[0] = r[0].eval[2];
    r[2].eval[1] = r[1].eval[2];
    r[3].eval[0] = r[0].eval[3];
    r[3].eval[1] = r[0].eval[2];
    r[3].eval[2] = r[2].eval[3];
    return r;
  };

  x1 = () => this.rect[0];

  y1 = () => this.rect[1];

  x2 = () => this.rect[0] + this.rect[2];

  y2 = () => this.rect[1] + this.rect[3];
}

class Implicit {
  constructor(func, finish) {
    this.func = func;
    this.finish = finish;
    this.grid = null;
    this.temp = null;
    this.plotDepth = 0;
    this.segmentCheckDepth = 0;
    this.openList = [];
    this.segments = [];
    this.sw = 0;
    this.sh = 0;
    this.pts = [null, null];
    this.listThreshold = 16;
  }

  buildStatus = r => {
    let z = 0;
    let p = 0;
    let n = 0;
    let k = true;
    for (let i = 0; i < 4; i++) {
      if (!Number.isFinite(r.eval[i]) || Number.isNaN(r.eval[i])) {
        k = false;
        break;
      }
      if (r.eval[i] < 0.0) n++;
      else if (r.eval[i] > 0.0) p++;
      else z++;
    }
    r.status = { pos: p, neg: n, zero: z, valid: k, empty: !k || ((z + 1) | p | n) >= 4 };
  };

  interpolate = (p1, p2, fa, fb) => {
    const r = -fb / (fa - fb);
    if (r >= 0 && r <= 1) {
      return r * (p1 - p2) + p2;
    }
    return (p1 + p2) * 0.5;
  };

  createLine = (x1, y1, x2, y2) => {
    this.pts[0] = new Point(x1, y1, false);
    this.pts[1] = new Point(x2, y2, true);
    return VALID;
  };

  oppSign = (x, y) => x * y < 0.0;

  abortList = () => {
    for (let i = 0; i < this.openList.length; i++) {
      this.segments.push(this.openList[i].start);
      this.segments = this.segments.concat(this.openList[i].points.toArray());
      this.segments.push(this.openList[i].end);
    }
    this.openList = [];
  };

  create = r => {
    if (r.status.empty) return EMPTY;
    const zer = r.status.zero;
    const { neg } = r.status;
    const { pos } = r.status;
    if (((zer + 1) | neg | pos) >= 4) {
      return EMPTY;
    }

    const x1 = r.x1();
    const x2 = r.x2();
    const y1 = r.y1();
    const y2 = r.y2();
    const tl = r.eval[0];
    const tr = r.eval[1];
    const br = r.eval[2];
    const bl = r.eval[3];
    let k = 0;

    switch (zer) {
      case 0:
        //if (neg === pos && !this.oppSign(tl, br)) return T0101;

        if (neg === pos && tl > 10) return T0101;
        if (neg === pos && tr > 10) return T0101;
        if (neg === pos && br > 10) return T0101;
        if (neg === pos && bl > 10) return T0101;

        if (this.oppSign(tl, tr)) this.pts[k++] = new Point(this.interpolate(x1, x2, tl, tr), y1, k !== 0);
        if (this.oppSign(tr, br)) this.pts[k++] = new Point(x2, this.interpolate(y1, y2, tr, br), k !== 0);
        if (this.oppSign(br, bl)) this.pts[k++] = new Point(this.interpolate(x1, x2, bl, br), y2, k !== 0);
        if (this.oppSign(bl, tl)) this.pts[k++] = new Point(x1, this.interpolate(y1, y2, tl, bl), k !== 0);
        return VALID;
      case 1:
        if (neg === 3 || pos === 3) {
          if (tl === 0.0) return this.createLine(x1, y1, x1, y1);
          if (tr === 0.0) return this.createLine(x2, y1, x2, y1);
          if (bl === 0.0) return this.createLine(x1, y2, x2, y2);
          if (br === 0.0) return this.createLine(x2, y2, x2, y2);
        }
        if (tl === 0.0) {
          if (this.oppSign(bl, br)) return this.createLine(x1, y1, this.interpolate(x1, x2, bl, br), y2);
          if (this.oppSign(tr, br)) return this.createLine(x1, y1, x2, this.interpolate(y1, y1, tr, br));
          return EMPTY;
        }
        if (tr === 0.0) {
          if (this.oppSign(bl, br)) return this.createLine(this.interpolate(x1, x2, bl, br), y2, x2, y1);
          if (this.oppSign(bl, tl)) return this.createLine(x1, this.interpolate(y1, y2, tl, bl), x2, y1);
          return EMPTY;
        }
        if (br === 0.0) {
          if (this.oppSign(tl, tr)) return this.createLine(this.interpolate(x1, x2, tl, tr), y1, x2, y2);
          if (this.oppSign(tl, bl)) return this.createLine(x1, this.interpolate(y1, y2, tl, bl), x2, y2);
          return EMPTY;
        }
        if (bl === 0.0) {
          if (this.oppSign(tl, tr)) return this.createLine(x1, y2, this.interpolate(x1, x2, tl, tr), y1);
          if (this.oppSign(tr, br)) return this.createLine(x1, y2, x2, this.interpolate(y1, y2, tr, br));
          return EMPTY;
        }
        return EMPTY;
      case 2:
        if (pos === 2 || neg === 2) {
          if (tl === 0.0) {
            if (tr === 0.0) return this.createLine(x1, y1, x2, y1);
            if (bl === 0.0) return this.createLine(x1, y1, x1, y2);
          } else if (br === 0.0) {
            if (tr === 0.0) return this.createLine(x2, y1, x2, y2);
            if (bl === 0.0) return this.createLine(x1, y2, x2, y2);
          }
        } else {
          if (tr === 0.0 && bl === 0.0) return this.createLine(x1, y2, x2, y1);
          if (tl === 0.0 && br === 0.0) return this.createLine(x1, y1, x2, y2);
        }
        return EMPTY;
      default:
        return EMPTY;
    }
  };

  append = r => {
    const cfg = this.create(r);
    if (cfg === VALID) {
      if (this.pts[0].x > this.pts[1].x) {
        const temp = this.pts[0];
        this.pts[0] = this.pts[1];
        this.pts[1] = temp;
      }
      let inx1 = -1;
      let inx2 = -1;

      for (let i = 0; i < this.openList.length; i++) {
        if (this.pts[1].equals(this.openList[i].start)) {
          inx1 = i;
          break;
        }
      }

      for (let i = 0; i < this.openList.length; i++) {
        if (this.pts[0].equals(this.openList[i].end)) {
          inx2 = i;
          break;
        }
      }

      if (inx1 !== -1 && inx2 !== -1) {
        this.openList[inx2].merge(this.openList[inx1]);
        this.openList.splice(inx1, 1);
      } else if (inx1 !== -1) {
        this.openList[inx1].unshift(this.pts[0]);
      } else if (inx2 !== -1) {
        this.openList[inx2].push(this.pts[1]);
      } else {
        this.openList.push(new PointList(this.pts[0], this.pts[1]));
      }
      if (this.openList.length > this.listThreshold) {
        this.abortList();
      }
    }
    return cfg;
  };

  update = (x1, y1, x2, y2, px, py, fast) => {
    x1 -= (0.25 * Math.PI) / px;
    if (fast) {
      this.sw = 8;
      this.sh = 8;
    } else {
      let valW = Math.max(Math.abs(Math.round(x1)), Math.abs(Math.round(x2)));
      let valH = Math.max(Math.abs(Math.round(y1)), Math.abs(Math.round(y2)));

      let valW2 = Math.ceil(valW / 5);
      let valH2 = Math.ceil(valH / 5);

      let valW3 = Math.pow(2, 4 + valW2);
      let valH3 = Math.pow(2, 4 + valH2);

      valW3 = valW3 > 1000 ? 1000 : valW3;
      valH3 = valH3 > 1000 ? 1000 : valH3;

      this.sw = valH3;
      this.sh = valW3;
    }
    if (this.sw === 0 || this.sh === 0) {
      return;
    }
    if (this.grid === null || this.grid.length !== this.sh || this.grid[0].length !== this.sw) {
      this.grid = [];
      for (let i = 0; i < this.sh; i++) {
        const col = [];
        for (let j = 0; j < this.sw; j++) {
          col.push(new Rectangle(this.func));
        }
        this.grid.push(col);
      }
    }

    if (this.temp === null) {
      this.temp = new Rectangle(this.func);
    }

    const w = x2 - x1;
    const h = y2 - y1;
    let cur;
    let prev;
    const frx = w / this.sw;
    const fry = h / this.sh;
    const vertices = [];
    const xcoords = [];
    const ycoords = [];

    for (let i = 0; i <= this.sw; i++) {
      xcoords.push(x1 + i * frx);
    }

    for (let i = 0; i <= this.sh; i++) {
      ycoords.push(y1 + i * fry);
    }

    for (let i = 0; i <= this.sw; i++) {
      vertices.push(this.func(xcoords[i], ycoords[0]));
    }

    let i;
    let j;

    for (i = 1; i <= this.sh; i++) {
      prev = this.func(xcoords[0], ycoords[i]);
      for (j = 1; j <= this.sw; j++) {
        cur = this.func(xcoords[j], ycoords[i]);
        const rect = this.grid[i - 1][j - 1];
        rect.set(j - 1, i - 1, frx, fry, false);
        rect.rect[0] = xcoords[j - 1];
        rect.rect[1] = ycoords[i - 1];
        rect.eval[0] = vertices[j - 1];
        rect.eval[1] = vertices[j];
        rect.eval[2] = cur;
        rect.eval[3] = prev;
        rect.status = this.buildStatus(rect);
        vertices[j - 1] = prev;
        prev = cur;
      }
      vertices[this.sw] = prev;
    }

    this.plotDepth = 2;
    this.segmentCheckDepth = 1;
    this.listThreshold = 48;

    for (i = 0; i < this.sh; i++) {
      for (j = 0; j < this.sw; j++) {
        if (!this.grid[i][j].singular && this.grid[i][j].status !== EMPTY) {
          this.temp.copy(this.grid[i][j]);
          this.plot(this.temp, 0);
          this.grid[i][j].status = FINISHED;
        }
      }
    }

    for (let k = 0; k < 4; k++) {
      for (i = 0; i < this.sh; i++) {
        for (j = 0; j < this.sw; j++) {
          if (this.grid[i][j].singular && this.grid[i][j].status !== FINISHED) {
            this.temp.copy(this.grid[i][j]);
            this.plot(this.temp, 0);
            this.grid[i][j].status = FINISHED;
          }
        }
      }
    }
    this.abortList();
    this.finish(this.segments);
  };

  makeTree = (r, d) => {
    const children = r.split();
    this.plot(children[0], d);
    this.plot(children[1], d);
    this.plot(children[2], d);
    this.plot(children[3], d);
  };

  plot = (r, d) => {
    if (d < this.segmentCheckDepth) {
      this.makeTree(r, d + 1);
      return;
    }
    this.buildStatus(r);
    if (!r.status.empty) {
      if (d >= this.plotDepth) {
        if (this.append(r, d === MAX_DEPTH) === T0101 && d < MAX_DEPTH) {
          this.makeTree(r, d + 1);
        }
      } else {
        this.makeTree(r, d + 1);
      }
    }
  };
}

class CanvasPlotter {
  constructor(board, latex, id, params) {
    this.board = board;

    this.func = this.board.jc.snippet(latex, true, ["x", "y"], false); // (x,y) => Math.abs(x) + Math.abs(y) - 6;
    this.params = params;
    this.id = id;

    const [xMin, yMax, xMax, yMin] = this.board.getBoundingBox();
    this.x1 = xMin;
    this.x2 = xMax;
    this.y1 = yMin;
    this.y2 = yMax;
    this.px = 300;
    this.py = 300;
    this.tx = 0;
    this.ty = 0;
    this.working = false;
    this.result = null;
  }

  finish = segments => {
    this.board.create("transform", [-this.x1 * this.tx, this.y2 * this.ty], { type: "translate" });
    this.board.create("transform", [this.tx, -this.ty], { type: "scale" });

    let xs = [];
    let ys = [];
    let s = null;
    const parents = [];

    for (let i = 0; i < segments.length; i++) {
      s = segments[i];
      if (!s.lineTo && xs.length) {
        parents.push(this.board.create("curve", [xs, ys], this.params));
        xs = [];
        ys = [];
      }

      xs.push(segments[i].x);
      ys.push(segments[i].y);
    }
    if (xs.length) {
      this.result = this.board.create("curve", [xs, ys], { ...this.params, id: this.id });
      this.result.addParents(parents);
    }
  };

  update = (fast = false) => {
    this.px = this.board.canvasWidth;
    this.py = this.board.canvasHeight;
    this.tx = this.px / (this.x2 - this.x1);
    this.ty = this.py / (this.y2 - this.y1);
    this.plot = new Implicit(this.func, this.finish);
    this.plot.update(this.x1, this.y1, this.x2, this.y2, this.px, this.py, fast);
  };
}

function create(board, object) {
  const { latex, id, label, apiLatex, priorityColor } = object;

  const elementWithErrorLatex = {
    type: jxgType,
    id,
    latex,
    labelHTML: label,
    latexIsBroken: true,
    apiLatex: null
  };

  if (!apiLatex) {
    return elementWithErrorLatex;
  }

  let line = null;

  const fixedLatex = fixApiLatex(apiLatex);

  let dash;
  if (fixedLatex.compSign === "<" || fixedLatex.compSign === ">") {
    dash = 2;
  }

  try {
    const cv = new CanvasPlotter(board.$board, fixedLatex.latexFunc, id, {
      ...defaultConfig,
      ...getColorParams(priorityColor || "#00b2ff"),
      dash
    });
    cv.update();
    line = cv.result;
  } catch (ex) {
    return elementWithErrorLatex;
  }

  if (!line) {
    return elementWithErrorLatex;
  }

  line.latex = latex;
  line.fixedLatex = fixedLatex;
  line.type = jxgType;
  line.apiLatex = apiLatex;

  Area.setAreaForEquation(board, line);

  return line;
}

function getConfig(equation) {
  return {
    _type: equation.type,
    type: CONSTANT.TOOLS.EQUATION,
    id: equation.id,
    latex: equation.latex,
    label: equation.labelHTML || false,
    pointsLabel: equation.pointsLabel || false,
    apiLatex: equation.apiLatex
    //testPoints: equation.testPoints
  };
}

export default {
  jxgType,
  getConfig,
  create
};
