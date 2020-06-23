import { registerNode, loadJS } from '@topology/core';
import {
  echarts,
  echartsData
} from './echarts';

export function register(_echarts?: any) {
  echartsData.echarts = _echarts;
  if (!echartsData.echarts && !(window as any).echarts) {
    loadJS('https://cdn.bootcdn.net/ajax/libs/echarts/4.8.0/echarts.min.js', null, true);
  }
  registerNode('echarts', echarts, null, null, null);
}
