import round from 'lodash/round'
import floor from 'lodash/floor'

/**
 * Правильный способ расчёта НДС из цены и количества:
 * сперва вычислить цену без НДС из простой цены,
 * округлить, а потом умножать на количество
 *
 * @param {object}
 * @returns {object}
 * @private
 */
const _calcCorrectly = ({amount, price, ndsValue, roundMethod, precision}) => {
  let priceWithoutNds = roundMethod === 'floor'
    ? floor(price / (1 + ndsValue), precision)
    : round(price / (1 + ndsValue), precision)
  let totalWithoutNds = amount * priceWithoutNds
  let total = round(totalWithoutNds * (1 + ndsValue), precision)
  let totalNdsOnly = round(total - totalWithoutNds, precision)
  return {total, totalNdsOnly, totalWithoutNds, priceWithoutNds}
}

/**
 * Неправильный способ расчёта НДС из цены и количества:
 * сперва умножением простой цены на количество вычисляется сумма с НДС,
 * а потом из неё рассчитывается цена без НДС
 *
 * @param {object}
 * @returns {object}
 * @private
 */
const _calcIncorrectly = ({amount, price, ndsValue, precision}) => {
  let total = amount * price
  let totalWithoutNds = round(total / (1 + ndsValue), precision)
  let totalNdsOnly = round(total - totalWithoutNds, precision)
  let priceWithoutNds = round(totalWithoutNds / amount, precision)
  return {total, totalNdsOnly, totalWithoutNds, priceWithoutNds}
}

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
export default params => {
  if (params.price < 0) return {
    total: 0,
    totalNdsOnly: 0,
    totalWithoutNds: 0,
    priceWithoutNds: 0
  }
  if (!params.roundMethod) params.roundMethod = 'floor'
  if (typeof params.precision === 'undefined') params.precision = 2

  return params.ndsCalcCorrectWay === false
    ? _calcIncorrectly(params)
    : _calcCorrectly(params)
}
