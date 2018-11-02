import React,{Component} from 'react';
import {connect} from 'react-redux';
import Ch1Chl from './ch1Chl';

class Chl extends Component{
  constructor(props){
    super(props)
    this.state={
      cc:114
    }
  }
  componentWillReceiveProps(nect){
    // this.setState({cc:666666665})
    console.log(`Chl:componentWillReceiveProps:::${nect&&nect.newdux&&nect.newdux[0]&&nect.newdux[0].text}`)
  }
 /* shouldComponentUpdate(){
    console.log('Chl子组件shouldComponentUpdate---')
   /!* for(let i = 0;i<1000000;i++){
      if(i===999999){
        console.log(`111${i}`)
      }
      i;
    }
    console.log('Chl子组件shouldComponentUpdate---111')*!/
    return true;
  }*/
  componentDidUpdate(){
    console.log(`Chl:componentDidUpdate`)
  }
  render(){
    console.log('Chl-render')
    // console.log(this.props.dddc)
    return (
        <div  style={{background:'#afb610',padding:'20px'}}>
          {/*<div onClick={()=>console.log(55555555)}>我是Chl子组件</div>*/}
          <div onClick={()=>{
            this.props.abc2(666666665)
            this.props.ccc(55)
            // this.setState({cc:666666665})
          }}>我是Chl子组件{this.state.cc}</div>
          <div>我是Chl从父组件接受this.props:::{this.props&&this.props.newdux&&this.props.newdux[0]&&this.props.newdux[0].text}</div>
          <Ch1Chl yyy={()=>console.log(6)}/>
          {/*<Ch1Chl aa={6} />*/}
          {/*<Ch1Chl />*/}
          {/*<Ch1Chl dd={(c)=>{ console.log(5) }}/>*/}
        </div>
    )
  }
}

let num1=1;
const mapDispatchToProps = (dispatch,ownProps)=>{
  let cc = `ii${num1}`;
  num1++;
  return {
    abc2:aaa=>{
      dispatch({
        type:'ADD',
        id:cc,
        text:aaa,
      })
    },
    ccc:(c)=>{
      console.log(c)
      ownProps.ccd(66)
    }
  }
}

const mapStateToProps = (newdux=[])=>{
  return ({newdux})
};


// export default connect(null,mapDispatchToProps)(Chl);
// export default connect(mapStateToProps,mapDispatchToProps)(Chl);
// export default connect(mapStateToProps,null)(Chl);
export default Chl;