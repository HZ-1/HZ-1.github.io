import React,{Component} from 'react';
import {connect} from 'react-redux';

class Br extends Component{
  constructor(props){
    super(props)
    this.state={
      aa:55,
    }
    this.ca=100
  }
  render(){
    console.log(`Br---render||||||||||||||||||||`)
    return (
        <div>
          <div onClick={()=>{
            this.ca++;
            this.setState({aa:this.ca})
          }}>我是兄弟组件Br{this.state.aa}</div>
        </div>
    )
  }
}

const mapStateToProps = ({tyyReducer=[]})=>{
    console.log(`Br---mapStateToProps`)
  return ({www:tyyReducer})
};
// const mapStateToProps = (state)=>{
//     console.log(`Br---mapStateToProps`)
//     return ({www:state.tyyReducer})
// };

export default connect(mapStateToProps,null)(Br);
// export default Br;
