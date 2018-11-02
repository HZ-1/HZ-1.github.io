import React,{Component} from 'react';
import {connect} from 'react-redux';
import Ch2Chl from './ch2Chl';

class Chl2 extends Component{
  constructor(props){
    super(props)
      this.aa = {...props.uu};
    this.state={
      inputV:6611,
        dd:{...props.uu},
        cc:[...props.acd]
    }
  }

    // shouldComponentUpdate(nextProps, nextState) {
    //     for (const propType in nextProps) {
    //         if (nextProps.hasOwnProperty(propType)) {
    //             if (nextProps[propType] !== this.props[propType]) {
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     for (const propType in this.props) {
    //         if (this.props.hasOwnProperty(propType)) {
    //             if (nextProps[propType] !== this.props[propType]) {
    //                 return true;
    //             }
    //         }
    //     }
    //     for (const propType in nextState) {
    //         if (nextState.hasOwnProperty(propType)) {
    //             if (nextState[propType] !== this.props[propType]) {
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     for (const propType in this.state) {
    //         if (this.state.hasOwnProperty(propType)) {
    //             if (nextState[propType] !== this.state[propType]) {
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     return false;
    // }

    componentWillReceiveProps(){
    // console.log(`Chl2:componentWillReceiveProps:::${nect.newdux&&nect.newdux[0]&&nect.newdux[0].text}`)
    // console.log(`Chl2:componentWillReceiveProps:::`)
  }
  /*shouldComponentUpdate(){
    console.log('Chl2 shouldComponentUpdate***********************')
    return true;
  }*/
  componentDidUpdate(){
    // console.log(`Chl2:::componentDidUpdate`)
  }
  render(){
    console.log('Chl2-render')
    // console.log(this.props)
    return (
        <div style={{background:'#a71ccd',padding:'20px'}}>
          <div>我是子组件Chl2{this.state.dd.a}</div>
          <div>我是子组件Chl2从父组件接受Chl2this.props:::{this.props&&this.props.reduxTwo&&this.props.reduxTwo[0]&&this.props.reduxTwo[0].text}</div>
          <input type="text" style={{background:'#71ff00'}} value={this.state.inputV} onChange={v=>{
            this.aa.a=v.target.value;
              // console.log(this.state.dd)
            this.props.abc2(v.target.value);
            // this.setState({dd:{a:99999}})
          }}/>
          <Ch2Chl/>
        </div>
    )
  }
}

const mapStateToProps = ({reduxTwo=[]})=>{
console.log(`ch2----mapStateToProps`)
  return ({reduxTwo})
};
let num1=1;
const mapDispatchToProps = (dispatch)=>{
  let cc = `ii${num1}`;
  num1++;
  return {
    abc2:aaa=>{
      dispatch({
        type:'TYYuuuuu',
        id:cc,
        text:aaa,
      })
    }
  }
}

Chl2.defaultProps={
    dd:{},
    acd:[]
}

// export default connect(null,mapDispatchToProps)(Chl2);
export default connect(mapStateToProps,mapDispatchToProps)(Chl2);
// export default connect(mapStateToProps,null,)(Chl2);
// export default Chl2;
