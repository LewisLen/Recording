import { DECREMENTVALUE, INCREMENTVALUE } from '../constant';

const initState = {
  count: 0
};

export default (state = initState,action) => {
  const {type,value} = action;
  if(type === INCREMENTVALUE){
    let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
    newState.count = state.count + value
    return newState
  }else if(type === DECREMENTVALUE){
    let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
    newState.count = state.count - value
    return newState
  }
  return state
}