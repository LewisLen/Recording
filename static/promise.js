/**

自定义Promise

*/

(function(params){

var PENDING = 'pending',
	FULFILLED = 'fulfilled',
	REJECTED = 'rejected';


function PromiseTest(excutor){
	var _this = this;
	this.status = PENDING;
	// 成功的值
	this.value = undefined;
	// 失败的原因
	this.reason = undefined;
	// 保存回调函数
	// 看是先指定回调函数还是先改变promise状态，如果是先指定回调函数则内部先保存回调函数然后在then中异步执行回调函数
	this.callbacks = [];

	function resolve(value){
		// 如果状态已经被改变了，则不需要再去执行成功或者失败回调函数了
		if(_this.status !== PENDING){
			return;
		}
		// 状态改变
		_this.status = FULFILLED;
		// 传值
		_this.value = value;
		// 如果有待执行的callback函数，则异步执行所有的onResolved回调函数
		if(_this.callbacks.length > 1){
			// 模拟异步执行所有成功的回调函数
			setTimeout(function() {
				_this.callbacks.forEach(objs => {
					console.log(objs);
					objs.onResolved(value);
				})
			},0)
		}
	}

	function reject(reason){
		if(_this.status !== PENDING){
			return;
		}
		// 状态改变
		_this.status = REJECTED;
		_this.reason = reason;
		// 如果有待执行的callback函数，则异步执行回调函数onResolved
		if(_this.callbacks.length > 1){
			// 模拟异步执行所有失败的回调函数
			setTimeout(function(){
				_this.callbacks.forEach(objs => {
					console.log(objs);
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


// 原型上的方法

// 指定成功和失败的回调函数，返回新的Promise对象
PromiseTest.prototype.then = function(onResolved,onRejected){
	var _this = this;
	// 解决链式调用，所以需要返回一个新的promise实例对象
	var promise2 = new PromiseTest(function(resolve,reject){
		// 一般情况下是先指定回调函数，再改变状态。状态还没改变，还是pending状态，需要先将回调函数存起来，然后再异步执行
		if(_this.status === PENDING){
			_this.callbacks.push({
				onResolved: function(value){
					onResolved(_this.value)
				},
				onRejected: function(reason){
					onRejected(_this.reason)
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
				try{
					// 如果上一个回调函数返回的是promise，promise2的状态则根据上一个回调函数的promise结果来定，上一个promise成功则成功，失败则失败
					var result = onResolved(_this.value);
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
			});

		}else{
			setTimeout(function(){
				try{
					// 如果上一个回调函数返回的是promise，promise2的状态则根据上一个回调函数的promise结果来定，上一个promise成功则成功，失败则失败
					var result = onRejected(_this.reason);
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
			});
		}
	})
	return promise2;
}

// 指定失败的回调函数，返回新的promise对象
PromiseTest.prototype.catch = function(onRejected){

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