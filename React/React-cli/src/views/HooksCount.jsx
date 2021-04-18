import React from 'react';
function HooksCount(){
  const [count,setCount] = React.useState(0);
  const [name,setName] = React.useState('len');
  // ref Hooks
  const tempRef = React.useRef();

  React.useEffect(() => {
    // 模拟生命周期函数
    let timer = setTimeout(() => {
      addCount();
    },1000)
    return () => {
      clearTimeout(timer)
    }
  },[count])

  const addCount = () => {
    // setCount(count + 1);
    setCount(count => count + 1);
  }
  const changeName = () => {
    setName('LewisLen');
  }
  
  const showInputValue = () => {
    console.log(tempRef.current.value)
  }
  return (
    <div>
      <input type="text" ref={tempRef}/>
      <h2>Count: {count}</h2>
      <h2>Count: {name}</h2>
      <button onClick={addCount}>加</button>
      <button onClick={changeName}>加</button>
      <button onClick={showInputValue}>展示input数据</button>
    </div>
  )
}
export default HooksCount;