const whm = require('./dist/whitemage.js');

var testCount = 0;
var failureCount = 0;

function runTests(){
    runTest(Tests.testMakeScene);
    runTest(Tests.testAddGameobject);
    if(failureCount == 0){
        console.log("ALL TESTS PASSED! " + testCount + " tests");
    }else{
        console.log("SOME TESTS FAILED! " + failureCount + "/" + testCount);
    }
}

function runTest(test){
    testCount += 1;
    try{
        test();
    }catch(err){
        console.error(err);
        return true;
    }
    return true;
}

var Tests = {
    testMakeScene(){
        let scene = new EmptyScene();
    },
    testAddGameobject(){
        // Need to make an instance and start it
        // let scene = new EmptyScene();
        // let o = new whm.GameObject();
        // scene.instance.addObject(o);
    }
};

function EmptyScene() {}
EmptyScene.prototype = new whm.Scene;

runTests();