/**
 * Created by Administrator on 2018/3/8 0008.
 */
import React, { Component } from 'react';
import Slider from './Slider';

export default class SliderItem extends Component {
    constructor() {
        super();
    }

    getBannerList(data){
        data = data.concat(data);//复制所有图片加在后面
        this.setState({BannerList: data, len: data.length});
    }
    render(){
        return (
            <div className="slider-box">
                <Slider items={this.state.BannerList} len={this.state.len} speed={0.5} delay={3} autoplay={true}/>
            </div>
        );
    }
}
