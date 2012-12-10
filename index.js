module.exports = encode;

function encode(obj) {
  if (obj instanceof Error) {
    return encodeError(obj);
  } else if (typeof obj === 'object') {
    var str = Object.prototype.toString.call(obj);
    if (str === '[object Array]' || str === '[object Arguments]') {
      return encodeArray(obj);
    } else {
      return encodeObject(obj);
    }
  } else {
    return obj;
  }
}

function encodeError(err) {
  var cons = '$ERROR_CONSTRUCTOR$';
  var out = {};

  out.message = err.message;
  out.name = err.name;

  if (typeof err.stack === 'string') out.stack = err.stack;
  if (typeof err.fileName === 'string') out.fileName = err.fileName;
  if (typeof err.lineNumber === 'string' || typeof err.stack === 'string') out.lineNumber = err.lineNumber;

  if (err instanceof EvalError) out[cons] = 'EvalError';
  else if (err instanceof RangeError) out[cons] = 'RangeError';
  else if (err instanceof ReferenceError) out[cons] = 'ReferenceError';
  else if (err instanceof SyntaxError) out[cons] = 'SyntaxError';
  else if (err instanceof TypeError) out[cons] = 'TypeError';
  else if (err instanceof URIError) out[cons] = 'URIError';
  else out[cons] = 'Error';

  return out;
}

function encodeArray(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    res.push(encode(arr[i]));
  }
  return res;
}
function encodeObject(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = encode(obj[key]);
  }
  return res;
}