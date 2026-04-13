import { useState, useEffect } from 'react';

interface VersionInfo {
	version: string;
	pubDate: string;
	downloads?: {
		win_x64?: { url: string };
	};
}

const VERSION_API_URL = '/api/version/latest';

export function useVersion() {
	const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVersion = async () => {
			try {
				const response = await fetch(VERSION_API_URL);
				if (!response.ok) throw new Error('Failed to fetch version');
				const data = await response.json();

				setVersionInfo({
					version: data.version || '0.0.0',
					pubDate: data.pub_date
						? new Date(data.pub_date).toLocaleDateString('zh-CN')
						: '',
					downloads: data.downloads,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		fetchVersion();
	}, []);

	return { versionInfo, loading, error };
}
