
const colors = require('./colors')
const fontSize = require('./fontSize')
const height = require('./height')
const width = require('./width')
const margin = require('./margin')
const padding = require('./padding')
const lineHeight = require('./lineHeight')
const borderRadius = require('./borderRadius')
const animation = require('./animation')
const keyframes = require('./keyframes')
const extend = require('./extend')
const percent = {
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%'
}

module.exports = {
  colors,
  fontSize,
  height,
  width,
  margin,
  padding,
  lineHeight,
  borderRadius,
  animation,
  keyframes,
  maxWidth: (theme) => ({
    ...theme('spacing'),
    auto: 'auto',
    full: '100%',
    screen: '100vw',
    min: 'min-content',
    max: 'max-content',
    ...percent
  }),
  minWidth: (theme) => ({
    ...theme('spacing'),
    auto: 'auto',
    full: '100%',
    ...percent
  }),
  maxHeight: (theme) => ({
    ...theme('spacing'),
    auto: 'auto',
    full: '100%',
    screen: '100vh',
    ...percent
  }),
  minHeight: (theme) => ({
    ...theme('spacing'),
    auto: 'auto',
    full: '100%',
    screen: '100vh',
    ...percent
  }),
  boxShadow: {
    inner1: 'inset 0px -1px 0px',
    none: '0 0 #0000'
  },
  flex: {
    1: '1 1 0%',
    auto: '1 1 auto',
    initial: '0 1 auto',
    none: 'none'
  },
  flexBasis: {
    auto: 'auto',
    full: '100%',
    ...percent
  },
  flexGrow: {
    0: '0',
    DEFAULT: '1'
  },
  flexShrink: {
    0: '0',
    DEFAULT: '1'
  },
  spacing: Array.from({ length: 2000 }).reduce((map, _, index) => {
    map[index] = `${index}px`
    return map
  }, {}),
  screens: {
    lg: { max: '1199px' }, // <= 1199
    md: { max: '999px' }, // <= 999
    sm: { max: '799px' }, // <= 799
    xs: { max: '576px' }, // <= 576
    // 以下字段适用于页面版心
    mainXl: '1200px', // >= 1200
    mainLg: { min: '1000px', max: '1199px' },
    mainMd: { min: '800px', max: '999px' },
    // 以下字段适用于部分页面
    detailsPC: { max: '1760px' }, // 券商详情页当屏幕宽度小于1760px时需要隐藏右侧菜单栏
    xxs: { max: '375px' } // 券商详情页当屏幕宽度小于375px时显示一条天眼实勘数据
  },
  extend: {
    fontFamily: {
      impact: ['Montserrat'],
      din: ['DIN'],
      dinbold: ['DIN-Medium'],
      light: ['DIN-Light'],
      pingfang: ['PingFang SC'],
      arial: ['Arial'],
      blackItalic: ['DIN-BlackItalic'],
      gilroy: ['Gilroy']
    },
    ...extend
  }
}
