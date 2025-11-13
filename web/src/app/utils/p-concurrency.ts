export const KEY = Symbol('p-concurrency:queue');

const DEFAULT_WHEN = () => true;
const NEW_PROMISE = (
  handler: (
    resolve: (value: unknown) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void
  ) => void
) => new Promise(handler);

export function Concurrency(
  options:
    | {
        concurrency: number;
        global?: boolean;
        when?: typeof DEFAULT_WHEN;
        promise?: typeof NEW_PROMISE;
        key?: string;
      }
    | number
) {
  if (typeof options === 'number') {
    options = {
      concurrency: options,
    };
  } else if (Object(options) !== options) {
    throw new TypeError('options must be an object or a number');
  }

  const {
    concurrency,
    // Whether to use global queue
    global: use_global_host = false,
    when = DEFAULT_WHEN,
    promise: promise_factory = NEW_PROMISE,
    key = KEY,
  } = options;

  if (typeof concurrency !== 'number' || concurrency < 1) {
    throw new TypeError('concurrency must be a number from 1 and up');
  }

  const limiter = (fn: { apply: (arg0: any, arg1: any[]) => Promise<any> }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function limited(this: any, ...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!when.apply(this, args as any)) {
        // Should not be limited
        return fn.apply(this, args);
      }

      const host = !!this && !use_global_host ? this : limiter;

      const info =
        host[key] ||
        (host[key] = {
          size: 0,
          queue: [],
        });

      // console.log(host, info)

      const { queue } = info;

      const next = () => {
        info.size--;

        if (queue.length > 0) {
          queue.shift()();
        }
      };

      return promise_factory((resolve, reject) => {
        const run = () => {
          info.size++;

          fn.apply(this, args).then(
            (value: unknown) => {
              resolve(value);
              next();
            },
            (err: any) => {
              reject(err);
              next();
            }
          );
        };

        if (info.size < concurrency) {
          run();
        } else {
          queue.push(run);
        }
      });
    }

    return limited;
  };

  return limiter as unknown as MethodDecorator;
}
