# 数组去重

## 双重循环去重

```javascript
function unique(arr){
  var target = [];
  for(var i = 0; i < arr.length; i++){
    var item = arr[i];
    for(var j = 0; j < target.length; j++){
      if(target[j] === item)
      break;
    }
    if(j === target.length){
      target.push(item);
    }
  }
  return target;
}
var arr = [1,2,3,1,'2','1',1,3];
var ans = unique(arr);
console.log(ans)
```