import React,{Component} from 'react';
import {connect} from 'react-redux';

class Ch1Chl extends Component{
  constructor(props){
    super(props)
    this.state={
      inputV:'Ch1Chl'
    }
    this.ca=6665
  }

  componentWillReceiveProps(nect){
    const aa = nect.newdux&&nect.newdux[0]&&nect.newdux[0].text;
    // this.setState({inputV:99998})
    console.log(`孙Ch1Chl:componentWillReceiveProps:::${aa}`)

  }
 /* shouldComponentUpdate(){
    console.log('孙Ch1Chl shouldComponentUpdate***********************')
    return true;
  }*/
  componentDidUpdate(){
    console.log(`孙Ch1Chl:::componentDidUpdate`)
  }
  render(){
    console.log('孙Ch1Chl-render')
    console.log(this.props)
    return (
        <div  style={{background:'#ff8a00',padding:'20px'}}>
          <div  onClick={()=>{
            this.ca++;
            this.props.dd(this.ca)
            this.setState({inputV:100000000000})
          }}>ch1Chl111孙</div>
          <input type="text" style={{background:'#71ff00'}} value={this.state.inputV} onChange={v=>{
            this.props.abc2(v.target.value);
            this.setState({inputV:v.target.value})
          }}/>
        </div>
    )
  }
}
const mapStateToProps = (newdux=[],ccc)=>{
  console.log(`11111111111111111111111111:${JSON.stringify(newdux)}`)
  console.log(`111111111111111111eee11111111:${JSON.stringify(ccc)}`)
  return ({newdux})
};
let num1=1;
const mapDispatchToProps = (dispatch)=>{
  let cc = `ii${num1}`;
  num1++;
  console.log(`YYYYYYYYYYYYYYYYYYYYwwwYYYYYYYY:${JSON.stringify(66)}`)
  return {
    abc2:aaa=>{
      dispatch({
        type:'ADD',
        id:cc,
        text:aaa,
      })
    }
  }
}

// export default connect(null,mapDispatchToProps)(Ch1Chl);
// export default connect(mapStateToProps,null)(Ch1Chl);
// export default Ch1Chl;
export default connect(mapStateToProps,mapDispatchToProps)(Ch1Chl);
