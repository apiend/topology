import { Point } from '../models/point';
import { Pen } from '../models/pen';
import { Node } from '../models/node';
import { Line } from '../models/line';
import { getBezierPoint } from '../middles/lines/curve';
import { Rect } from '../models/rect';

export function getRect(pens: Pen[]) {
  let x1 = 99999;
  let y1 = 99999;
  let x2 = -99999;
  let y2 = -99999;

  const points: Point[] = [];
  for (const item of pens) {
    if (item instanceof Node) {
      const pts = item.rect.toPoints();
      if (item.rotate) {
        for (const pt of pts) {
          pt.rotate(item.rotate, item.rect.center);
        }
      }
      points.push.apply(points, pts);
    } else if (item instanceof Line) {
      points.push(item.from);
      points.push(item.to);
      if (item.name === 'curve') {
        for (let i = 0.01; i < 1; i += 0.02) {
          points.push(getBezierPoint(i, item.from, item.controlPoints[0], item.controlPoints[1], item.to));
        }
      }
    }

  }

  for (const item of points) {
    if (x1 > item.x) {
      x1 = item.x;
    }
    if (y1 > item.y) {
      y1 = item.y;
    }
    if (x2 < item.x) {
      x2 = item.x;
    }
    if (y2 < item.y) {
      y2 = item.y;
    }
  }

  return new Rect(x1, y1, x2 - x1, y2 - y1);
}
