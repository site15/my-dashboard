import { router } from '../trpc';
import { ReleaseService } from '../../services/release.service';
import { publicProcedure } from '../trpc';

const releaseService = new ReleaseService();

export const releasesRouter = router({
  getMobileApkUrl: publicProcedure.query(async () => {
    return await releaseService.getMobileApkDownloadUrl();
  }),
});