import { createContext } from '../../../trpc/context';
import { appRouter } from '../../../trpc/routers';
import { createCustomTrpcNitroHandler } from '../../../utils/trpc-server';

// export API handler
export default createCustomTrpcNitroHandler({
  router: appRouter,
  createContext,
  onError: opts => {
    console.error(opts.error.stack);
  },
});
