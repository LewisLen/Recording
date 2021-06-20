# break、continue和return

- break: 中止当前循环
- continue: 声明终止当前循环，继续执行下一个循环
- return: 语句终止函数的执行，并返回一个指定的值给函数调用者

> break和continue更多用于循环或switch语句中，return更多用于函数语句中


## break

```javascript
function counter() {
  for (var count = 1; count <= 3; count++) {
    console.log('for循环执行次数');// 执行3次
    if (count === 3) {
      break;
    }
    console.log('中止语句下一句是否执行');// 执行2次
    // count值为 1 2
  }
  console.log('for循环外层语句是否被执行');// 会执行
}
counter();
```


## continue

```javascript
function counter() {
  for (var count = 1; count <= 5; count++) {
    console.log('for循环执行次数');// 执行3次
    if (count === 3) {
      continue;
    }
    console.log('中止语句下一句是否执行',count);// 执行2次
    // count值为 1 2 4 5会跳过3
  }
  console.log('for循环外层语句是否被执行');// 会执行
}
counter();
```

## return

```javascript
function counter() {
  for (var count = 1; count <= 3; count++) {
    console.log('for循环执行次数');// 执行3次
    if (count === 3) {
      return;
    }
    console.log('中止语句下一句是否执行');// 执行2次
    // count值为 1 2
  }
  console.log('for循环外层语句是否被执行');// 不会执行
}
counter();
```