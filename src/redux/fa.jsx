import React, { Component } from 'react';
import {connect} from '../../node_modules/react-redux/lib';
import {tyyReducer} from "./tyyReducer";
import { bindActionCreators } from 'redux'


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
        <div className="container" style={{background:'grey',padding:'20px'}}>
          <div onClick={()=>this.props.qqw(++this.num)}>fa组件--点击触发tyy</div>
          <div onClick={()=>this.props.noa(++this.num)}>点击触发nono</div>
          <div onClick={()=>this.props.abc(++this.num)}>点击触发add</div>
        </div>
    );
  }
}
let num = 1;

//写法一 传统写法
// const mapDispatchToProps = (dispatch)=>{
//   return {
//     abc:aaa=>{
//         // console.log('ADD')
//       dispatch({
//         type:'ADD',
//         id:num++,
//         text:aaa,
//
//       })
//     },
//       qqw:aaa=>{
//           // console.log('TYY')
//           dispatch({
//               type:'TYY',
//               id:num++,
//               text:aaa,
//
//           })
//       },
//       noa:aaa=>{
//           // console.log('nono')
//           dispatch({
//               type:'nono',
//               id:num++,
//               text:aaa,
//
//           })
//       }
//   }
// }

const faActionCreators = {
    abc:aaa=>{
        console.log(9232666);
        return {
            type:'ADD',
            id:num++,
            text:aaa,
        }
    },
    qqw:aaa=>({
        type:'TYY',
        id:num++,
        text:aaa,
    }),
    noa:aaa=>({
        type:'nono',
        id:num++,
        text:aaa,
    })
}

//写法二
// const mapDispatchToProps = faActionCreators;



//写法三
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(faActionCreators, dispatch);
};



//mapStateToProps第一种写法结束-------
const mapStateToProps = (state)=>{
    return ({addRedux:state.addRedux})
};

//mapStateToProps第二种写法开始------
//mapStateToProps的两种写法---第二种写法，
//mapStateToPropsCreator 其实就是正常写法、第一种写法的mapStateToProps
// const mapStateToPropsCreator = (state)=>{
//     return ({addRedux:state.addRedux})
// };
//
// //这种写法的好处就是能够在每次执行mapStateToProps都可以使用初始状态initstate
// const mapStateToProps = (initstate,ownprops)=>{
//     console.log(initstate);
//     return mapStateToPropsCreator;
// };
//mapStateToProps第二种写法结束-------



// export default connect(mapStateToProps,null)(App);
// export default connect(null,mapDispatchToProps)(App);
export default connect(mapStateToProps,mapDispatchToProps)(App);
// export default connect(null,null)(App);
// export default App;



