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
