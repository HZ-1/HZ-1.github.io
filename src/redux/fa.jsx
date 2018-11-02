import React, { Component } from 'react';
import {connect} from 'react-redux';
// import Chl from './chl';
// import Ch2 from './ch2';
// import Ch22 from './ch2-2';
// import Ch3 from './chl3';

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
    const aa = nect.newdux&&nect.newdux[0]&&nect.newdux[0].text;
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

  ddd = ()=>{

    // let reqUrl = 'timg?image&quality=80&size=b9999_10000&sec=1540219218987&di=63f69397582b802b21af29f8260763c4&imgtype=0&src=http%3A%2F%2Fwww.6300.net%2Fupload%2Fproduct%2F2014%2F01%2F26%2F14300872.jpg'
    let reqUrl = '/fileService/downloadFile.jspx?fileid=20181009195609275E9BB1101'
    // let reqUrl = 'fileService/downloadFile.jspx?fileid=20181009195609338FC48337C'
    let filename = 'ttttimg.xlsx';

      // //
      // const headers = new Headers({
      //     "Accept": "application/json",
      //     "Content-Type": "application/json"
      // });
      //
      //  fetch(reqUrl, {
      //     method: "GET",
      //     // headers: headers,
      // }).then(response => {
      //     console.log(response)
      //     if(response.status < 500){
      //         console.log(response.getResponseHeader)
      //         return response.blob();
      //
      //     }else{
      //         console.log(2)
      //     }
      // }).then(e=>{
      //      var url = window.URL.createObjectURL(e);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      //      var a = document.createElement('a');
      //      a.href = url;
      //      a.download = decodeURIComponent(filename);
      //      // document.body.appendChild(a);
      //      //
      //      a.click();
      //      // setTimeout(function(){
      //      //     document.body.removeChild(a);
      //      //     window.URL.revokeObjectURL(url);
      //      // },1000);
      //
      //
      //  }).catch(err => {
      //      console.log(err)
      //     // console.error(`Request failed. Url = ${url} . Message = ${err}`);
      //     // return {error: {message: "Request failed."}};
      // })



      //通用清单
      // $('#tongyong_btn').on('click', function () {
      //     console.log(9999)
      //     // var areaId = "420222";
      //     var areaIdN = "420222";
      //     var areaIdS = String(areaIdN);
      //     var areaId = areaIdS.substr(0, 6);
      //     var str = String(areaId)
      //     var cityStr = str.substr(4, 2)
      //     if (areaId == "429004" || areaId == "429005" || areaId == '429006' || areaId == '429021') {
      //         window.open('http://zwfw.hubei.gov.cn/fileService/downloadFile.jspx?fileid=20181009195609275E9BB1101')
      //     } else if (cityStr == '00') {
      //         window.open('http://zwfw.hubei.gov.cn/fileService/downloadFile.jspx?fileid=20181009195609275E9BB1101')
      //     } else {
      //         window.open('http://zwfw.hubei.gov.cn/fileService/downloadFile.jspx?fileid=20181009195609338FC48337C')
      //     }
      // })





    // fetch()

    // window.location.href = reqUrl;
      var xhr = new XMLHttpRequest();
      xhr.open("get", reqUrl, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              console.log(33)
              var data = xhr.response;
              console.log(2223)
              var link = document.createElement('a');
              link.href =
                  window.URL.createObjectURL(data);
              link.download = filename;
              link.click();
          }
      };

      xhr.send();
  }


  render() {
    console.log('Fa-render999999999999999999||||||||||||||||||||')
                          return (
        <div className="container" style={{background:'blue',padding:'20px'}}>
          {/*<div onClick={()=>{this.cssd.a=999;  this.setState({co:{...this.cssd}  })}}>fa组件{this.state.co.a}</div>*/}
          <div onClick={this.ddd}>fa组件{this.state.co.a}</div>
            {/*{this.content(this.iflag)}*/}
            <input type="text" value={this.state.inputV} onChange={v=>{
            // console.log(this.props)
            this.props.abc(++this.num);
            // this.setState({inputV:v.target.value,co:this.cssd })
            //   this.cssd.a=888;
            //   this.setState({co:{...this.cssd} })
          }}/>
            99
          {/*<Chl aaaw={(c)=>{ console.log(5)}} />*/}
          {/*<Chl aaa={5} />*/}
          {/*<Chl ccd={{a:66}} />*/}
          {/*<Ch2 uu={this.state.co}/>*/}
        </div>
    );
  }
}
let num = 1;
const mapDispatchToProps = (dispatch)=>{
  return {
    abc:aaa=>{
        console.log('add')
      dispatch({
        type:'TYY',
        // type:'ADD',
        id:num++,
        text:aaa,

      })
    }
  }
}
// const mapStateToProps = (state)=>{
//     console.log('fa---mapStateToProps')
//   return ({newdux:state.newdux})
// };
const mapStateToProps = ({newdux})=>{
    console.log('fa---mapStateToProps')
    return ({newdux})
};

// export default connect(mapStateToProps,null)(App);
// export default connect(null,mapDispatchToProps)(App);
export default connect(mapStateToProps,mapDispatchToProps)(App);
// export default connect(null,null)(App);
// export default App;
