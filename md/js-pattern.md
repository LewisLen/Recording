# JavaScript设计模式

## 灵活的js

### 函数也是一种变量

```javascript
function checkName(){
    // ...
}
function checkEmail(){
    // ...
}

// 可以转换成

var checkName = function(){
    // ...
}
var checkEmail = function(){
    // ...
}
```

以上创建方式有可能产生全局变量，所以可以换一种方式

```javascript
var checkObj = {
    checkName: function(){
        // ...
    },
    checkEmail: function(){
        // ...
    }
}

// 或者换一种方式

var checkObj = function(){};
checkObj.checkName = function(){
    // ...
}
checkObj.checkEmail = function(){
    // ...
}
```

### 链式调用方法

```javascript
var checkObj = {
    checkName: function(){
        // ...
        return this;
    },
    checkEmail: function(){
        // ...
        return this;
    }
}
checkObj.checkName().checkEmail();
```

### prototype抽象出统一方法

```javascript
Function.prototype.addMethod = function(name,fn){
    this[name] = fn
}
var methods = function(){};
// 或者
var methods = new Function(){};
methods.addMethod('checkName',function(){
    // 验证姓名...
    return this; // 可以链式操作
});
methods.addMethod('checkEmail',function(){
    // 验证邮箱...
    return this; // 可以链式操作
});
```

`prototype`形式只能通过`new`关键字来创建新对象

```javascript
Function.prototype.addMethod = function(name,fn){
    this.prototype[name] = fn;
}
// 不能直接使用，需通过new关键字来创建
var m = new Methods();
m.checkEmail();
```

## 封装

由于`JavaScript`的函数级作用域，声明在函数内部的变量以及方法在外界是访问不到的，通过此特性即可创建类的私有变量以及私有方法。然而在函数内部通过`this`创建的属性和方法，在类创建对象时，每个对象自身都拥有一份并且可以在外部访问到。因此通过`this`创建的属性可看作是对象共有属性和对象共有方法，而通过`this`创建的方法，不但可以访问这些对象的共有属性和共有方法，而且还能访问到类(创建时)或对象自身的私有属性和私有方法，由于这些方法权利比较大，所以我们又将它看作特权方法。

```javascript

var Book = function(id,bookname,price){
	// 私有属性
	var num = 1;
	// 私有方法
	function checkId(){

	}
	// 公有属性
	this.id = id;
	// 公有方法
	this.get = function(){};
}

```











































