import { useToast } from '../hooks';
import { ToastContainer } from '../components/ui';
import {
	BackgroundEffects,
	Navbar,
	HeroSection,
	FeaturesSection,
	DownloadSection,
	Footer,
	BackToTopButton,
} from '../components/landing';

const providers = [
	{ name: 'Anthropic', model: 'Claude 4.6', gradient: 'from-amber-500 to-amber-600', letter: 'A' },
	{ name: 'DeepSeek', model: 'Chat / Reasoner', gradient: 'from-blue-500 to-blue-600', letter: 'D' },
	{ name: 'Moonshot', model: 'Kimi K2', gradient: 'from-violet-500 to-purple-600', letter: 'M' },
	{ name: '智谱 AI', model: 'GLM 5 / 4.7', gradient: 'from-cyan-500 to-blue-600', letter: '智' },
	{ name: 'MiniMax', model: 'M2.5 / M2.1', gradient: 'from-rose-500 to-pink-600', letter: 'M' },
	{ name: '火山方舟', model: 'Doubao Seed', gradient: 'from-orange-500 to-red-600', letter: '火' },
	{ name: 'ZenMux', model: 'Gemini 3.1', gradient: 'from-emerald-500 to-teal-600', letter: 'Z' },
	{ name: '硅基流动', model: 'Kimi / GLM', gradient: 'from-slate-500 to-gray-600', letter: '硅' },
	{ name: 'OpenRouter', model: 'GPT-5.2 / Gemini 3', gradient: 'from-indigo-500 to-blue-600', letter: 'O' },
	{ name: '更多', model: '持续更新', gradient: 'from-zinc-500 to-zinc-600', letter: '+' },
];

export default function LandingPage() {
	const { toasts, removeToast } = useToast();

	return (
		<>
			<BackgroundEffects />
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			<Navbar />

			<main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
				<HeroSection />

				{/* Product Showcase */}
				<section className="mb-20">
					<div className="glass-card rounded-3xl overflow-hidden">
						<div className="flex items-center gap-1 px-4 py-3 border-b border-white/5">
							<div className="flex gap-1.5">
								<div className="w-3 h-3 rounded-full bg-rose-500"></div>
								<div className="w-3 h-3 rounded-full bg-amber-500"></div>
								<div className="w-3 h-3 rounded-full bg-emerald-500"></div>
							</div>
							<div className="flex-1 flex justify-center gap-4">
								<button
									type="button"
									className="px-4 py-1.5 rounded-lg bg-brand-primary/20 text-brand-secondary text-xs font-medium"
								>
									对话
								</button>
								<button
									type="button"
									className="px-4 py-1.5 rounded-lg text-zinc-500 text-xs font-medium hover:bg-white/5"
								>
									工作区
								</button>
								<button
									type="button"
									className="px-4 py-1.5 rounded-lg text-zinc-500 text-xs font-medium hover:bg-white/5"
								>
									IM Bot
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
							<div className="lg:col-span-2 glass-inset rounded-2xl p-4">
								<div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
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
									<div>
										<div className="text-sm font-medium text-zinc-200">
											Claude Sonnet 4.6
										</div>
										<div className="text-xs text-zinc-500">在线</div>
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex gap-3 justify-end">
										<div className="max-w-[80%]">
											<div className="rounded-2xl rounded-br-md px-4 py-3 bg-brand-primary/20 border border-brand-primary/30">
												<p className="text-sm text-zinc-200">
													帮我分析这个项目的代码结构，并给出优化建议
												</p>
											</div>
											<p className="text-xs text-zinc-600 mt-1 text-right">10:32</p>
										</div>
									</div>

									<div className="flex gap-3 justify-start">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
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
										<div className="max-w-[80%]">
											<div className="glass rounded-2xl rounded-bl-md px-4 py-3">
												<p className="text-sm text-zinc-200">
													我来分析一下项目结构。这个项目采用了标准的 Tauri +
													React 架构，整体结构清晰。让我先查看一下目录结构...
												</p>
											</div>
											<p className="text-xs text-zinc-600 mt-1">10:32</p>
										</div>
									</div>

									<div className="flex gap-3 justify-start">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
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
										<div className="max-w-[80%]">
											<div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/5">
												<div className="flex items-center gap-2 mb-2">
													<div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
													<span className="text-xs font-medium text-emerald-400">
														正在使用工具
													</span>
												</div>
												<p className="text-sm font-mono text-zinc-300">
													bash: ls -la src/
												</p>
											</div>
										</div>
									</div>

									<div className="flex gap-3 justify-start">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
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
										<div className="max-w-[80%]">
											<div className="glass rounded-2xl rounded-bl-md px-4 py-3">
												<p className="text-sm text-zinc-200">
													根据分析，我发现了几个优化点：
												</p>
												<p className="text-sm text-zinc-200 mt-2">
													1. 项目结构清晰，采用标准的 Tauri + React 架构
												</p>
												<p className="text-sm text-zinc-200 mt-1">
													2. 建议将工具函数抽离到独立模块
												</p>
												<p className="text-sm text-zinc-200 mt-1">
													3. 可以考虑增加错误边界处理
												</p>
											</div>
											<p className="text-xs text-zinc-600 mt-1">10:33</p>
										</div>
									</div>
								</div>
							</div>

							<div className="glass-inset rounded-2xl p-4">
								<div className="text-sm font-medium text-zinc-300 mb-4 pb-3 border-b border-white/5">
									工作区
								</div>
								<div className="space-y-3">
									{[
										{
											name: '前端项目',
											path: 'D:/Projects/webapp',
											gradient: 'from-indigo-500 to-violet-600',
										},
										{
											name: '数据分析',
											path: 'D:/Projects/analytics',
											gradient: 'from-emerald-500 to-teal-600',
										},
										{
											name: '文档助手',
											path: 'D:/Projects/docs',
											gradient: 'from-amber-500 to-orange-600',
										},
									].map((workspace, index) => (
										<div
											key={index}
											className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
										>
											<div
												className={`w-10 h-10 rounded-lg bg-gradient-to-br ${workspace.gradient} flex items-center justify-center`}
											>
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
														d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
													/>
												</svg>
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-medium text-zinc-200 truncate">
													{workspace.name}
												</div>
												<div className="text-xs text-zinc-500 truncate">
													{workspace.path}
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="mt-6 pt-4 border-t border-white/5">
									<div className="text-xs text-zinc-500 mb-3">快捷功能</div>
									<div className="grid grid-cols-2 gap-2">
										<button
											type="button"
											className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
										>
											<svg
												className="w-4 h-4 text-brand-secondary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
											<span className="text-xs text-zinc-300">新建对话</span>
										</button>
										<button
											type="button"
											className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
										>
											<svg
												className="w-4 h-4 text-brand-secondary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span className="text-xs text-zinc-300">定时任务</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<FeaturesSection />
				<DownloadSection />

				{/* Providers Section */}
				<section id="providers" className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="text-gradient">支持 10+ 模型供应商</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto">
							按需切换，成本可控，灵活选择最适合你的 AI 模型
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{providers.map((provider, index) => (
							<div
								key={index}
								className="glass-card rounded-2xl p-4 text-center"
							>
								<div
									className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center mx-auto mb-3`}
								>
									<span className="text-lg font-bold text-white">{provider.letter}</span>
								</div>
								<h4 className="font-medium text-zinc-200 mb-1">{provider.name}</h4>
								<p className="text-xs text-zinc-500">{provider.model}</p>
							</div>
						))}
					</div>
				</section>

				{/* Architecture Section */}
				<section id="architecture" className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="text-gradient">技术架构</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto">
							Session-Centric 多实例 Sidecar 架构，稳定可靠，性能卓越
						</p>
					</div>

					<div className="glass-card rounded-3xl p-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="space-y-6">
								{[
									{
										title: 'Tauri v2 桌面框架',
										description: 'Rust 原生性能，体积小、启动快、内存占用低',
										gradient: 'from-brand-primary to-indigo-600',
									},
									{
										title: 'React + TypeScript',
										description: '现代化前端技术栈，开发体验优秀',
										gradient: 'from-emerald-600 to-teal-700',
									},
									{
										title: 'Bun + Claude Agent SDK',
										description: '多实例 Sidecar，并行运行，互不干扰',
										gradient: 'from-amber-600 to-orange-700',
									},
									{
										title: '本地数据，隐私安全',
										description: '所有数据存储在本地，隐私有保障',
										gradient: 'from-rose-600 to-pink-700',
									},
								].map((item, index) => (
									<div key={index} className="flex items-start gap-4">
										<div
											className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}
										>
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
													d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-semibold text-zinc-100 mb-1">
												{item.title}
											</h4>
											<p className="text-sm text-zinc-400">{item.description}</p>
										</div>
									</div>
								))}
							</div>

							<div className="glass-inset rounded-2xl p-6">
								<h4 className="font-semibold text-zinc-200 mb-4">技术栈</h4>
								<div className="space-y-3">
									{[
										{ label: '桌面框架', value: 'Tauri v2 (Rust)' },
										{ label: '前端', value: 'React + TS + Vite' },
										{ label: '后端', value: 'Bun + Claude Agent SDK' },
										{ label: '通信', value: 'Rust HTTP/SSE Proxy' },
										{ label: '运行时', value: 'Bun + Node.js 内置' },
									].map((item, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 rounded-xl bg-white/5"
										>
											<span className="text-sm text-zinc-300">{item.label}</span>
											<span className="text-sm text-brand-secondary">
												{item.value}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Open Source Section */}
				<section className="mb-20">
					<div className="glass-card rounded-3xl p-8 text-center feature-shine">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center mx-auto mb-6 glow-primary">
							<svg
								className="w-8 h-8 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</div>
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							<span className="text-gradient">完全开源，Apache-2.0</span>
						</h2>
						<p className="text-zinc-400 max-w-xl mx-auto mb-8">
							nova-agents 是开源项目，代码完全透明，欢迎贡献和定制
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<a
								href="https://github.com/tangtianshuo/nova-agents"
								target="_blank"
								rel="noreferrer"
								className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-primary to-indigo-500 font-semibold hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow flex items-center gap-2"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								查看 GitHub
							</a>
							<a
								href="specs/tech_docs/architecture.md"
								className="px-6 py-3 rounded-full glass-card font-semibold hover:bg-white/10 transition-all cursor-pointer text-zinc-200 flex items-center gap-2"
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
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								技术文档
							</a>
						</div>
					</div>
				</section>
			</main>

			<Footer />
			<BackToTopButton />
		</>
	);
}
