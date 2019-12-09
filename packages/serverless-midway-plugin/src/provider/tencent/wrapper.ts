export const wrapperContent = `const { FaaSStarter } = require('@midwayjs/faas');
const { asyncWrapper, start } = require('@midwayjs/serverless-scf-starter');

let starter;
let runtime;
let inited = false;

const initializeMethod = async (config = {}) => {
  runtime = await start();
  starter = new FaaSStarter({ config, baseDir: __dirname });
  await starter.start();
  inited = true;
};

exports.initializer = asyncWrapper(async ({config} = {}) => {
  await initializeMethod(config);
});

<% handlers.forEach(function(handlerData){ %>
exports.<%=handlerData.name%> = asyncWrapper(async (...args) => {
  if (!inited) {
    await initializeMethod();
  }
  return runtime.asyncEvent(starter.handleInvokeWrapper('<%=handlerData.handler%>'))(...args);
});
<% }); %>`;
