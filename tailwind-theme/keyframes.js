module.exports = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  flyFromBottom: {
    from: { top: '100%', opacity: 0 },
    '50%': { top: '50%', opacity: 0.5 },
    to: { top: '0', opacity: 1 }
  },
  flyFromRight: {
    from: { left: '100%', opacity: 0 },
    '50%': { left: '50%', opacity: 1 },
    to: { left: '0', opacity: 1 }
  },
  vranimate: {
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: '-544px 0' }
  },
  vranimateSm: {
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: '-448px 0' }
  },
  vranimateSm1: {
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: '-1600Px 0' }
  },
  'vr-position': {
    from: { 'background-position': 0 },
    to: { 'background-position': '100%' }
  },
  nidentifier: {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(-50%)' }
  },
  col: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-50%)' }
  },
  dotMove: {
    '0%': {
      opacity: 1,
      width: '10px',
      height: '10px',
      borderRadius: '50%'
    },
    '30%': {
      opacity: 0.5,
      borderRadius: '50%'
    },
    '100%': {
      opacity: 0,
      width: '20px',
      height: '20px',
      borderRadius: '50%'
    }
  },
  dotMoveH5: {
    '0%': {
      opacity: 1,
      width: '5px',
      height: '5px',
      borderRadius: '50%'
    },
    '30%': {
      opacity: 0.5,
      borderRadius: '50%'
    },
    '100%': {
      opacity: 0,
      width: '10px',
      height: '10px',
      borderRadius: '50%'
    }
  },
  lgoinInDown: { // 登录动画
    from: { opacity: '0', transform: 'translateY(-50px)' },
    to: { transform: 'translateY(0)' }
  },
  loginloading: { // 加载动画
    from: { transform: 'rotate(0)' },
    to: { transform: 'rotate(360deg)' }
  },
  moveaniicon: {
    from: { transform: 'translateY(0)' },
    '50%':{ transform: 'translateY(10%)' },
    to: { transform: 'translateY(0)' }
  },
  expandFromMiddle: {
    from: {
      transform: 'scaleY(0)',
      opacity: 0
    },
    '50%': {
      transform: 'scaleY(0.5)',
      opacity: 1
    },
    to: {
      transform: 'scaleY(1)',
      opacity: 1
    }
  },
  usercountryanm: {
    from: { transform: 'translateY(700px)' },
    '50%': { transform: 'translateY(350px)' },
    to: { transform: 'translateY(0px)' }
  },
  cationcode: {
    from: { opacity: 1 },
    '50%': { opacity: 0 },
    to: { opacity: 1 }
  },
  spinFrom90: {
    from: { transform: 'rotate(-90deg)' },
    to: { transform: 'rotate(270deg)' }
  },
  scanRow: {
    from: { left: '-50%' },
    '33%': { left: '100%' },
    to: { left: '100%' }
  }
}
