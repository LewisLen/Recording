## 父子组件生命周期

当有父子组件时，其生命周期渲染顺序为：

(同步加载子组件)加载渲染过程：父组件 beforeCreate -> 父组件 created -> 父组件 beforeMount -> 子组件 beforeCreate -> 子组件 created -> 子组件 beforeMount -> 子组件 mounted -> 父组件 mounted
父组件先创建，然后子组件创建；子组件先挂载，然后父组件挂载，即会先渲染父组件到beforeMount，然后将子组件渲染完，最后是渲染完父组件（mounted）

父组件更新data：

- 如果是父子组件有通信，改变data会影响子组件的props值。更新过程(父组件影响子组件的情况)：父组件beforeUpdate -> 子组件beforeUpdate-> 子组件updated -> 父组件updted
- 如果只是父组件单纯更新自身的data值(父组件不影响子组件的情况)：父组件beforeUpdate -> 父组件updated

子组件更新data：

- 如果是父子组件有通信，改变子组件的data会影响父组件的data值。更新过程(子组件更新影响到父组件的情况)：父组件beforeUpdate -> 子组件beforeUpdate-> 子组件updated -> 父组件updted
- 如果只是子组件单纯更新自身的data值(子组件不影响父组件的情况)：子组件beforeUpdate -> 子组件updated

销毁过程：父组件 beforeDestroy -> 子组件beforeDestroy -> 子组件destroyed -> 父组件 destroyed


> 根据父子组件渲染时钩子函数的执行顺序可以得知：如果是在父组件mounted同步改变data值传递子组件，在子组件mounted是拿不到的。只有在父组件中的created同步改变传递data的值，在子组件中created和mounted中是可以拿到的。
> 如果是在父组件中异步获取数据传递子组件，可以借助在父组件调用组件时加上v-if数据判断来渲染子组件，或者在子组件中watch数据再做操作，否则获取不到值。
> updated能够在数据变化时触发，但不能准确的判断时哪个属性值改变，使用computed和watch监听属性变化
> 异步组件情况比较复杂一些，如果是父子组件有通信的情况下，在父组件的created和mounted中有异步请求获取data传递给子组件。则顺序是：父组件beforeCreate -> 父组件created -> 父组件beforeMount -> 父组件mounted -> beforeUpdate -> 子组件beforeCreate -> 子组件created -> 子组件beforeMount -> 子组件mounted -> 父组件updated


```javascript
// 子组件
var ComponentB = {
    name: 'ComponentB',
    template: `
    <div>
        <p>子组件{{num}}</p>
        <p>子组件{{message}}</p>
        <p>子组件{{childYearNum}}</p>
        <button @click="changeMsg">子组件改变父组件的值</button>
    </div>
    `,
    props:{
        num:{
            type: Number,
            default: ''
        },
        yearNum:{
            type: Number,
            default: ''
        },
        message:{
            type: String,
            default: ''
        }
    },
    data(){
        return{
            childYearNum: this.yearNum
        }
    },
    watch:{
        yearNum(val,oldVal){
            console.log('val===',val);
            console.log('oldVal===',oldVal);
            this.childYearNum = val
        }
    },
    beforeCreate(){
        console.log('子组件beforeCreate')
    },
    created(){
        console.log('子组件created')
        // 父组件异步获取data传到子组件，通过在父组件渲染子组件时增加if判断即可拿到值
        // console.log('子组件created =====',this.yearNum) // 0
    },
    beforeMount(){
        console.log('子组件beforeMount')
    },
    mounted(){
        console.log('子组件mounted')
        // 父组件异步获取data传到子组件，通过在父组件渲染子组件时增加if判断即可拿到值
        // console.log('子组件mounted =====',this.yearNum) // 0
    },
    beforeUpdate(){
        console.log('子组件beforeUpdate')
    },
    updated(){
        console.log('子组件updated')
    },
    beforeDestroy(){
        console.log('子组件beforeDestroy')
    },
    destroyed(){
        console.log('子组件destroyed')
    },
    methods:{
        changeMsg(){
            this.$emit('changeMsg','World')
        }
    }
}

// 父组件
var ComponentA = {
    template: 
    `<div>
        <p>父组件{{num}}</p>
        <p>父组件{{message}}</p>
        <button @click="changeNum">父组件改变子组件num</button>
        <button @click="destoryChild">父组件销毁子组件</button>
        <br/>
        ==================================
        <com-b :num="num" :message="message" :yearNum="yearNum" @changeMsg="changeMsg" v-if="yearNum"></com-b>
    </div>`,
    components:{
        comB: ComponentB
    },
    data(){
        return{
            num: 1,
            yearNum: 0,
            message: 'Hello'
        }
    },
    beforeCreate(){
        console.log('父组件beforeCreate')
    },
    created(){
        console.log('父组件created');
        setTimeout(() => {
            this.yearNum = 2021;
        })
    },
    beforeMount(){
        console.log('父组件beforeMount')
    },
    mounted(){
        console.log('父组件mounted');
    },
    beforeUpdate(){
        console.log('父组件beforeUpdate')
    },
    updated(){
        console.log('父组件updated')
    },
    beforeDestroy(){
        console.log('父组件beforeDestroy')
    },
    destroyed(){
        console.log('父组件destroyed')
    },
    methods:{
        // 通过改变父组件的data，从而改变了传递给子组件的值
        changeNum(){
            this.num ++;
        },
        changeMsg(msg){
            this.message = msg;
        },
        destoryChild(){
            this.$destroy('comB')
        }
    }
}

var vm = new Vue({
    el: '#app',
    components:{
        comA: ComponentA
    }
});
```