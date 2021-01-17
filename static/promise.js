/**

自定义Promise

*/

(function(params){

var PENDING = 'pending',
	FULFILLED = 'fulfilled',
	REJECTED = 'rejected';


function Promise(excutor){
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
Promise.prototype.then = function(onResolved,onRejected){
	if(this.status === PENDING){
		// 一般情况下是先指定回调函数，再改变状态。状态还没改变，还是pending状态，需要先将回调函数存起来，然后再异步执行
		this.callbacks.push({
			onResolved:onResolved,
			onRejected:onRejected
		})
	}else if(this.status === FULFILLED){
		// 回调函数是异步执行的
		setTimeout(function(){
			onResolved(this.value);
		},0)
	}else{
		setTimeout(function(){
			onRejected(this.reason);
		},0)
	}
}

// 指定失败的回调函数，返回新的promise对象
Promise.prototype.catch = function(onRejected){

}

// 函数方法

Promise.resolve = function(value){

}
Promise.reject = function(reject){
	
}
// 返回一个promise，传入所有的promise成功才成功
Promise.all = function(promises){
	
}
// 返回一个promise，由传入的第一个执行成功的promise决定结果
Promise.race = function(promise){
	
}


window.Promise = Promise;
})(window)