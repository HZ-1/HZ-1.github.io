import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addRedux} from "./addReducer";

class App extends Component {
  constructor(props) {
    super(props);
this.num =1;

    this.state = {
      co: {},
        tiv:'ppp',
        iflag:true,
    }
    this.cssd={}

  }


  componentWillReceiveProps(nect){
    const aa = nect.addRedux&&nect.addRedux[0]&&nect.addRedux[0].text;
    // console.log(`Fa componentWillReceiveProps::::${aa}`)
    // this.setState({inputV:aa})
    // console.log(`Fa::::componentWillReceiveProps`)
  }
  componentDidUpdate(){
    // console.log(`Fa:::componentDidUpdate`)
  }
  changeF = (e)=>{
    this.setState({tiv:e.target.value,iflag:!this.state.iflag})
  }
  content(){
    if(this.state.iflag){
      return <input  key={99} value={this.state.tiv} onChange={this.changeF}/>
    }
    return <input  key={9999} value={this.state.tiv} onChange={this.changeF}/>
  }



  render() {
    console.log('Fa-render999999999999999999||||||||||||||||||||')
      return (
        <div className="container" style={{background:'blue',padding:'20px'}}>
          <div onClick={()=>this.props.qqw(++this.num)}>fa组件--点击触发tyy</div>
          <div onClick={()=>this.props.noa(++this.num)}>点击触发nono</div>
            <input type="text" value={this.state.inputV} onChange={v=>{
            this.props.abc(++this.num);
          }}/>
        </div>
    );
  }
}
let num = 1;
const mapDispatchToProps = (dispatch)=>{
  return {
    abc:aaa=>{
        console.log('ADD')
      dispatch({
        type:'ADD',
        id:num++,
        text:aaa,

      })
    },
      qqw:aaa=>{
          console.log('TYY')
          dispatch({
              type:'TYY',
              id:num++,
              text:aaa,

          })
      },
      noa:aaa=>{
          console.log('nono')
          dispatch({
              type:'nono',
              id:num++,
              text:aaa,

          })
      }
  }
}
const mapStateToProps = (state)=>{
    console.log('fa---mapStateToProps')
  return ({addRedux:state.addRedux})
};
// const mapStateToProps = ({addRedux})=>{
//     console.log('fa---mapStateToProps')
//     return ({addRedux})
// };

// export default connect(mapStateToProps,null)(App);
// export default connect(null,mapDispatchToProps)(App);
export default connect(mapStateToProps,mapDispatchToProps)(App);
// export default connect(null,null)(App);
// export default App;
