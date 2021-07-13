// const fs = require('fs');
// setTimeout(() => {
//   console.log('setTimeout--1')
// },0)

// setImmediate(() => {
//   console.log('setImmediate--1')
// })

// fs.readFile('../algorithm/twoSum.js',{encoding: 'utf-8'},(err,data) => {
//   if(err) throw err;
//   // console.log(data);
//   console.log('readFile success');
// })

// Promise.resolve().then(() => {
//   console.log('promise callbak');
// })

// process.nextTick(() => {
//   console.log('process.nectTick');
// })

// console.log('同步函数--1')



const fs = require('fs');
setTimeout(() => { // 新的事件循环的起点
    console.log('setTimeout--1'); 
    fs.readFile('../algorithm/twoSum.js', {encoding: 'utf-8'}, (err, data) => {
        if (err) throw err;
        console.log('setTimeout里的readFile');

    });
}, 1000);

/// 回调将会在新的事件循环之前
fs.readFile('../algorithm/twoSum.js', {encoding: 'utf-8'}, (err, data) => {
  if (err) throw err;
  console.log('readFile--1');
});

/// 该部分将会在首次事件循环中执行
Promise.resolve().then(()=>{
    console.log('promise--poll callback');
});

// 首次事件循环执行
console.log('同步函数2');
