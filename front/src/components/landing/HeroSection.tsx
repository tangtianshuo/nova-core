import { useVersion } from '../../hooks';

export function HeroSection() {
	const { versionInfo } = useVersion();

	return (
		<section className="text-center mb-20">
			<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
				<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
				<span className="text-sm text-zinc-300">
					{versionInfo?.version ? `v${versionInfo.version}` : 'v0.1.57'} 现已发布
				</span>
				<span className="text-xs text-zinc-500 ml-2">Apache-2.0 开源</span>
			</div>

			<h1 className="text-5xl md:text-7xl font-bold mb-6">
				<span className="text-gradient">nova-agents</span>
			</h1>
			<p className="text-xl md:text-2xl text-zinc-300 font-light mb-4 max-w-3xl mx-auto">
				让每个人都有一个懂你、能替你干活的桌面 AI Agent
			</p>
			<p className="text-base text-zinc-500 mb-10 max-w-2xl mx-auto">
				基于 Claude Agent SDK 构建，同时具备强大的人机协作能力和灵活的 IM
				Bot 交互——二合一，一键安装，零门槛。
			</p>

			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
				<a
					href="#download"
					className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary to-indigo-500 font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow flex items-center justify-center gap-2"
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
					免费下载
				</a>
				<a
					href="#features"
					onClick={(e) => {
						e.preventDefault();
						document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}}
					className="w-full sm:w-auto px-8 py-4 rounded-full glass-card font-semibold text-lg hover:bg-white/10 transition-all cursor-pointer text-zinc-200 flex items-center justify-center gap-2"
				>
					了解功能
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
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</a>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
				<div className="glass-card rounded-2xl p-6">
					<div className="text-3xl font-bold text-gradient mb-1">10+</div>
					<div className="text-sm text-zinc-400">模型供应商</div>
				</div>
				<div className="glass-card rounded-2xl p-6">
					<div className="text-3xl font-bold text-gradient mb-1">MCP</div>
					<div className="text-sm text-zinc-400">工具协议支持</div>
				</div>
				<div className="glass-card rounded-2xl p-6">
					<div className="text-3xl font-bold text-gradient mb-1">3</div>
					<div className="text-sm text-zinc-400">大平台支持</div>
				</div>
				<div className="glass-card rounded-2xl p-6">
					<div className="text-3xl font-bold text-gradient mb-1">100%</div>
					<div className="text-sm text-zinc-400">本地数据</div>
				</div>
			</div>
		</section>
	);
}
