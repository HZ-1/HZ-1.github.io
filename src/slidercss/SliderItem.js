/**
 * Created by Administrator on 2018/3/8 0008.
 */
import React, { Component } from 'react';

export default class SliderItem extends Component {
    constructor() {
        super();
    }

    render(){
        //设置li 的宽度，100指的是ul宽度的100％
        let width = 100 / (this.props.count) + '%';
        let img =<img src={this.props.item}/>
        return (
            <li  className="slider-item" style={{width: width}}>
                {img}
            </li>
        );
    }
}
