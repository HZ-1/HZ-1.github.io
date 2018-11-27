
// function connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     mergeProps,
//     {
//         pure = true,
//         areStatesEqual = 1,
//         areOwnPropsEqual = 2,
//         areStatePropsEqual = 3,
//         areMergedPropsEqual = 4,
//         ...extraOptions
//     } = {}
// ) {
//
//    console.log(extraOptions);
//    console.log(areStatesEqual);
// }

//传参中后面的={}写得妙，没有那个，这样调用connect(1)就会报错，ab undefined，
function connect(u,{ab=9,...op}={}) {
    console.log(u);//1
    console.log(ab);//2
    console.log(op);//{ cd: 99, er: 123 }
}

connect(1,{ab:2,cd:99,er:123})



function f() {
    let a=9;
    function f1() {
        a++;
        console.log(a)
    }
    function f2() {
        a++;
        console.log(a)
    }
    return a%2 ?f1() : f2();
}


