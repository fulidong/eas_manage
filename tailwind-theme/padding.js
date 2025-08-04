const MIN = 0 // 最小値
const MAX = 500 // 最大値
const INCREMENTS_NUM = 1 // 增量
const incrementsObj = createIncrementsObj()

const OTHER_OBJ = {}

const padding = Object.assign(incrementsObj, OTHER_OBJ)

function createIncrementsObj() {
  const obj = {}
  let i = MIN
  while (MAX >= i) {
    obj[`${i}`] = `${i}px`
    i = i + INCREMENTS_NUM
  }
  return obj
}

module.exports = padding
