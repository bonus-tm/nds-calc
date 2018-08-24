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
 * Правильный способ расчёта НДС из цены и количества:
 * сперва вычислить цену без НДС из простой цены,
 * округлить, а потом умножать на количество
 *
 * @param {object}
 * @returns {object}
 * @private
 */
const _calcCorrectly = ({ amount, price, ndsValue, roundMethod, precision }) => {
  let priceWithoutNds = roundMethod === 'floor' ? (0, _floor2.default)(price / (1 + ndsValue), precision) : (0, _round2.default)(price / (1 + ndsValue), precision);
  let totalWithoutNds = amount * priceWithoutNds;
  let total = (0, _round2.default)(totalWithoutNds * (1 + ndsValue), precision);
  let totalNdsOnly = (0, _round2.default)(total - totalWithoutNds, precision);
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Неправильный способ расчёта НДС из цены и количества:
 * сперва умножением простой цены на количество вычисляется сумма с НДС,
 * а потом из неё рассчитывается цена без НДС
 *
 * @param {object}
 * @returns {object}
 * @private
 */
const _calcIncorrectly = ({ amount, price, ndsValue, precision }) => {
  let total = amount * price;
  let totalWithoutNds = (0, _round2.default)(total / (1 + ndsValue), precision);
  let totalNdsOnly = (0, _round2.default)(total - totalWithoutNds, precision);
  let priceWithoutNds = (0, _round2.default)(totalWithoutNds / amount, precision);
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Из цены с НДС, количества и параметров получает значения
 *  total — сумма с НДС
 *  totalNdsOnly — сумма только НДС
 *  totalWithoutNds — сумма без НДС
 *  priceWithoutNds — цена единицы товара без НДС
 *
 * @param {Object} params
 * @param {Boolean} params.ndsCalcCorrectWay — использовать ли правильный способ
 * @param {Number} params.amount — количество
 * @param {Number} params.price — цена с НДС
 * @param {Number} params.ndsValue — значение НДС (0.18)
 * @param {String} params.roundMethod — способ округления копеек ('floor' либо 'round')
 * @param {Number} params.precision — до какого знака округлять при расчётах (до копеек, 2)
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */

exports.default = params => {
  if (params.price < 0) return {
    total: 0,
    totalNdsOnly: 0,
    totalWithoutNds: 0,
    priceWithoutNds: 0
  };
  if (!params.roundMethod) params.roundMethod = 'floor';
  if (typeof params.precision === 'undefined') params.precision = 2;

  return params.ndsCalcCorrectWay === false ? _calcIncorrectly(params) : _calcCorrectly(params);
};
