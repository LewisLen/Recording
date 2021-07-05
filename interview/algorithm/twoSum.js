// 找出两数之和等于指定值
var twoSum = function(arr,target){
  const map = new Map();
  for(let i = 0;i < arr.length;i++){
    let tempNum = target - arr[i];
    if(map.has(tempNum)){
      return [map.get(tempNum),i]
    }else{
      // 用指定值减去数组中每个数作为map的key值，index作为value值
      map.set(arr[i],i)
    }
  }
  return []
}
let arr = [2,3,3,7,0]
let targetNum = 9;
twoSum(arr,targetNum); // [0,3]

// 这里的关键点是将数组中的value值作为map的键，而数组的index值对位map键对应的值。这样就能用余值与现有map中的键进行比较，有则是相加等于指定值的两个数。

/*
Map对象
const map = new Map();
// 设置map键值对，返回的是整个Map结构，所以可以链式调用
map.set('k','value').set(1,'a');
map.get('k');// 读取对应值
map.has('key');// 判断是否有某个键值，返回一个布尔值

// key是唯一值，有重复前者会被覆盖
map.set('b','2');
map.set('b','3');
map.get('b');// '3'

*/
