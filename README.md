# react 练习demo
亦可作react-redux 、redux源码调试用。

@[TOC](react-redux 源码解读之connect的selector布局)

# selector

select是指从state中获取所需数据的函数。它与mapStateToProps、mapDispitchToProps最密切。
它是redux的三驾马车之一：action、reducer、selector；
有些人说如何设计selector，其实说的是如何设计mapStateToProps、mapDispitchToProps。
在connect源码中，最核心的部分都是围绕着selector来进行的。
理解了selector这块基本上可以解决工作开发中关于redux百分之80的疑惑。
因为太难更深的，几乎不会用到。
熟悉了connect关于selector这块，你会懂得：
```
1、redux被执行时，是否触发mapStateToProps执行；
2、mapStateToProps执行，是否会触发render；
3、组件是否render是依赖mapStateToProps返回的的state状态判断，还是整个store 状态判断。
4、组件状态数据更新的过程。
5、reducer为什么default时返回的是state，其他type返回的是{...state}
```

## connect其实就是Connect组件

我们通常写组件最后都是这样：connect(mapStateToProps,mapDispatchToProps)(App)。
 以上经过源码转换后，最后就是connectAdvanced.js 中的Connect组件。
 把connect(mapStateToProps,mapDispatchToProps)(App) 看成 Connect组件来分析就很好办了。
### 初始化selector
只在Connect组件装载时初始化selector
 ```
  //Connect组件
   constructor(props, context) {
        super(props, context)
        this.initSelector() //初始化selector
      }
```
接着看initSelector
```
 initSelector() {
        const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
        this.selector = makeSelectorStateful(sourceSelector, this.store)
        this.selector.run(this.props)
      }
```
### initSelector函数第一行代码讲解
```
//this.store.dispatch 不用解释了
//selectorFactoryOptions 把它当作是mapStateToProps与mapDispatchToProps等的集合
//selector做的事情其实就是围绕mapStateToProps与mapDispatchToProps展开当然要传这俩参数
const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
```
这行代码非常妙，sourceSelector是一个闭包函数。闭包一般不轻易用，如果用了肯定有目的，肯定是要让执行上下文不消失，可以保存变量值。
通过一个闭包的方式创建sourceSelector这个闭包函数，它的目的其实就是为了以后每次执行sourceSelector函数时，sourceSelector所用到的上下文都不被销毁，能够被保存。
以后的每次监听或者需要比较状态是否改动都会执行sourceSelector，这以后再讲。

我们看下 闭包母函数selectorFactory准备储存哪些变量给闭包函数sourceSelector。
selectorFactory其实就是selectorFactory.js的finalPropsSelectorFactory方法经过转化后其实就是pureFinalPropsSelectorFactory方法。
```
selectorFactory  约等于 pureFinalPropsSelectorFactory函数
```
来看下pureFinalPropsSelectorFactory函数部分源码：

```
//selectorFactory.js
export function pureFinalPropsSelectorFactory() {
  let state //其实就是this.context.store.getState() ---整个store中的状态state
  let ownProps
  let stateProps  //其实就是mapStateToProps(state, ownProps)---当前组件通过mapStateToProps实际使用的state
  let dispatchProps //其实就是mapDispatchToProps(dispatch, ownProps)
  ·····
  //这种函数内返回执行的函数很妙，其实就是外层等于内层函数，不过这种写法可以增加判断，到底使用哪个函数
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return handleFirstCall(nextState, nextOwnProps)
  }
  }
```
为什么要储存以上参数，是因为selector其实至始至终都是围绕以上四个参数，进行比较和生成新的props (ownProps+stateProps +dispatchPropsprops)，当然这是后话。

再回到上面的闭包函数sourceSelector，
sourceSelector其实就是pureFinalPropsSelector，经过转化，可以把它看成是handleSubsequentCalls：
```
闭包函数sourceSelector 约等于 handleSubsequentCalls
//以下讲解时，请将sourceSelector认为是handleSubsequentCalls可便于理解
```
看下handleSubsequentCalls的源码：
```
//selectorFactory.js
 function handleSubsequentCalls(nextState, nextOwnProps) {
 //areOwnPropsEqual比较是否相等的函数
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
    //比较this.context.store.getState()的当前与上一个是否相等
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps
    
    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }
```
为了先简单理解整个过程，我们只讨论getState()改变的情况，以上代码可以简化为(为了便于理解handleNewState()方法放入其中)：
```
//selectorFactory.js
 function handleSubsequentCalls(nextState, nextOwnProps) {
              //areOwnPropsEqual比较是否相等的函数
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
              //比较this.context.store.getState()的当前与上一个是否相等
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps
    
    if (stateChanged){
               //为了便于理解handleNewState()方法直接到这里来
        const nextStateProps = mapStateToProps(state, ownProps)
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps)
              //储存最新的 stateProps（因为handleSubsequentCalls是闭包函数sourceSelector，所以能储存）
        stateProps = nextStateProps
       if (statePropsChanged)
           	mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    }
    return mergedProps
  }
```
以上代码意思：当全局的store.getState()没有变动时，不做任何改动，返回原来的mergedProps，如果有变动，就执行mapStateToProps(state, ownProps)来获取当前组件实际使用store上的哪些数据，通过比较前后实际使用mapStateToProps(state, ownProps)数据是否变动，若变动则更新新的mergedProps，若不变动，则不变。

废了一大堆口舌，终于理清楚了，initSelector函数第一行代码做的事情：创建一个sourceSelector闭包函数，以备后面使用。
闭包函数sourceSelector是干吗的呢？
```
闭包函数sourceSelector作用：
1、它就是handleSubsequentCalls函数，接受两个参数nextState, nextOwnProps。
2、此函数执行后，可返回最新的mergedProps ：stateProps+dispatchProps+ownProps，而一个组件的props就是由以上三部分组成的，mergedProps就是props。
```
### initSelector函数第二行代码讲解
终极大boss：  this.selector终于出来了。
sourceSelector就是上小节讲的闭包函数。
```
 this.selector = makeSelectorStateful(sourceSelector, this.store)
```
makeSelectorStateful方法源码如下，它的作用是返回一个带有run方法的selector。
```
//connectAdvanced.js
function makeSelectorStateful(sourceSelector, store) {
  const selector = {
    run: function runComponentSelector(props) {
    //上一小节讲到过sourceSelector返回最新的mergedProps ：stateProps, dispatchProps, ownProps，，也就是组件的最新的props，简称nextProps
    //直接通过是否是同一个对象的引用就可以判断是否状态有改变，是不是很爽。
      const nextProps = sourceSelector(store.getState(), props)
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true
          selector.props = nextProps
          selector.error = null
        }
    }
  }
  return selector
}
```
```
以上代码容易混淆地方解释：
selector.props 才是Connect组件下的子组件的props；
this.props是Connect组件自己的props，相当于子组件的ownProps；
代码：
//Connect组件 源码：
 render() {
        const selector = this.selector
        selector.shouldComponentUpdate = false

        if (selector.error) {
          throw selector.error
        } else {
        //子组件WrappedComponent的props就是selector.props
          return createElement(WrappedComponent, this.addExtraProps(selector.props))
        }
      }

```
makeSelectorStateful的作用是返回一个带有run方法的selector。我们可以看到selector其实就是
```
 selector.run
 selector.shouldComponentUpdate
 selector.props
```
是的，connect折腾了这么多，在操作数据上，无非就是通过this.selector获取，最终无非就是获取以上两个数据，前者判断是否更新，后者返回组件最新的props。
另外提供了函数this.selector.run 方法， 这个方法了不得，以后组件的各种更新都跟它有关，由上面代码看出
```
this.selector.run 的作用：
 1、更新selector.shouldComponentUpdate
 2、更新selector.props
```
注意
1、this.selector.run不改变 Connect的props，只改变selector.props，而selector.props就是Connect下的子组件WrappedComponent的props；
2、this.selector.run用来给更新子组件WrappedComponent的props做准备的
3、WrappedComponent的props === selector.props === Connect的props + stateProps+dispatchProps；
selector.props 还有另外一种写法：
selector.props === ownProps+stateProps+dispatchProps
因此ownProps指的就是Connect的props.
```
this.selector.run 的作用（详细版）：
 1、更新selector.shouldComponentUpdate
 2、更新selector.props ---为子组件WrappedComponent提供更新的props
```

### initSelector函数第三行代码讲解
```
this.selector.run(this.props)
```
Connect组件装载时，run一次，做了三件事情：
1、更新selector.shouldComponentUpdate值；
*因为装载的时候，无论如何都会执行render，所以这次的selector.shouldComponentUpdate基本上无用，因为在render中始终执行selector.shouldComponentUpdate = false;(不过以后执行run，更新得到的shouldComponentUpdate是很重要的，这都是后话)*

2、更新selector.props值；
这点很重要，为了下一步render中提供子组件WrappedComponent的更新props。

3、闭包handleSubsequentCalls一个初始值；

> 另外注意的是，在装载完成时，componentDidMount中也会执行一次this.selector.run(this.props)，这一次应该为了兼容异常情况，进行了一次多余的执行。所以我们正常运行组件时可以无视componentDidMount中的执行this.selector.run(this.props)。

至此整个Connect组件装载过程的selector设计（布局）已经讲解清楚。

## Connect组件的selector设计

1、装载时：
在组件装载过程中，通过构造函数constructor中执行 this.initSelector()，创建this.selector:
```
 selector.run  //用来给组件装载后使用，更新selector.shouldComponentUpdate和selector.props
 selector.shouldComponentUpdate
 selector.props //装载时执行一次，为更新子组件提供更新的props
```
在执行以上代码时， selectorFactory会将组件中定义的外层定义到connect的mapStateToProps和mapDispatchToProps和ownprops 合并到selector.props中，然后通过render，每次合并到子组件WrappedComponent的props中。

2、更新时
完了后，redux通过监听，
当redux的state发生变化时，会执行selector.run，
获取selector.shouldComponentUpdate和最新的selector.props，
如果为true，将setState，
从而触发执行render，
然后将使用最新的selector.props 在render中每次都更新子组件的props。

注意：从上可以看出每次redux的state发生变化时都会执行外层定义到connect的mapStateToProps和mapDispatchToProps函数，但不一定会render；

## Connect组件状态监听更新


这块比较简单，直接上代码说明：
```
 constructor(props, context) {
        super(props, context)
        this.initSubscription()
      }
      
 initSubscription() {
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))
      }

 onStateChange() {
        this.selector.run(this.props)
        if (!this.selector.shouldComponentUpdate) {
         //
        } else {
          this.setState({})
        }
      }
```
在装载的Connect组件是，订阅监听，如果this.context.store.state（整个app）有变化，就是执行方法onStateChange，onStateChange通过this.selector.run(this.props)计算比较得到selector.shouldComponentUpdate、selector.props，然后再决定是否setState，因为只需触发render即可，所以this.setSate一个空对象{}或者其他值都无所谓。

关于Subscription的讲解，以后会讲到。

至此Connect组件一整套，装载、数据监听更新的过程都过了一遍。
其实有很多细节么有讲，就是为了一次性将整个过程过下来，大家有一个整体脉络，便于理解。
下面讲解一下以上的细节。

## 关于selector部分细节补充
```
//selectorFactory.js
export default function finalPropsSelectorFactory() {
//options.pure这个值默认情况是true，其实就是export default //connect(mapStateToProps,mapDispatchToProps,mergeProps,{pure:true})中的第四个参数
  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory
```
```
//selectorFactory.js
//第一次执行时用的是这个this.selector.run(this.props)是在initSelector()上，
//在装载时，此时走的是handleFirstCall，然后在此方法中设置hasRunAtLeastOnce为true，以后每次都是走handleSubsequentCalls。
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
```
```
   //hoistStatics(Connect, WrappedComponent) 等于以下两句代码：
    //  Connect.abc = new WrappedComponent().abc;
    //  Connect.aee = new WrappedComponent().aee;
    //  ......
    //  return Connect
    //  hoistStatics 作用在于构造高阶组件HOC时，复制组件的非react静态方法。
    return hoistStatics(Connect, WrappedComponent)
```



 [1]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
 [2]: https://mermaidjs.github.io/
 [3]: https://mermaidjs.github.io/
 [4]: http://adrai.github.io/flowchart.js/

本篇完
------------




# react-redux 源码解读体会拾遗

 react-connect源码体会最深的还是将闭包应用到极致，而且很多都是多级闭包。核心代码selectorFactory.js都是闭包写法。
源码中，闭包的设计大多是为了传值方便和功能模块化。

另外还有其他印象深刻的：
```
以这中方式定义 组件生命周期函数 componentWillUpdate
Connect.prototype.componentWillUpdate = function componentWillUpdate() {}
```
```
 //这种函数内返回执行的函数很妙，其实就是外层等于内层函数，不过这种写法可以增加判断，到底使用哪个函数
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
```
```
//妙处在于，proxy() 第一次执行执行的是三目运算符的true部分，以后每次都是执行false部分。
 const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }
    proxy.dependsOnOwnProps = true
    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps
      proxy.dependsOnOwnProps = false
      let props = proxy(stateOrDispatch, ownProps)
      return props
    }
```
```
//这是boundActionCreators源码的一处妙用
apply与arguments  母函数通过arguments操作子函数
1、母函数通过arguments操作子函数；
2、必须使用tt.apply
3、直接使用tt(arguments)是错误的
4、apply配合arguments使用可以达到传参一致的效果。
function tt(x,y) {
    console.log(x);//1
    console.log(y);//3
}
function dd() {
   //tt(arguments) 错误
    tt.apply(this,arguments)
}
dd(1,3)
```
```
巧妙函数写法和传参数方法：
//传参中后面的={}写得妙，没有那个，这样调用connect(1)就会报错，ab undefined，
function connect(u,{ab=9,...op}={}) {
    console.log(u);//1
    console.log(ab);//2
    console.log(op);//{ cd: 99, er: 123 }
}
connect(1,{ab:2,cd:99,er:123})
```




本篇完
-----------------




@[TOC](react-redux 源码解读之connect的mapStateToProps)
## 相关文件

```
react-redux/src/connect/connect.js  --入口文件：接受传入的mapStateToProps
react-redux/src/connect/mapStateToProps.js --对传入mapStateToProps进行空值、或function判断处理
react-redux/src/connect/wrapMapToProps.js --包装mapStateToProps和mapDispitchToProps
react-redux/src/components/connectAdvanced.js -- 不做处理，转发一下
react-redux/src/connect/selectorFactory.js  --调用mapStateToProps的地方

```
下面对以上相关文件中，关于mapStateToProps部分进行讲解。


## mapStateToProps从定义到最终调用的过程
我们在各个组件中使用connect，并定义mapStateToProps。
### connect.js
connect(mapStateToProps,...) --接受各组件定义的mapStateToProps：
并包装mapStateToProps，得到**initMapStateToProps**，并传给 connectAdvanced.js：
```
//connect.js
 const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps') ---包装mapStateToProps
 connectHOC(..., { initMapStateToProps,.... })
 ```
 ### connectAdvanced.js
connectOptions包含**initMapStateToProps**.
 connectAdvanced.js接收connectOptions (**initMapStateToProps**)，不做任何改变，直接转发,传给selectorFactory.js  ：
 ```
 //connectAdvanced.js
connectAdvanced(... {...connectOptions } = {})  ---connectOptions包含initMapStateToProps；
const selectorFactoryOptions = { ...connectOptions,...}
selectorFactory(... selectorFactoryOptions)
```
### selectorFactory.js
selectorFactory.js接收**initMapStateToProps**，并执行一次它，**得到最终每次调用的mapStateToProps**
```
//selectorFactory.js
const mapStateToProps = initMapStateToProps(dispatch, options)
//以后每次都在handleNewState方法中调用
mapStateToProps(state, ownProps)
```
以上过程我们可以看到，其实都是针对initMapStateToProps进行，中间有些过程只是直接转发，并没有操作改变mapStateToProps。

简单点，可以将上一节过程简化为：
```
//这里的mapStateToProps 为 各组件定义的mapStateToProps
 const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps') 
 //这里的mapStateToProps 为 各组件定义的mapStateToProps经过connect框架转化后最终执行的mapStateToProps
 const mapStateToProps = initMapStateToProps(dispatch, options)
```
*connect框架为了达到使用方便，允许用户灵活定义mapStateToProps，框架会对用户定义的mapStateToProps经过一系列转化，变成可用的mapStateToProps。*

 读懂initMapStateToProps才是理解mapStateToProps的关键。
 
## initMapStateToProps
为方便理解，我们只讨论组件内定义的mapStateToProps 非空，且为function的情况
```
//connect.js
const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps') 
....
function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result){
        return result
    }
  }
}

```
mapStateToPropsFactories是一个这样的数组：
```
//mapStateToProps.js 
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return (typeof mapStateToProps === 'function')
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined
}

export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return (!mapStateToProps)
    ? wrapMapToPropsConstant(() => ({}))
    : undefined
}
export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing
]

```
以上结合match使用，妙的地方在于 ：
 match是使用length--进行for遍历，whenMapStateToPropsIsMissing是第一个被match处理的。
 whenMapStateToPropsIsMissing只处理mapStateToProps为空情况，当mapStateToProps有值的时候，返回一个undefined，
 从而通过match让whenMapStateToPropsIsFunction来处理，
match函数通过return终止操作

于是
const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps') 
相当于
const initMapStateToProps = wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')；

wrapMapToPropsFunc方法为：
```
//wrapMapToProps.js
export function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, { displayName }) {
        const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
            return proxy.dependsOnOwnProps
                ? proxy.mapToProps(stateOrDispatch, ownProps)
                : proxy.mapToProps(stateOrDispatch)
        }
        return proxy
    }
}
```

由此可见
wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') 
相当于
initProxySelector方法。

因此可以认为：
const initMapStateToProps = initProxySelector；

上文说到而我们最终使用的mapStateToProps：
const mapStateToProps = initMapStateToProps(dispatch, options);

因此
最终的mapStateToProps函数其实就是initProxySelector()执行后得到的结果，我们可以认为以下是相等的：
//最终使用到的mapStateToProps
const mapStateToProps = proxy;

由此，我们看到，在各个组件中，在connect中定义的mapStateToProps其实将转化为代理方法proxy。


以上过程我们简化为：
const initMapStateToProps = wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')；
const mapStateToProps = initMapStateToProps()=proxy;
所以整个过程都基于高阶函数wrapMapToPropsFunc进行。


## wrapMapToPropsFunc
```
export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, { displayName }) {
    const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }
    proxy.dependsOnOwnProps = true
    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps)
      let props = proxy(stateOrDispatch, ownProps)
      return props
    }

    return proxy
  }
}
```

### wrapMapToPropsFunc的多层闭包函数设计方式
wrapMapToPropsFunc这个函数，其实是一个嵌套了三层的高阶闭包函数，
函数返回一个函数，返回的函数又返回一个函数，
也就是说
const proxy = wrapMapToPropsFunc(mapToProps, methodName)(dispatch, { displayName })
proxy是最终调用的mapStateToProps；

为什么使用多层闭包函数设计方式，这里的原因主要在于传值，下一次return出来的闭包函数，执行时能够始终拿到对应母函数传过来的值。
比如：
```
initProxySelector = wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')；
```
闭包函数initProxySelector每次执行的时候就可以使用mapStateToProps, 'mapStateToProps'；
```
proxy = initProxySelector(dispatch, { displayName }) ；
```
闭包函数proxy执行时，就可以始终使用dispatch, { displayName }；
所以多层闭包的使用，最主要还是为了能够多一次传值 给最终返回闭包的函数 使用。
*多层闭包函数设计方式也是一个很妙的js设计方法。*

### wrapMapToPropsFunc分析
明白了多层闭包设计的目的，我们针对wrapMapToPropsFunc多层执行的用意：
const proxy = wrapMapToPropsFunc(mapToProps, methodName)(dispatch, { displayName })

#### wrapMapToPropsFunc(mapToProps, methodName)
它就是为了给后面返回的闭包函数提供参数数据mapToProps, methodName；
这里的mapToProps就是组件内定义的mapStateToProps；

#### initProxySelector(dispatch, { displayName })
initProxySelector:
```
//wrapMapToProps.js 
return function initProxySelector(dispatch, { displayName }) {
    const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
    }
    proxy.dependsOnOwnProps = true
    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
    }
    return proxy
  }
```
initProxySelector(dispatch, { displayName })做了三件事情：
1、提供参数变量 dispatch, { displayName }）供以后的闭包函数使用；
2、设置proxy.dependsOnOwnProps = true
3、定义proxy

## proxy
最后再看重头戏：
```
const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }
    proxy.dependsOnOwnProps = true
    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps
      //getDependsOnOwnProps判断mapToProps方法有几个形参，如果为一个，就为false，如果有两个形参为true；
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps)
      let props = proxy(stateOrDispatch, ownProps)
     return props
    }
```
因为 proxy.mapToProps = mapToProps这样赋值过后，在mapToPropsProxy(stateOrDispatch, ownProps)执行第一次后，
以后每次执行，代码等同与：
```
const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
        return mapToProps(stateOrDispatch, ownProps)
    }
```
也因此 proxy 完全等同于 函数mapToProps；
而mapToProps就是组件中定义的mapStateToProps
```
//组件中定义的mapStateToProps
proxy === mapStateToProps
```
proxy这样的设计有几点用意：
1、通过传入的stateOrDispatch形参的个数，设置proxy.dependsOnOwnProps；
控制是否传入ownProps参数。
2、设计灵活，根据不同的判断调用不同的函数或传入不同的参数，后期还可以加需求
3、代码更直观，美观

经过上面绕了一大圈一大圈，其实你发现 上面四个js什么都没做，
将mapStateToProps传进去后，又原封不动返回出来了mapStateToProps；
其实这种模式下，能够包装mapStateToProps，让用户使用更加简洁定义mapStateToProps，然后框架层面进行包装。

## 对于proxy的理解举例
```
    function fn(a,b) {
        console.log(a)
        console.log(b)
        return {...a}
    }
   function wrapMapToPropsFunc(mapToProps) {
        const proxy = function mapToPropsProxy(stateOrDispatch) {
            return proxy.dependsOnOwnProps
                ? proxy.mapToProps(stateOrDispatch,5)
                : proxy.mapToProps(stateOrDispatch)
        }
        proxy.dependsOnOwnProps = true
        proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch) {
            console.log(1)
            proxy.mapToProps = mapToProps
            //proxy.mapToProps重新定义为mapToProps也就是fn，以后再次执行将只执行fn；
            //不会再执行detectFactoryAndVerify，这种设计模式下，detectFactoryAndVerify只会执行一遍，
            // 后期每次执行都只是执行fn
            //所以这里都abc完全等于fn
            proxy.dependsOnOwnProps = false
            //由于fn是一个返回对象都函数，所以这里需要执行 本身 返回一次对象
            let props = proxy(stateOrDispatch)
            return props
        }
        return proxy
    }

    var abc = wrapMapToPropsFunc(fn);
    abc();//执行detectFactoryAndVerify
    abc();//不再执行detectFactoryAndVerify
    // 所以这里都abc完全等于fn，proxy也安全等于fn
    // 以上设计，会得到如下结果：
    // todo abc=proxy=fn
```

## proxy进阶分析
mapStateToProps可以定义为如下形式，当为此种模式时每次执行mapStateToProps可以获得初始时的initstate，
```
const mapStateToPropsCreator = (state)=>{
    return ({addRedux:state.addRedux})
};
const mapStateToProps = (initstate,ownprops)=>{
    return mapStateToPropsCreator;
};
```
这都是在proxy上定义：
```
 const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      ....
    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      ....
      if (typeof props === 'function') {
        proxy.mapToProps = props
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props)
        props = proxy(stateOrDispatch, ownProps)
      }
    ....
    }
    return  proxy
```




本篇完
-----------------






@[TOC](react-redux 源码解读之connect的mapDispatchToProps)
connect对于mapDispatchToProps的处理跟mapStateToProps的处理流程是一样的，只有一点点差别，理解mapDispatchToProps时，可以结合mapStateToProps来理解。
## 以这样写法的mapDispatchToProps为例讨论
```
const faActionCreators = {
    abc:aaa=>{
        return {
            type:'ADD',
            id:num++,
            text:aaa,
        }
    },
    qqw:aaa=>({
        type:'TYY',
        id:num++,
        text:aaa,
    }),
    noa:aaa=>({
        type:'nono',
        id:num++,
        text:aaa,
    })
}
const mapDispatchToProps = faActionCreators;
```
在connectAdvanced.js的Connect组件中：
constructor内，定义了
this.initSelector()；
从而会执行一次
const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
而且在Connect组件中，只在此时执行一次selectorFactory，以后都不会执行。
selectorFactory()
就是执行
selectorFactory.js 的 finalPropsSelectorFactory()
从而执行一次
const mapDispatchToProps = initMapDispatchToProps(dispatch, options)

initMapDispatchToProps其实就是
wrapMapToProps.js的initConstantSelector；

组件在整个装载更新销毁过程当中只会执行一次 selectorFactory；因此只会执行一次finalPropsSelectorFactory()，因此只会执行一次initConstantSelector();

```
//initConstantSelector方法：
return function initConstantSelector(dispatch, options) {
    const constant = getConstant(dispatch, options)
    function constantSelector() { return constant }
    constantSelector.dependsOnOwnProps = false
    return constantSelector
  }
```
getConstant方法为：
```
//getConstant方法
dispatch => bindActionCreators(mapDispatchToProps, dispatch)
```

const `mapDispatchToProps` = initMapDispatchToProps(dispatch, options)

这里的`mapDispatchToProps`其实就是函数 constantSelector，从代码看，此函数不做任何事情，它是一个闭包函数，只是单纯从initMapDispatchToProps母函数中取数据，
```
而constant其实就是包装好的mapDispatchToProps：
{abc: ƒ, qqw: ƒ, noa: ƒ}
```

在selectorFactory.js中
 dispatchProps = mapDispatchToProps(dispatch, ownProps)
相当于
dispatchProps = constantSelector(dispatch, ownProps)
 可以看出dispatch, ownProps这两个参数是多余传递的。

执行selectorFactory.js中的 dispatchProps = mapDispatchToProps(dispatch, ownProps)，并没有做任何事情，只是单纯获取已经在组件装载时已经包装好的mapDispatchToProps。
由于initConstantSelector从始至终只执行一次，所以，对于外层定义的mapDispatchToProps包装，只进行一次。

## initConstantSelector与bindActionCreator
 ```
//initConstantSelector方法：
return function initConstantSelector(dispatch, options) {
    const constant = getConstant(dispatch, options)
    function constantSelector() { return constant }
    constantSelector.dependsOnOwnProps = false
    return constantSelector
  }
```
从代码看，initConstantSelector做了两件事：
1、返回一个constantSelector闭包函数；
2、执行getConstant(dispatch, options)获得constant，其目的就是存储好给闭包函数constantSelector使用

getConstant方法为：
```
//getConstant方法
dispatch => bindActionCreators(mapDispatchToProps, dispatch)
```
本文示例中，
actionCreators = faActionCreators；

```
export default function bindActionCreators(actionCreators, dispatch) {
  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

本文示例中，
actionCreator = aaa=>{
        return {
            type:'ADD',
            id:num++,
            text:aaa,
        }
    }；
    
function bindActionCreator(actionCreator, dispatch) {
  return function() {
  //很妙的一个用法，通过apply与arguments，父函数可以达到最轻松自由灵活的使用子函数actionCreator
  // 最终外层发送dispatch时，都会断点进入到这里
    return dispatch(actionCreator.apply(this, arguments))
  }
}
```
## mapDispatchToProps小结
mapDispatchToProps的包装只会在组件装载时，在构造函数中包装一次，以后直至组件销毁，不会再做包装的工作。

在在selectorFactory.js中
 dispatchProps = mapDispatchToProps(dispatch, ownProps)并没有做任何事情，只是单纯获取已经在组件装载时已经包装好的mapDispatchToProps；
 因为组件更新的时候，会执行this.selector.run(this.props),根据条件不同，可能会执行到 dispatchProps = mapDispatchToProps(dispatch, ownProps)，就算这个代码执行了，也不会再次包装mapDispatchToProps，而只是简单的取数据而已。
 
 mapDispatchToProps被包装后，最终的模样是什么，包装成的模样其实就是bindActionCreator源码写的(上文已经提到)，直接给出包装后最终模样：
```
const mapDispatchToProps = (dispatch)=>{
  return {
    abc:aaa=>{
      dispatch({
        type:'ADD',
        id:num++,
        text:aaa,
      })
    }}
```
如果好奇，可以在bindActionCreator源码断点查看。

## mapDispatchToProps 与 mapStateToProps的不同

组件更新，会执行this.selector.run(this.props)；
会触发selectorFactory.js中都会执行
mapDispatchToProps(dispatch, ownProps)
mapStateToProps(state, ownProps)
但是只有组件装载过程中，第一次运行this.selector.run，才会执行同时执行
dispatchProps = mapDispatchToProps(dispatch, ownProps) （handleFirstCall方法）
nextStateProps =mapStateToProps(state, ownProps)
这一次执行获得的dispatchProps将会被闭包保存，供以后每次this.selector.run后使用；
以后每次执行this.selector.run,基本上可以认为不再执行dispatchProps = mapDispatchToProps(dispatch, ownProps) ；
而只是从第一次存储好的闭包的上下文取dispatchProps，
但以后每次执行this.selector.run都会执行nextStateProps =mapStateToProps(state, ownProps)，然后更新组件都nextStateProps；

所以组件在运行当中，dispatchProps始终是相同都，nextStateProps只要有更新是动态变化都。









本篇完
-----------------

@[TOC](react-redux之mapDispatchToProps与mapStateToProps多种写法)
## mapDispatchToProps多种写法
传统写法：
```
const mapDispatchToProps = (dispatch)=>{
  return {
    abc:aaa=>{
        // console.log('ADD')
      dispatch({
        type:'ADD',
        id:num++,
        text:aaa,

      })
    },
      qqw:aaa=>{
          // console.log('TYY')
          dispatch({
              type:'TYY',
              id:num++,
              text:aaa,

          })
      },
      noa:aaa=>{
          // console.log('nono')
          dispatch({
              type:'nono',
              id:num++,
              text:aaa,

          })
      }
  }
}
```

```
const faActionCreators = {
    abc:aaa=>{
        return {
            type:'ADD',
            id:num++,
            text:aaa,
        }
    },
    qqw:aaa=>({
        type:'TYY',
        id:num++,
        text:aaa,
    }),
    noa:aaa=>({
        type:'nono',
        id:num++,
        text:aaa,
    })
}

//方法二
const mapDispatchToProps = faActionCreators;


//方法三
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(faActionCreators, dispatch);
};
```

## mapStateToProps多种写法
1、经典写法
```
//mapStateToProps第一种写法
const mapStateToProps = (state)=>{
    return ({addRedux:state.addRedux})
};
```

2、mapStateToProps 返回函数的方法
```
//mapStateToProps第二种写法
// mapStateToPropsCreator 其实就是正常写法、第一种写法的mapStateToProps
const mapStateToPropsCreator = (state)=>{
    return ({addRedux:state.addRedux})
};
//这种写法的好处就是能够在每次执行mapStateToProps都可以使用初始状态initstate
const mapStateToProps = (initstate,ownprops)=>{
    console.log(initstate);
    return mapStateToPropsCreator;
};
```


本篇完
-----------------

