const MIN_HEIGHT = 0 // 最小値
const MAX_HEIGHT = 1000 // 最大値
const INCREMENTS_NUM = 1 // 增量
const incrementsObj = createIncrementsObj()

const height = Object.assign(incrementsObj, {
  auto: 'auto',
  full: '100%',
  screen: '100vh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content'
})

function createIncrementsObj() {
  const obj = {}
  let i = MIN_HEIGHT
  while (MAX_HEIGHT >= i) {
    obj[`${i}`] = `${i}px`
    i = i + INCREMENTS_NUM
  }
  return obj
}

module.exports = height
