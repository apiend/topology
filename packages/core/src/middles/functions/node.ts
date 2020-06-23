import { Pen } from '../../models/pen';
import { Node } from '../../models/node';

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
