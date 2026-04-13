import { useVersion } from '../../hooks';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

export function Navbar() {
	const { versionInfo } = useVersion();

	return (
		<nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl px-6 py-4" style={{background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
			<div className="flex items-center justify-between max-w-7xl mx-auto">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary via-indigo-500 to-purple-600 flex items-center justify-center glow-primary">
						<svg
							className="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<span className="text-xl font-semibold text-gradient">nova-agents</span>
				</div>

				<div className="hidden md:flex items-center gap-1">
					<a
						href="#features"
						className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
					>
						核心能力
					</a>
					<a
						href="#download"
						className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
					>
						下载
					</a>
					<a
						href="#providers"
						className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
					>
						模型
					</a>
					<a
						href="#architecture"
						className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
					>
						架构
					</a>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
					>
						GitHub
					</a>
				</div>

				<div className="flex items-center gap-3">
					<a
						href="#download"
						className="hidden md:flex px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-indigo-500 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow"
					>
						免费下载 {versionInfo?.version && `v${versionInfo.version}`}
					</a>
					<button
						type="button"
						className="w-10 h-10 rounded-xl glass-inset hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
						aria-label="Notifications"
					>
						<svg
							className="w-5 h-5 text-zinc-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</button>
				</div>
			</div>
		</nav>
	);
}
