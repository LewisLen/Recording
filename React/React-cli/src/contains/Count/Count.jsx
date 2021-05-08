// 引入connext用于链接UI组件与redux
import { connect } from 'react-redux';
import { createAsyncAction, decrementvalue, incrementvalue } from '../../store/actions/count';
// 容器组件的store通过props传递
// 引入UI组件
import CountUI from '../../views/Count';

// connect第一次需传递两个参数，且参数必须是函数
// 第一个参数函数的返回值会作为状态传递给UI组件，key/value形式
// 这里是react-redux在调用该函数的时候已经调用了store.getState()，并且将state返回
const mapStateToProps = (state) => {
  const {count} = state.CountReducer;
  return {
    count,
    books:state.BookReducer
  }
}
// 第二个参数函数的返回值会作为操作状态的方法传递给UI组件
// const mapDispatchToProps = (dispatch) => {
//   return {
//     increment: (val) => {
//       // 执行redux的action
//       dispatch(incrementvalue(val))
//     },
//     decrement: val => dispatch(decrementvalue(val)),
//     incrementAsync: (val,time) => dispatch(createAsyncAction(val,time))
//   }
// }

// mapDispatchToProps简写，直接一个key/value的对象形式
// value必须是action函数
const mapDispatchToProps = {
  increment: incrementvalue,
  decrement: decrementvalue,
  incrementAsync: createAsyncAction
}


// 使用connect()()创建并暴露一个Count的容器组件
export default connect(mapStateToProps,mapDispatchToProps)(CountUI)
