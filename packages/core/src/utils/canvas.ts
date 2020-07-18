import { Point } from '../models/point';
import { Pen } from '../models/pen';
import { Node } from '../models/node';

export function flatNodes(nodes: Pen[]): Node[] {
  const result: Node[] = [];

  for (const item of nodes) {
    if (item.type) {
      continue;
    }
    result.push(item as Node);
    if ((item as Node).children) {
      result.push.apply(result, flatNodes((item as Node).children));
    }
  }

  return result;
}

export function getParent(pens: Pen[], child: Node): Node {
  let parent: Node;
  for (const item of pens) {
    if (item.type) {
      continue;
    }
    if (!(item as Node).children) {
      continue;
    }

    for (const subItem of (item as Node).children) {
      if (subItem.id === child.id) {
        return item as Node;
      }

      if (subItem.type) {
        continue;
      }
      if ((subItem as Node).children) {
        parent = getParent((subItem as Node).children, child);
        if (parent) {
          return parent;
        }
      }
    }
  }

  return parent;
}


export function pointInRect(point: Point, vertices: Point[]): boolean {
  if (vertices.length < 3) {
    return false;
  }
  let isIn = false;

  let last = vertices[vertices.length - 1];
  for (const item of vertices) {
    if ((item.y < point.y && last.y >= point.y) || (item.y >= point.y && last.y < point.y)) {
      if (item.x + ((point.y - item.y) * (last.x - item.x)) / (last.y - item.y) > point.x) {
        isIn = !isIn;
      }
    }

    last = item;
  }

  return isIn;
}

export function pointInLine(point: Point, from: Point, to: Point): boolean {
  const points: Point[] = [
    new Point(from.x - 8, from.y - 8),
    new Point(to.x - 8, to.y - 8),
    new Point(to.x + 8, to.y + 8),
    new Point(from.x + 8, from.y + 8)
  ];

  return pointInRect(point, points);
}

export function lineLen(from: Point, to: Point): number {
  const len = Math.sqrt(Math.pow(Math.abs(from.x - to.x), 2) + Math.pow(Math.abs(from.y - to.y), 2));
  return len | 0;
}

export function curveLen(from: Point, cp1: Point, cp2: Point, to: Point): number {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${from.x} ${from.y} C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${to.x} ${to.y}`);
  return path.getTotalLength() | 0;
}
