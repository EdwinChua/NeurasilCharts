/**
 * Minimal Chart.js mock for the Karma/Jasmine test environment.
 * Replaces the real chart.js ESM bundle via angular.json fileReplacements.
 */

export class Chart {
  static register() {}
  static defaults = { font: {}, color: '', plugins: {} };
  static instances = {};
  destroy() {}
  update() {}
}

export const registerables = [];
export const defaults = { font: {}, color: '', plugins: {} };

export const ArcElement = {};
export const BarController = {};
export const BarElement = {};
export const CategoryScale = {};
export const DoughnutController = {};
export const Element = {};
export const Legend = {};
export const LinearScale = {};
export const LineController = {};
export const LineElement = {};
export const LogarithmicScale = {};
export const PieController = {};
export const PointElement = {};
export const RadialLinearScale = {};
export const ScatterController = {};
export const TimeScale = {};
export const Title = {};
export const Tooltip = {};

export default Chart;

// helpers (used by chartjs-plugin-datalabels)
export const toPadding = () => ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
export const valueOrDefault = (value, defaultValue) => value === undefined ? defaultValue : value;
export const callback = (fn, args, thisArg) => fn && fn.apply(thisArg, args);
export const isObject = (value) => value !== null && typeof value === 'object';
export const each = (loopable, fn, thisArg) => { if (Array.isArray(loopable)) loopable.forEach(fn, thisArg); };
