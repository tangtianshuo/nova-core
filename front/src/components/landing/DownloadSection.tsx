import { useDownload } from '../../hooks';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

export function DownloadSection() {
	const { downloadWindows, downloadMacOS, downloadStatus, versionInfo } = useDownload();

	return (
		<section id="download" className="mb-20">
			<div className="text-center mb-12">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">
					<span className="text-gradient">免费下载</span>
				</h2>
				<p className="text-zinc-400 max-w-2xl mx-auto">
					支持 macOS 和 Windows，一键安装，开箱即用
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{/* macOS Download */}
				<div className="glass-card rounded-3xl p-8 feature-shine">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-zinc-300"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
							</svg>
						</div>
						<div>
							<h3 className="text-xl font-semibold text-zinc-100">macOS</h3>
							<p className="text-sm text-zinc-500">
								macOS 13.0+ (Apple Silicon & Intel)
							</p>
						</div>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Apple Silicon (M1/M2/M3)
						</div>
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Intel 处理器
						</div>
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							DMG 安装包
						</div>
					</div>

					<button
						type="button"
						onClick={downloadMacOS}
						className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-indigo-500 font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow flex items-center justify-center gap-2"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						下载 for macOS
					</button>
					<p className="text-center text-xs text-zinc-500 mt-3">
						{versionInfo?.version ? `v${versionInfo.version}` : 'v0.1.57'} · DMG · ~85MB
					</p>
				</div>

				{/* Windows Download */}
				<div className="glass-card rounded-3xl p-8 feature-shine">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-300"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
							</svg>
						</div>
						<div>
							<h3 className="text-xl font-semibold text-zinc-100">Windows</h3>
							<p className="text-sm text-zinc-500">Windows 10 及以上</p>
						</div>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							x64 架构
						</div>
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							NSIS 安装包
						</div>
						<div className="flex items-center gap-3 text-sm text-zinc-400">
							<svg
								className="w-4 h-4 text-emerald-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							便携版可用
						</div>
					</div>

					<button
						type="button"
						onClick={downloadWindows}
						disabled={downloadStatus === 'getting_link' || downloadStatus === 'downloading'}
						className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-indigo-500 font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<svg
							className={`w-5 h-5 ${(downloadStatus === 'getting_link' || downloadStatus === 'downloading') ? 'animate-spin' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						{downloadStatus === 'getting_link' ? '获取下载链接...' : downloadStatus === 'downloading' ? '正在下载...' : downloadStatus === 'error' ? '下载失败，请重试' : '下载 for Windows'}
					</button>
					<p className="text-center text-xs text-zinc-500 mt-3">
						{versionInfo?.version
							? `v${versionInfo.version}${
									versionInfo.pub_date ? ` · 更新于 ${versionInfo.pub_date}` : ''
								}`
							: 'v0.1.57 · NSIS · ~78MB'}
					</p>
				</div>
			</div>

			{/* Other Downloads */}
			<div className="mt-8 text-center">
				<p className="text-sm text-zinc-500 mb-4">其他下载选项</p>
				<div className="flex flex-wrap items-center justify-center gap-4">
					<a
						href="#"
						className="px-4 py-2 rounded-xl glass-inset hover:bg-white/10 transition-colors text-sm text-zinc-300 cursor-pointer"
					>
						便携版 (Windows)
					</a>
					<a
						href="#"
						className="px-4 py-2 rounded-xl glass-inset hover:bg-white/10 transition-colors text-sm text-zinc-300 cursor-pointer"
					>
						Homebrew
					</a>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						className="px-4 py-2 rounded-xl glass-inset hover:bg-white/10 transition-colors text-sm text-zinc-300 cursor-pointer flex items-center gap-2"
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						GitHub Release
					</a>
				</div>
			</div>
		</section>
	);
}
