/**

自定义Promise

*/

(function(params){

var PENDING = 'pending',
	FULFILLED = 'fulfilled',
	REJECTED = 'rejected';

// excutor执行器函数是同步执行
function PromiseTest(excutor){
	var _this = this;
	// promise状态初始值为pending
	this.status = PENDING;
	// 存储结果值
	this.data = undefined;
	// callbacks的作用是如果有多个回调函数，可以保存回调函数
	// 看是先指定回调函数还是先改变promise状态，如果是先指定回调函数则内部先保存回调函数然后在then中异步执行回调函数

	// 回调函数是异步执行的
	this.callbacks = [];

	function resolve(value){
		// 如果状态已经被改变了，则不需要再去执行成功或者失败回调函数了
		// 当状态为pending时才需要继续往下走
		if(_this.status !== PENDING){
			return;
		}
		// 状态改变为fullfilled
		_this.status = FULFILLED;
		// 将value值保存起来
		_this.data = value;
		// 如果有待执行的callback函数，则立即异步执行所有的onResolved回调函数
		if(_this.callbacks.length > 0){
			// 模拟异步执行所有成功的回调函数
			setTimeout(function() {
				_this.callbacks.forEach(objs => {
					objs.onResolved(value);
				})
			},0)
		}
	}

	function reject(reason){
		// 当状态为pending时才需要继续往下走
		if(_this.status !== PENDING){
			return;
		}
		// 状态改变为rejected
		_this.status = REJECTED;
		// 将reason值保存在data中
		_this.data = reason;
		// 如果有待执行的callback函数，则立刻异步执行回调函数onRejected回调函数
		if(_this.callbacks.length > 0){
			// 模拟异步执行所有失败的回调函数
			setTimeout(function(){
				_this.callbacks.forEach(objs => {
					objs.onRejected(reason);
				})
			},0)
		}
	}

	// excutor为执行器函数，同步执行
	try{
		excutor(resolve,reject);
	}catch (error){
		// 如果执行器抛出异常，promise对象状态则为rejected
		reject(error);
	}
}


// 将then和catch等方法绑定在原型prototype上

// 指定成功和失败的回调函数，这里重点是then需要return的Promise对象
PromiseTest.prototype.then = function(onResolved,onRejected){

	// 指定回调函数的默认值，必须是回调函数
	onResolved = typeof onResolved === 'function' ? onResolved:function(value){
		return value;
	}
	// 指定回调函数的默认值，必须是回调函数
	// 异常传透，抛出错误
	onRejected:typeof onRejected === 'function' ? onRejected: function(reason){
		throw reason;
	}

	var _this = this;
	// 解决链式调用，所以需要返回一个新的promise实例对象
	return new PromiseTest(function(resolve,reject){
		// 调用指定回调函数，根据执行结果改变return的promise的状态
		function handle(callback){
			try{
				var result = callback(_this.data);
				// 如果上一个回调函数返回的是promise，promise2的状态则根据上一个回调函数的promise结果来定，上一个promise成功则成功，失败则失败
				if(result instanceof PromiseTest){
					// result.then(
					// 	value => resolve(value),
				 	// 	reason => reject(reason)
					// )
					result.then(resolve,reject);
				}else{
				// 如果上一个回调函数返回的不是promise，promise2的状态为fulfilled，返回的是value，值为上一个回调函数的返回值（有可能是undifined，也有可能是
					resolve(result);
				}
			}catch(error){
				// 如果上一个回调函数中throw error，promise2的状态为rejected,返回的是reason，值为error
				reject(error)
			}
		}

		// 一般情况下是先指定回调函数，再改变状态。状态还没改变，还是pending状态，需要先将回调函数存起来，然后再异步执行
		if(_this.status === PENDING){
			// 这里的onResolved和onRejected回调函数在resolve和reject中就已经指定是异步执行了
			_this.callbacks.push({
				// 为了更改new promise的状态，而不是单纯保存promise的回调函数
				onResolved: function(value){
					handle(onResolved);
				},
				onRejected: function(reason){
					handle(onRejected);
				},
			})
		}else if(_this.status === FULFILLED){
			/**
			链式调用时第二个then（promise2.then结果取值规则如果下
				1. 如果上一个回调函数中throw error，promise2的状态为rejected,返回的是reason，值为error
				2. 如果上一个回调函数return的是promise，promise2的状态则根据上一个回调函数的promise结果来定，上一个promise成功则成功，失败则失败
				3. 如果上一个回调函数return的不是promise，promise2的状态为fulfilled，返回的是value，value值为上一个回调函数的返回值，没有return值则为undefined
			*/
			setTimeout(function(){
				handle(onResolved);
			});
		}else{
			// rejected状态
			setTimeout(function(){
				handle(onRejected);
			});
		}
	})
	
}

// 指定失败的回调函数，返回新的promise对象
PromiseTest.prototype.catch = function(onRejected){
	// catch也要返回一个promise
	return this.then(undefined,onRejected);
}

// 函数方法

PromiseTest.resolve = function(value){

}
PromiseTest.reject = function(reject){
	
}
// 返回一个promise，传入所有的promise成功才成功
PromiseTest.all = function(promises){
	
}
// 返回一个promise，由传入的第一个执行成功的promise决定结果
PromiseTest.race = function(promise){
	
}


window.PromiseTest = PromiseTest;
})(window)