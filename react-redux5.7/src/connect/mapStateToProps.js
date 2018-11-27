import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

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
//以上结合match使用，妙的地方在于 ：
// match是使用length--进行for遍历，所以whenMapStateToPropsIsMissing是第一个被match处理的。
// whenMapStateToPropsIsMissing只处理mapStateToProps为空情况，当mapStateToProps有值的时候，
//返回一个undefined，从而通过match让whenMapStateToPropsIsFunction来处理
//match函数通过return终止操作

export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing
]
