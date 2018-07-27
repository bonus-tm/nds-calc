import round from 'lodash/round'
import floor from 'lodash/floor'

/**
 * Правильный способ расчёта НДС:
 * сперва вычислить цену без НДС из простой цены,
 * округлить, а потом умножать на количество
 *
 * @param {object}
 * @returns {object}
 */
const calcCorrectly = ({amount, price, ndsValue, roundMethod, precision}) => {
  let priceWithoutNds = roundMethod === 'floor'
    ? floor(price / (1 + ndsValue), precision)
    : round(price / (1 + ndsValue), precision)
  let totalWithoutNds = amount * priceWithoutNds
  let total = round(totalWithoutNds * (1 + ndsValue), precision)
  let totalNdsOnly = round(total - totalWithoutNds, precision)
  return {total, totalNdsOnly, totalWithoutNds, priceWithoutNds}
}

/**
 * Неправильный способ:
 * сперва умножением простой цены на количество вычисляется сумма с НДС,
 * а потом из неё рассчитывается цена без НДС
 *
 * @param {object}
 * @returns {object}
 */
const calcIncorrectly = ({amount, price, ndsValue, precision}) => {
  let total = amount * price
  let totalWithoutNds = round(total / (1 + ndsValue), precision)
  let totalNdsOnly = round(total - totalWithoutNds, precision)
  let priceWithoutNds = round(totalWithoutNds / amount, precision)
  return {total, totalNdsOnly, totalWithoutNds, priceWithoutNds}
}

/**
 * Выбор способа расчёта
 * Возвращает набор значений:
 *  total — сумма с НДС
 *  totalNdsOnly — сумма только НДС
 *  totalWithoutNds — сумма без НДС
 *  priceWithoutNds — цена единицы товара без НДС
 *
 * @param {Object} ndsOptions
 *  {Number} amount — количество
 *  {Number} price — цена с НДС
 *  {Number} ndsValue — значение НДС (0.18)
 *  {String} roundMethod — способ округления копеек ('floor' либо 'round')
 *  {Number} precision — до какого знака округлять при расчётах (до копеек, 2)
 *  {Boolean} ndsCalcCorrectWay — использовать правильный или нет способ расчёта НДС
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */
export default ({
                  amount,
                  price,
                  ndsValue,
                  roundMethod = 'floor',
                  precision = 2,
                  ndsCalcCorrectWay = true
                }) => {
  if (price < 0) return {
    total: 0,
    totalNdsOnly: 0,
    totalWithoutNds: 0,
    priceWithoutNds: 0
  }
  return ndsCalcCorrectWay
    ? calcCorrectly({amount, price, ndsValue, roundMethod, precision})
    : calcIncorrectly({amount, price, ndsValue, roundMethod, precision})
}
