'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _round = require('lodash/round');

var _round2 = _interopRequireDefault(_round);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Правильный способ расчёта НДС:
 * сперва вычислить цену без НДС, округлить, а потом умножать на количество
 *
 * @param row
 * @param ndsValue
 * @param precision
 * @returns {{total, totalNdsOnly: number, totalWithoutNds: number, priceWithoutNds}}
 */
const calcCorrectly = (row, ndsValue, precision) => {
  let priceWithoutNds = (0, _round2.default)(row.price / (1 + ndsValue), precision);
  let totalWithoutNds = row.amount * priceWithoutNds;
  let total = (0, _round2.default)(totalWithoutNds * (1 + ndsValue), precision);
  let totalNdsOnly = total - totalWithoutNds;
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Неправильный способ:
 * сперва вычисляется сумма с НДС, а потом из неё цена без НДС
 *
 * @param row
 * @param ndsValue
 * @param precision
 * @returns {{total: number, totalNdsOnly: number, totalWithoutNds, priceWithoutNds}}
 */
const calcIncorrectly = (row, ndsValue, precision) => {
  let total = row.amount * row.price;
  let totalWithoutNds = (0, _round2.default)(total / (1 + ndsValue), precision);
  let totalNdsOnly = total - totalWithoutNds;
  let priceWithoutNds = (0, _round2.default)(totalWithoutNds / row.amount, precision);
  return { total, totalNdsOnly, totalWithoutNds, priceWithoutNds };
};

/**
 * Выбор способа расчёта
 *
 * @param row
 * @param ndsValue
 * @param precision
 * @param correctWay
 * @returns {*}
 */

exports.default = (row, ndsValue, precision = 2, correctWay = true) => {
  return correctWay ? calcCorrectly(row, ndsValue, precision) : calcIncorrectly(row, ndsValue, precision);
};
