// eg text-10
const MIN_SIZE = 8 // 最小値
const MAX_SIZE = 100 // 最大値
const INCREMENTS_NUM = 1 // 增量

const fontSize = {
  sm: ['14px', '21px'],
  md: ['16px', '24px'],
  lg: ['20px', '30px'],
  xl: ['24px', '36px']
}

let i = MIN_SIZE
while (MAX_SIZE >= i) {
  fontSize[`${i}`] = `${i}px`
  i = i + INCREMENTS_NUM
}

module.exports = fontSize
