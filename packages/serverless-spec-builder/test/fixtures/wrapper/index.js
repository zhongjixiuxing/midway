const { FaaSStarter } = require('@midwayjs/faas');
const { asyncWrapper, start } = require('testStarter');

const picomatch = require('picomatch');
const layers = [];


let starter;
let runtime;
let inited = false;


const initializeMethod = async (initializeContext = {}) => {
  
  runtime = await start({
    layers: layers,
    getHandler: getHandler
  });
  starter = new FaaSStarter({ baseDir: __dirname, initializeContext, applicationAdapter: runtime, middleware: [
  "test1",
  "test2"
] });
  
  
  await starter.start();
   inited = true; 
  
};

const getHandler = (hanlderName) => {
  
    if (hanlderName === 'handler') {
      return  starter.handleInvokeWrapper('index.handler'); 
    }
  
}




exports.initializeUserDefine = asyncWrapper(async (...args) => {
  if (!inited) {
    await initializeMethod(...args);
  }
});


exports.handler = asyncWrapper(async (...args) => {
  if (!inited) {
    await initializeMethod();
  }
  

  const handler = getHandler('handler');
  return runtime.asyncEvent(handler)(...args);
});

