import { useState, useCallback } from 'react';
import { useToast } from './useToast';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

type DownloadStatus = 'idle' | 'getting_link' | 'downloading' | 'error';

export function useDownload() {
	const { showToast } = useToast();
	const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>('idle');
	const [versionInfo, setVersionInfo] = useState<{
		version?: string;
		pub_date?: string;
		pubDateFormatted?: string;
		downloads?: {
			win_x64?: { url: string };
		};
	} | null>(null);

	const downloadWindows = useCallback(async () => {
		setDownloadStatus('getting_link');

		try {
			const response = await fetch('https://download.novai.net.cn/update/latest_win.json');
			if (!response.ok) {
				throw new Error('获取版本信息失败');
			}
			const data = await response.json();
			setVersionInfo({
				...data,
				pubDateFormatted: data.pub_date
					? new Date(data.pub_date).toLocaleDateString('zh-CN')
					: undefined,
			});

			const originalUrl = data.downloads?.win_x64?.url;
			if (!originalUrl) {
				throw new Error('未找到 Windows 下载链接');
			}

			// 替换下载链接的 domain 为 download.novai.net.cn
			const urlObj = new URL(originalUrl);
			const downloadUrl = `https://download.novai.net.cn${urlObj.pathname}`;

			setDownloadStatus('downloading');

			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = downloadUrl.split('/').pop() || 'nova-agents-setup.exe';
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Download error:', error);
			setDownloadStatus('error');
			setTimeout(() => {
				setDownloadStatus('idle');
			}, 2000);
		}
	}, []);

	const downloadMacOS = useCallback(() => {
		showToast('macOS 版本正在加班加点开发中，敬请期待呀～ 🚀', '⌛');
	}, [showToast]);

	return {
		downloadWindows,
		downloadMacOS,
		downloadStatus,
		versionInfo,
		githubUrl: GITHUB_URL,
	};
}
