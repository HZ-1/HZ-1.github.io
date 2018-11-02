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
  render() {
    console.log('app---render!!!!')
    return (
        <div>
          <div onClick={()=>this.props.abc2(this.vv++)}>超级父级1</div>
          <Fa/>
          <Br/>
        </div>
    );
  }
}
// export default App;
const mapStateToProps = ({addRedux})=>{
  console.log('App---mapStateToProps')
  return ({addRedux})
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
