import React,{Component} from 'react';
import {connect} from 'react-redux';

class ch2Chl extends Component{
  constructor(props){
    super(props)
    this.state={
      inputV:66
    }
  }
  componentWillReceiveProps(nect){
    const aa = nect.newdux&&nect.newdux[0]&&nect.newdux[0].text;
    // this.setState({inputV:99998})
    // console.log(`孙ch2Chl:componentWillReceiveProps:::${aa}`)
  }
/*  shouldComponentUpdate(){
    console.log('孙ch2Chl shouldComponentUpdate***********************')
    return true;
  }*/
  componentDidUpdate(){
    // console.log(`孙ch2Chl:::componentDidUpdate`)
  }
  render(){
    // console.log('孙ch2Chl-render')
    return (
        <div   style={{background:'#ff8a00',padding:'20px'}}>
          <div>ch2Chl孙</div>
          <input type="text" style={{background:'#71ff00'}} value={this.state.inputV} onChange={v=>{
            this.props.abc2(v.target.value);
            // this.setState({inputV:v.target.value})
          }}/>
        </div>
    )
  }
}

const mapStateToProps = (newdux=[])=>{
    console.log(`孙ch2Chl:::mapStateToProps`)
  return ({newdux})
};
let num1=1;
const mapDispatchToProps = (dispatch)=>{
  let cc = `ii${num1}`;
  num1++;
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

// export default connect(mapStateToProps,null)(ch2Chl);
// export default connect(null,mapDispatchToProps)(ch2Chl);
export default connect(mapStateToProps,mapDispatchToProps)(ch2Chl);
// export default ch2Chl;
