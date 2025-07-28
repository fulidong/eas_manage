const MIN = 0 // 最小値
const MAX = 100 // 最大値
const INCREMENTS_NUM = 1 // 增量
const incrementsObj = createIncrementsObj()

function createIncrementsObj() {
  const obj = {}
  let i = MIN
  while (MAX >= i) {
    obj[`${i}`] = `${i}px`
    i = i + INCREMENTS_NUM
  }
  return obj
}

module.exports = {
  none: '0px',
  full: '9999px',
  ...incrementsObj
}
