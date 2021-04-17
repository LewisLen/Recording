import React from 'react';
function HooksCount(){
  const [count,setCount] = React.useState(0);
  const [name,setName] = React.useState('len');
  const addCount = () => {
    // setCount(count + 1);
    setCount(count => count + 1);
  }
  const changeName = () => {
    setName('LewisLen');
  }
  React.useEffect(() => {
    let timer = setTimeout(() => {
      addCount()
    },1000)
    return () => {
      clearTimeout(timer)
    }
  },[count])

  return (
    <div>
      <h2>Count: {count}</h2>
      <h2>Count: {name}</h2>
      <button onClick={addCount}>加</button>
      <button onClick={changeName}>加</button>
    </div>
  )
}
export default HooksCount;