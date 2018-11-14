import React, { Component } from 'react';
import Fa from './redux/fa';
// import Br from './redux/br';

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
          {/*<Br/>*/}
        </div>
    );
  }
}
export default App;
