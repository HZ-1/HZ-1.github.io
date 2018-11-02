import React,{Component} from 'react';
import {connect} from 'react-redux';
import {reduxTwo} from "./reducer2";
// import Brchl3 from './Brchl3';

class Br extends Component{
  constructor(props){
    super(props)
    this.state={
      aa:55,
    }
    this.ca=100
  }
  componentWillReceiveProps(){
    // console.log(`Br-componentWillReceiveProps--xiongdi1111`)
  }
  componentDidUpdate(){
    // console.log(`Br:::componentDidUpdate`)
  }
  render(){
    console.log(`Br---render||||||||||||||||||||`)
    // console.log(this.props.newdux)
    return (
        <div>
          <div onClick={()=>{
            this.ca++;
            this.setState({aa:this.ca})
          }}>我是兄弟组件Br{this.state.aa}</div>
          {/*<Brchl3></Brchl3>*/}
        </div>
    )
  }
}

// const mapStateToProps = (state)=>{
//     console.log(`Br---mapStateToProps`)
//   return ({www:state.reduxTwo})
// };
const mapStateToProps = ({reduxTwo})=>{
    console.log(`Br---mapStateToProps`)
    return ({reduxTwo})
};

export default connect(mapStateToProps,null)(Br);
// export default Br;
