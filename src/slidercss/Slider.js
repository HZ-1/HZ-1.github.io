/**
 * Created by Administrator on 2018/3/8 0008.
 */
import React, { Component } from 'react';
import SliderItem from './SliderItem';


export default class Slider extends Component {
    constructor() {
        super();
    }

    //设置transform
    cssTransform(ele, attr, val){
        if(!ele.transform){
            ele.transform = {};
        };
        //当传入值时对属性进行设置。
        if(arguments.length > 2){
            ele.transform[attr] = val;
            var sval = '';
            for(var s in ele.transform){
                if(s === 'translateX'){
                    sval += s + '(' + ele.transform[s] + 'px)';
                }
                //如果实在不理解，可以console.log(sval)可以看到到最后一张时会有一个先跳到第二张再快速到第三张的过程
                ele.style.WebkitTransform = ele.style.transform = sval;
            }
        }
        else{
            val = ele.transform[attr];
            if(typeof val === 'undefined'){
                if(attr === 'translateX'){
                    val = 0;
                }
            };
            return val;
        }
    }
//自动轮播
    auto(){
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            //当到达最后一张时
            if(this.now === this.props.len - 1){
                this.now = this.props.len / 2 - 1;
                //这两句代码很重要，是实现的关键，none是为了不出现平移而是直接跳变
                this.LunBoEle.style.transition = 'none';
                this.cssTransform(this.LunBoEle, 'translateX', - this.now * this.sliderWidth);
            }
            //定时是为了tab函数中执行的csstransform函数与上面到达最后一张时的csstransform有先后，不然仍会导致右移；
            setTimeout(() => {
                this.now++;
                this.tab();
            }, 30);
        }, this.props.delay * 1000);
    }

    tab(){
        this.LunBoEle.style.transition = '.5s';
        this.cssTransform(this.LunBoEle, 'translateX', -this.now * this.sliderWidth);
        let SelectIndex = this.now % (this.props.len / 2);
        $('.slider-dots-wrap span').eq(SelectIndex).addClass('slider-dot-selected').siblings().removeClass('slider-dot-selected');
    }
    componentDidMount() {
        this.LunBoEle = document.querySelector('ul.lunbo');
        this.SliderEle = document.querySelector('.slider');
        this.sliderWidth = $('.slider').width();
        this.cssTransform(this.LunBoEle, 'translateX', 0);
        this.auto.bind(this)();
        this.SliderEle.addEventListener('touchstart', this.touchstart, false);
        this.SliderEle.addEventListener('touchmove', this.touchmove, false);
        this.SliderEle.addEventListener('touchend', this.touchend, false);
    }
//触发
    touchStart(e){
        e.stopPropagation();
        if(!this.stopped){
            clearInterval(this.timer);
            this.LunBoEle.style.transition = 'none';
            let moveX = this.cssTransform.bind(this)(this.LunBoEle, 'translateX');
            this.now = Math.round(-moveX / this.sliderWidth);
            if(this.now === 0){
                this.now = this.props.len / 2;
            }else if(this.now === this.props.len - 1){
                this.now = this.props.len / 2 - 1;
            }
            this.cssTransform(this.LunBoEle, 'translateX', -this.now * this.sliderWidth);
            this.startPoint = e.changedTouches[0].pageX;
            this.startEle = this.cssTransform.bind(this)(this.LunBoEle, 'translateX');
        }
    };
//移动
    touchMove(e){
        e.preventDefault();
        e.stopPropagation();
        if(!this.stopped){
            let endPoint = e.changedTouches[0].pageX;
            let disX = endPoint - this.startPoint;
            this.cssTransform.bind(this)(this.LunBoEle, 'translateX', disX + this.startEle);
        }
    }
//平移结束
    touchEnd(e){
        e.stopPropagation();
        if(!this.stopped){
            let moveX = this.cssTransform.bind(this)(this.LunBoEle, 'translateX');
            //这边我是对移动做了判断
            if(Math.abs(moveX) > Math.abs(this.now * this.sliderWidth)){
                this.now = Math.ceil(-moveX / this.sliderWidth);
            }else{
                this.now = Math.floor(-moveX / this.sliderWidth);
            }
            this.tab.bind(this)();
            this.auto.bind(this)();
        }
    }

    componentWillUnmount(){
        //注意这边的清楚很重要，因为用户在使用时如果后台修改，用户刷新，会导致下面的dot出现问题
        clearInterval(this.timer);
        //卸载的同时需要将所有事件清除掉
        this.SliderEle.removeEventListener('touchstart', this.touchStart.bind(this), false);
        this.SliderEle.removeEventListener('touchmove', this.touchmove.bind(this), false);
        this.SliderEle.removeEventListener('touchend', this.touchend.bind(this), false);
    }
//防止如果只有一张轮播图时进行轮播
    componentDidUpdate(){
        if((this.props.len / 2) === 1){
            clearInterval(this.timer);
            this.stopped = true;
        }
        else{
            this.stopped = false;
        }
    }
    render() {
        let itemNodes = this.props.items.map((item, idx) => {
            return <SliderItem item={item} count={this.props.len} key={'item' + idx} />;
        });
        let dotNodes = [];
        let count = this.props.len / 2;
        for(let i = 0; i < count; i++){
            //为第一个dot点加上selected
            dotNodes[i] = (
                <span key={'dot' + i} className={'slider-dot' + (i === 0 ? ' slider-dot-selected' : '')}>
                </span>
            );
        }
        return (
            <div className="slider">
                <ul className="lunbo" style={{width: (this.props.len) * 100 + '%'}}>
                    {itemNodes}
                </ul>
                <div className="slider-dots-wrap">
                    {dotNodes}
                </div>
            </div>
        );
    };
}
