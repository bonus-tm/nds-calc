import round from 'lodash/round'

/**
 * Правильный способ расчёта НДС:
 * сперва вычислить цену без НДС, округлить, а потом умножать на количество
 *
 * @param {object} row {amount, price} — required fields are 'amount' and 'price'
 * @param {number} ndsValue — 0.18
 * @param {number} precision — default 2
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */
const calcCorrectly = (row, ndsValue, precision) => {
  let priceWithoutNds = round(row.price / (1 + ndsValue), precision)
  let totalWithoutNds = row.amount * priceWithoutNds
  let total = round(totalWithoutNds * (1 + ndsValue), precision)
  let totalNdsOnly = total - totalWithoutNds
  return {total, totalNdsOnly, totalWithoutNds, priceWithoutNds}
}

/**
 * Неправильный способ:
 * сперва вычисляется сумма с НДС, а потом из неё цена без НДС
 *
 * @param {object} row {amount, price} — required fields are 'amount' and 'price'
 * @param {number} ndsValue — 0.18
 * @param {number} precision — default 2
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */
const calcIncorrectly = (row, ndsValue, precision) => {
  let total = row.amount * row.price
  let totalWithoutNds = round(total / (1 + ndsValue), precision)
  let totalNdsOnly = total - totalWithoutNds
  let priceWithoutNds = round(totalWithoutNds / row.amount, precision)
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
 * @param {object} row {amount, price} — required fields are 'amount' and 'price'
 * @param {number} ndsValue — 0.18
 * @param {number} precision — default 2
 * @param {boolean} correctWay — использовать правильный или нет способ расчёта НДС
 * @returns {{total, totalNdsOnly, totalWithoutNds, priceWithoutNds}}
 */
export default (row, ndsValue, precision = 2, correctWay = true) => {
  return correctWay
    ? calcCorrectly(row, ndsValue, precision)
    : calcIncorrectly(row, ndsValue, precision)
}
