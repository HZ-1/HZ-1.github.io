import React, { Component } from 'react';
import Fa from './redux/fa';
import {connect} from 'react-redux';
import Br from './redux/br';

class App extends Component {
  constructor() {
    super();
    this.state={
      aaa:5
    }
    this.vv=8
  }
  componentWillReceiveProps(){
    // console.log(`App---xiongdi1111`)
  }

  prof=()=>{
    const aa = new Promise((r,j)=>{
      console.log('p-set')
        this.setState({aaa:this.state.aaa+1});
        r();
    })
      Promise.all([aa]).then(e=>{
        console.log('all')
      }).catch(t=>console.log(t))
  }

  componentDidUpdate(){
    console.log(`App:::componentDidUpdate`)
  }
  render() {
    console.log(666666662)
    return (
        <div>
          <div onClick={this.prof}>超级父级1111{this.state.aaa}</div>
          <div onClick={()=>this.props.abc2(this.vv++)}>超级父级1</div>
          <Fa/>
          <Br/>
        </div>
    );
  }
}
// export default App;
const mapStateToProps = ({newdux=[]})=>{
  console.log('App---mapStateToProps')
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
// export default connect(null,mapDispatchToProps)(App);
// export default connect(mapStateToProps,mapDispatchToProps)(App);
export default App;
