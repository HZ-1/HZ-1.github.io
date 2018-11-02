import React,{Component} from 'react';
import {connect} from 'react-redux';

class Ch3 extends Component{
  constructor(props){
    super(props)
  }
  componentWillReceiveProps(){
    // console.log(`子Brchl3--componentWillReceiveProps`)
  }
  componentDidUpdate(){
    // console.log(`子Brchl3:::componentDidUpdate`)
  }

  render(){
    // console.log(this.props)
    console.log(`子Brchl3-render`);
    return (
        <div>
          <div>我是子组件Brchl3</div>
        </div>
    )
  }
}
let num1=1;
const mapStateToProps = (newdux=[])=>{
  return ({newdux})
};
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


// export default connect(mapStateToProps,null)(Ch3);
// export default connect(mapStateToProps,mapDispatchToProps)(Ch3);
export default Ch3;
