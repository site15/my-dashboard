import axios, { AxiosResponse } from 'axios';

export interface GitHubReleaseAsset {
  id: number;
  name: string;
  browser_download_url: string;
  content_type: string;
  size: number;
}

export interface GitHubRelease {
  id: number;
  name: string;
  tag_name: string;
  published_at: string;
  assets: GitHubReleaseAsset[];
}

export class ReleaseService {
  private readonly GITHUB_API_URL = 'https://api.github.com/repos/site15/my-dashboard/releases?per_page=10000';

  async getMobileApkDownloadUrl(): Promise<string | null> {
    try {
      // Fetch releases from GitHub API
      const response: AxiosResponse<GitHubRelease[]> = await axios.get(this.GITHUB_API_URL, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MyDashboard-App'
        }
      });

      const releases = response.data;

      // Find the first release whose name starts with 'mobile@'
      const mobileRelease = releases.find(release => 
        release.name && release.name.startsWith('mobile@')
      );

      if (!mobileRelease) {
        console.warn('No mobile release found');
        return null;
      }

      // Find the asset with name 'app-release-signed.apk'
      const apkAsset = mobileRelease.assets.find(asset => 
        asset.name === 'app-release-signed.apk'
      );

      if (!apkAsset) {
        console.warn('No APK asset found in the mobile release');
        return null;
      }

      return apkAsset.browser_download_url;
    } catch (error) {
      console.error('Error fetching mobile APK download URL:', error);
      throw new Error('Failed to fetch mobile APK download URL');
    }
  }
}