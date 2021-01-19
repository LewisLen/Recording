# Promise

## 区别实例对象和函数对象

- 函数对象：将函数作为对象使用时，简称函数对象
- 实例对象：new 函数产生的对象，简称为对象


```javascript

function Fn(){}
// fn是实例对象
const fn = new Fn();
// Fn是函数对象
console.log(Fn.prototype)

```

## 报错信息

- EvalError：创建一个error实例，表示错误的原因：与 eval() 有关。
- InternalError：创建一个代表Javascript引擎内部错误的异常抛出的实例。 如: "递归太多".
- RangeError：创建一个error实例，表示错误的原因：数值变量或参数超出其有效范围。
- ReferenceError：创建一个error实例，表示错误的原因：无效引用。
- SyntaxError：创建一个error实例，表示错误的原因：eval()在解析代码的过程中发生的语法错误。
- TypeError：创建一个error实例，表示错误的原因：变量或参数不属于有效类型。error默认有两个属性，message和stack
- URIError：创建一个error实例，表示错误的原因：给 encodeURI()或  decodeURl()传递的参数无效。


## Promise是什么？（What）

Promise 对象用于表示一个异步操作的最终完成（成功or失败的）及其结果。

总共有三种状态：

- pending（待定）：初始状态
- fulfilled（成功）：异步操作成功
- rejected（失败）：异步操作失败

pending只有可能会转换成两种状态：resolved和rejected，只有两种状态的变化，且promise对象只能改变一次状态，无论是成功还是失败，都会变成一个结果数据，成功的结果数据为value，失败的结果数据为reason。

- pending变为resolved：new Promise（pendding状态）=> 成功了（执行resolve) => promise实例对象（resolved状态） => then（执行onResolved()方法)
- pending变为rejected：new Promise（pendding状态）=> 失败了（执行reject） => promise实例对象（rejected状态） => then/catch（执行onRejected()方法）


```javascript

// 创建一个promise实例对象，实例对象有个参数（执行器函数）有两个参数resolve,reject
new Promise((resolve,reject) => {
	// executor器函数中两个参数resolve，reject
	setTimeout(() => {
		console.log('异步请求')
		// 模拟成功，执行resolve()回调函数
		resolve(1); // pending变成resolved状态
		resolve(2); // 只会执行第一个
		// 模拟失败，执行reject()回调函数
		// 失败和成功只会执行一个，如果两个成功或者两个失败函数也只会执行一个，执行第一个函数
		reject('失败原因'); // pending变成rejected状态
	},1000)
}).then(value => {
	// 回调onResolved()函数
	console.log(value);
}).catch(reason => {
	// 回调onRejected()函数
	console.log(reason);
})

```

## 为什么使用Promise（Why）

1. 在执行回调函数时，必须事先指定（成功or失败）回调方法，异步任务必须是在指定回调方法之后才能够执行。`Promise`则可以在异步任务启动之后再指定回调方法，也可以在任务完成（成功or失败）之后再指定回调方法。相比于传统的异步请求在指定回调方法的时间上更加的灵活。

```javascript

// 成功的回调函数
function successCallback(result) {
  console.log("音频文件创建成功: " + result);
}

// 失败的回调函数
function failureCallback(error) {
  console.log("音频文件创建失败: " + error);
}

// audioSettings是个异步请求，回调函数必须和在异步任务启动前指定
createAudioFileAsync(audioSettings, successCallback, failureCallback)

// promise
const promise = createAudioFileAsync(audioSettings);
promise.then(successCallback, failureCallback);

// 更加直观一点，假设异步请求完成需要2s，指定回调函数可以在2s之内也可以在2s之外
setTimeout(() => {
	// 依然可以执行
	promise.then(successCallback, failureCallback);
},3000)

```

> 也就是promise比传统的异步请求指定回调函数的时机更加灵活


2. 解决回调地狱问题。当异步函数依赖于上一个函数结果的时候，会发生函数嵌套，多个函数嵌套不利于代码的阅读，并且异常处理也不好处理。通过`Promise`链式调用，一个promise对象对应一个处理函数。


```javascript
// 回调地狱
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);

```

Promise链式调用：

```javascript

doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);

```

async/await：

```javascript

async function request(){
	try{
		const result = await doSomething();
		const newResult = await doSomething(result);
		const finalResult = await doSomething(newResult);
  		console.log('Got the final result: ' + finalResult);
	}catch(error){
		failureCallback(error);
	}
}

```

> 方便阅读且可以在最后的结果捕获异常

## 如何使用（How）


```javascript

// 基本用法
new Promise((resolve,reject) => {
	setTimeout(() => {
		resolve(1);
		// reject('理由');
	},2000)
})
// then(onFulfilled,onRejected)
.then(
	value => {
		console.log(value);
	},
	reason => {
		console.log(reason);
	}
)
// 也可以catch捕获,catch和then中的onRejected函数其实是一样的
// 相当于.then(undefined,reason => {})
.catch(reason => {
	console.log(reason);
})

```

### Promise.all()

```javascript
Promise.all([p1,p2,p3]).then(values => {
	// 获取全部为resolved状态的值，values为数组，对应promise
	console.log('values',values);
}).catch(reason => {
	// 获取reject的值，如果有多个reject值，则取第一个
	console.log(reason)
})
```

### Promise.race()

```javascript
// 不管resolved还是rejected状态，只要是第一个就获取，只改变一次
Promise.race([p1,p2,p3]).then(values => {
	// 第一个成功的value
	console.log('values',values);
}).catch(reason => {
	// 第一个失败的value
	console.log(reason)
})
```

> Promise.all是需要全部的promise异步请求成功则成功，执行onResolved()方法，返回的是values为数组。有一个失败则为rejected状态，执行onRejected()方法，值为第一个失败的reject值。
> Promise.race看哪一个异步请求最快执行，不管成功失败，获取第一个执行完的异步请求。


## Promise的状态改变和回调函数的执行

```javascript

// 常规做法：先指定了回调函数，后改变了状态
 new Promise((resolve,reject) => {
	// 后改变了状态，指定了数据，回调函数被调用，得到数据
	setTimeout(() => {
		console.log('异步请求')
		resolve(1);
	},2000)
}).then(
	// 先同步指定了回调函数，但是还没有执行，而是在promise内部保存了当前指定的回调函数
	value => {
		console.log('value===',value)
	},
	reason => {}
)

// 在executor中立即调用resolve，就是先改变状态，再指定回调函数
new Promise((resolve,reject) => {
	// 先改变状态，指定数据
	resolve(1)
}).then(
	// 后指定回调函数，异步执行回调函数时就得到了数据 
	value => {},
	reason => {}
)

// 将回调函数在异步请求之后执行，也可以做到先改变状态，再执行回调函数
const p = new Promise((resolve,reject) => {
	setTimeout(() => {
		resolve(1);
	},1000)
})
setTimeout(() => {
	p.then(value => {
		console.log('value',value);
	})
},2000)

```

> 注意：executor执行中的函数时立即(同步）执行的，指定回调函数是同步的，then中的回调函数是异步执行的


## 理解Promise.then的状态值

```javascript

new Promise((resolve,reject) => {
	setTimeout(() => {
		resolve(1)
	},0)
})
.then(
	value => {
		console.log('value111',value)
		// 没有指定return值则是return undefined
	},
	reason => {console.log('reject111',reason)}
)
.then(
	value => {console.log('value222',value)},
	reason => {console.log('reason222',reason)}
)
// 1,undefined
```

> 新的promise状态（后边的then状态）是由前一个then指定的回调函数执行的结果(return值或者异常）决定
> 1. 如果抛出异常，新的promise状态变为rejected，reason为抛出的异常
> 2. 如果返回的是非promise的任意值，新promise状态为resolved，value为返回值
> 3. 如果返回的是另一个新promise，此promise的结果就会成为新promise的结果


## Promise的捕获传透

```javascript

new Promise((resolve,reject) => {
	reject(1)
})
.then(
	value => {console.log('value1',value)},
	// 没有写onRejected()回调函数相当于
	// reason => { throw reason }
)
.then(
	value => {console.log('value2',value)}
)
.catch(
	reason => {
		// 这里的reason不是直接从一开始的reject(1)得到的，而是一步一步传过来的
		console.log(reason);
	}
);

```

> 最后的catch也不一定就一定会捕获到错误值，因为最后的reason值也是从上边的then()回调函数一步一步传到最后的catch中的，如果中途有做其它处理拦截了，则不会到最后一步的catch


## 自定义Promise



















































