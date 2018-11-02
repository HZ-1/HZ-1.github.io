import React,{Component} from 'react';
import {connect} from 'react-redux';
// import Ch2Chl from './ch2Chl';

class Chl2 extends Component{
  constructor(props){
    super(props)
    this.state={
      inputV:66
    }
  }
  componentWillReceiveProps(nect){
    // console.log(`Chl2::::${nect.newdux&&nect.newdux[0]&&nect.newdux[0].text}`)
  }
  shouldComponentUpdate(){
    console.log('Chl2-2 shouldComponentUpdate***********************')
    return true;
  }
  componentDidUpdate(){
    console.log(`Chl2-2:::componentDidUpdate`)
  }
  render(){
    console.log('Chl2-2-render')
    console.log(this.props)
    return (
        <div>
          <div>我是子组件Chl2</div>
          {/*<div>我是子组件Chl2从父组件接受Chl2this.props:::{this.props.newdux&&this.props.newdux[0]&&this.props.newdux[0].text}</div>*/}
          <input type="text" style={{background:'red'}} value={this.state.inputV} onChange={v=>{
            // this.props.abc2(v.target.value);
            this.setState({inputV:v.target.value})
          }}/>
        </div>
    )
  }
}

const mapStateToProps = (newdux=[])=>{

  return ({newdux})
};
let num1=1;
const mapDispatchToProps = (dispatch)=>{
  let cc = `ii${num1}`;
  num1++;
  return {
    abc2:aaa=>{
      dispatch({
        type:'ADD11',
        id:cc,
        text:aaa,
      })
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chl2);
// export default Chl2;