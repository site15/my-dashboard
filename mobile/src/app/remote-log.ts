/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
let _log: Function;
let _warn: Function;
let _error: Function;
let _info: Function;
let _pending: Array<LogItem> | undefined = undefined;
let _callback: (data: any) => void;
interface LogItem {
  message: string;
  level: string;
}

/**
 * Initialize logging will override window.console and send to the serverUrl
 * @param  {string} serverUrl The servername and port number of the remote server (eg 192.168.1.1:9000)
 */
export function initLogger(callback: (data: any) => void) {
  _log = window.console.log;
  _warn = window.console.error;
  _error = window.console.error;
  _info = window.console.info;
  _callback = callback;
  window.console.log = consoleLog;
  window.console.warn = consoleWarn;
  window.console.error = consoleError;
  (window.console as any).hiddenError = hiddenError;
  window.console.info = consoleInfo;

  let lastUrl: string;
  post({
    agent: window.navigator.userAgent,
    title: window.document.title,
  });

  // Report urls
  setInterval(() => {
    if (document.location.href != lastUrl) {
      lastUrl = document.location.href;
      _log(`Url changed to ${lastUrl}`);
    }
  }, 1000);
}

function write(message: any, _arguments: any, level: string) {
  const args = Array.prototype.slice.call(_arguments);
  let msg = message;
  args.forEach((element) => {
    if (msg != '') {
      msg += ' ';
    }
    if (typeof element == 'object') {
      msg += JSON.stringify(element);
    } else {
      msg += element;
    }
  });
  // Commenting out for now. Stack is hard as it may be in the source map
  //const stack = this.getStack();

  if (!_pending) {
    _pending = [];
    setTimeout(() => {
      // Push pending log entries. We wait around for 500ms to see how much accumulates
      post(_pending);
      _pending = undefined;
    }, 500);
  }
  _pending.push({ message: msg, level: level }); // this.getStack() });
}

function getStack(): string {
  const stack = new Error().stack;
  const lines = stack?.split('\n');
  lines?.splice(0, 4);
  if (!lines || lines.length == 0) {
    return '';
  }
  return lines[0].substr(7, lines[0].length - 7); // This returns just the top of the stack
}

function post(data: any) {
  if (!data) {
    return;
  }

  try {
    _callback(data);
  } catch {
    // Logging should not cause failures
  }
}

function consoleLog(message: any, ...args: any) {
  _log(message, ...args);
  write(message, args, 'log');
}

function consoleWarn(message: any, ...args: any) {
  _warn(message, ...args);
  write(message, args, 'warn');
}

function consoleError(message: any, ...args: any) {
  _error(message, ...args);
  write(message, args, 'error');
}

function hiddenError(message: any, ...args: any) {
  write(message, args, 'error');
}

function consoleInfo(message: any, ...args: any) {
  _info(message, ...args);
  write(message, args, 'info');
}
