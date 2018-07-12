'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _round = require('lodash/round');

var _round2 = _interopRequireDefault(_round);

var _floor = require('lodash/floor');

var _floor2 = _interopRequireDefault(_floor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Правильный способ расчёта НДС:
 * сперва вычислить цену без НДС из простой цены,
 * округлить, а потом умножать на количество
 *
 * @param {object}
 * @returns {object}
 */
const calcCorrectly = ({ amount, price, ndsValue, roundMethod, precision }) => {
  let priceWithoutNds = roundMethod === 'floor' ? (0, _floor2.default)(price / (1 + ndsValue), precision) : (0, _round2.default)(price / (1 + ndsValue), precision);
  let totalWithoutNds = amount * priceWithoutNds;
  let total = (0, _round2.default)(totalWithoutNds * (1 + ndsValue), precision);
  let totalNdsOnly = (0, _round2.default)(total - totalWithoutNds);
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Неправильный способ:
 * сперва умножением простой цены на количество вычисляется сумма с НДС,
 * а потом из неё рассчитывается цена без НДС
 *
 * @param {object}
 * @returns {object}
 */
const calcIncorrectly = ({ amount, price, ndsValue, precision }) => {
  let total = amount * price;
  let totalWithoutNds = (0, _round2.default)(total / (1 + ndsValue), precision);
  let totalNdsOnly = (0, _round2.default)(total - totalWithoutNds);
  let priceWithoutNds = (0, _round2.default)(totalWithoutNds / amount, precision);
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Выбор способа расчёта
 * Возвращает набор значений:
 *  total — сумма с НДС
 *  totalNdsOnly — сумма только НДС
 *  totalWithoutNds — сумма без НДС
 *  priceWithoutNds — цена единицы товара без НДС
 *
 * @param {object}
 *  {number} amount — количество
 *  {number} price — цена с НДС
 *  {number} ndsValue — значение НДС (0.18)
 *  {string} roundMethod — способ округления копеек ('floor' либо 'round')
 *  {number} precision — до какого знака округлять при расчётах (до копеек, 2)
 *  {boolean} correctWay — использовать правильный или нет способ расчёта НДС
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */

exports.default = ({
  amount,
  price,
  ndsValue,
  roundMethod = 'floor',
  precision = 2,
  correctWay = true
}) => {
  return correctWay ? calcCorrectly({ amount, price, ndsValue, roundMethod, precision }) : calcIncorrectly({ amount, price, ndsValue, roundMethod, precision });
};
