# postion

## relative和absolute分别是相对于谁进行定位的?

position 属性用于指定一个元素在文档中的定位方式。top，right，bottom 和 left 属性则决定了该元素的最终位置。

position 有五个值：

- static
- relative
- absolute
- fixed
- sticky

### static

static 是 position 的默认值，如果没有设置 position 属性，那么浏览器就会按照 html 的结构顺序进行渲染，称之为正常的文档流，元素之间是不会重叠的。**此时 top, right, bottom, left 和 z-index 属性无效**。


### relative

relative 表示相对位置，相对于元素的初始位置(static的位置)进行偏移。主流观点（[w3c](https://www.w3.org/TR/CSS22/visuren.html#positioning-scheme)）认为 **relative 不会脱离文档流**。必须搭配top, right, bottom, left来指定偏移位置。

### absolute

absolute 表示绝对定位，会被**移出正常文档流，不占用正常文档流的空间**，一般是相对于父元素进行偏移。还需注意的是，父元素不能是默认的 static 定位，否则 absolute 会相对于根元素 html 来定位，所以一般是搭配父元素设置 releative 来定位。必须搭配top, right, bottom, left来指定偏移位置。也可以设置外边距（margins），且不会与其他边距合并。

```css
.father{
  position: releative;
}
.child{
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 20px;
}
```

### fixed

absolute 表示绝对定位，会被**移出正常文档流，不占用正常文档流的空间**，相对于屏幕视口（viewport）的位置来指定元素位置。所以可以让指定元素固定在网页上。必须搭配top, right, bottom, left来指定偏移位置。它如果搭配top、bottom、left、right这四个属性一起使用，表示元素的初始位置是基于视口计算的，否则初始位置就是元素的默认位置。


### sticky

一些时候是relative定位（定位基点是自身默认位置），另一些时候自动变成fixed定位（定位基点是视口）。
如下box一开始是定位在自身的位置，当滚轮滑动时则会固定在网页最上方。

```css
.box{
  position: sticky;
  top:0;
}
```

## 总结：

- static：默认位置，正常文档流
- relative：相对于 static 位置进行定位，不会脱离文档流
- absolute：相对于非 static 的父元素进行定位，否则会相对于根元素定位，一般搭配父元素 relative 使用，脱离文档流
- fixed：相对于屏幕视口（viewport）的位置来指定元素位置，脱离文档流
- sticky：初始是 relative 定位，滚动时则变成 fixed 定位

## 参考内容

- https://developer.mozilla.org/zh-CN/docs/Web/CSS/position
- http://www.ruanyifeng.com/blog/2019/11/css-position.html