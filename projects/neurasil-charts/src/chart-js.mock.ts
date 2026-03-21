/**
 * Minimal Chart.js mock for the Karma/Jasmine test environment.
 * Replaces the real chart.js bundle via angular.json fileReplacements
 * so that Chart.register() and new Chart() do not fail in headless tests.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export class Chart {
  static register() {}
  static defaults = { font: {}, color: '' };
  static instances = {};
  data = {};
  options = {};
  destroy() {}
  update() {}
  render() {}
}

export const registerables = [];

export const ArcElement = {};
export const BarController = {};
export const BarElement = {};
export const CategoryScale = {};
export const DoughnutController = {};
export const Legend = {};
export const LinearScale = {};
export const LineController = {};
export const LineElement = {};
export const PieController = {};
export const PointElement = {};
export const Title = {};
export const Tooltip = {};

export default Chart;
