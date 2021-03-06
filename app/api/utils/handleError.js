import errorLog from 'api/log/errorLog';

export default (error, uncaught = false) => {
  let result = error;
  const responseToClientError = error.json;

  if (error instanceof Error) {
    result = { code: 500, message: error.stack };
  }

  if (responseToClientError) {
    result = { code: 500, message: error.json.error };
  }

  if (error.name === 'MongoError') {
    result.code = 500;
  }

  if (uncaught) {
    result.message = `uncaught exception or unhandled rejection, Node process finished !!\n ${result.message}`;
  }

  if (result.code === 500) {
    errorLog.error(result.message);
  }

  return result;
};
