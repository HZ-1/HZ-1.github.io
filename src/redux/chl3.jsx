import React,{Component} from 'react';
import {connect} from 'react-redux';

class Ch3 extends Component{
  constructor(props){
    super(props)
  }
  componentWillReceiveProps(){
    console.log(`子3333`)
  }
  render(){
    console.log(`子3333-render`)
    return (
        <div>
          <div>我是子组件333</div>
        </div>
    )
  }
}

// const mapStateToProps = (newdux=[])=>{
//   return ({newdux})
// };

// export default connect(mapStateToProps,null)(Chl);
export default Ch3;