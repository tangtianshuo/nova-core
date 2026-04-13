import { useState, useCallback } from 'react';
import { useToast } from './useToast';
import { useVersion } from './useVersion';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

export function useDownload() {
	const { showToast } = useToast();
	const { versionInfo } = useVersion();
	const [downloading, setDownloading] = useState<'windows' | 'macos' | null>(null);

	const downloadWindows = useCallback(async () => {
		if (!versionInfo?.downloads?.win_x64?.url) {
			showToast('获取下载链接失败，请稍后重试', '❌');
			return;
		}

		setDownloading('windows');

		try {
			const link = document.createElement('a');
			link.href = versionInfo.downloads.win_x64.url;
			link.download =
				versionInfo.downloads.win_x64.url.split('/').pop() ||
				'nova-agents-setup.exe';
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			showToast('下载已开始...', '✅');
		} catch {
			showToast('下载失败，请重试', '❌');
		} finally {
			setDownloading(null);
		}
	}, [versionInfo, showToast]);

	const downloadMacOS = useCallback(() => {
		showToast('macOS 版本正在加班加点开发中，敬请期待呀～ 🚀', '⌛');
	}, [showToast]);

	return {
		downloadWindows,
		downloadMacOS,
		downloading,
		versionInfo,
		githubUrl: GITHUB_URL,
	};
}
