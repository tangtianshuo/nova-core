const LATEST_VERSION_URL = 'https://download.novai.net.cn/update/latest_win.json';

export interface VersionInfo {
  pub_date: string;
  version: string;
  release_notes: string;
  downloads: {
    win_x64: {
      name: string;
      url: string;
    };
  };
}

export async function getLatestVersion(): Promise<VersionInfo> {
  const response = await fetch(LATEST_VERSION_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch version info: ${response.status}`);
  }

  return response.json() as Promise<VersionInfo>;
}
