import { useEffect, useMemo, useState } from "react"

type DownloadLinks = {
	macosDmg?: string
	windowsNsis?: string
	windowsPortable?: string
	homebrew?: string
	githubRelease?: string
}

export default function LandingPage() {
	const [showBackToTop, setShowBackToTop] = useState(false)

	const downloads: DownloadLinks = useMemo(
		() => ({
			githubRelease: "https://github.com/nova-agents/nova-agents",
		}),
		[],
	)

	useEffect(() => {
		const onScroll = () => {
			setShowBackToTop(window.scrollY > 500)
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		onScroll()

		return () => {
			window.removeEventListener("scroll", onScroll)
		}
	}, [])

	return (
		<>
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="orb orb-1"></div>
				<div className="orb orb-2"></div>
				<div className="orb orb-3"></div>
			</div>

			<div className="fixed inset-0 grid-pattern"></div>

			<nav className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl px-6 py-4">
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
						<span className="text-xl font-semibold text-gradient">
							nova-agents
						</span>
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
							href="https://github.com/nova-agents/nova-agents"
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
							免费下载
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

			<main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
				<section className="text-center mb-20">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
						<span className="text-sm text-zinc-300">v0.1.57 现已发布</span>
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
					<p className="text-center text-[14px] font-medium italic tracking-wide text-zinc-400 mb-10">
						“一念既起，万事皆成”
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
											<p className="text-xs text-zinc-600 mt-1 text-right">
												10:32
											</p>
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
									<div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
										<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
											<svg
												className="w-5 h-5 text-indigo-300"
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
												前端项目
											</div>
											<div className="text-xs text-zinc-500 truncate">
												D:/Projects/webapp
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
										<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
											<svg
												className="w-5 h-5 text-emerald-300"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
												/>
											</svg>
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-zinc-200 truncate">
												数据分析
											</div>
											<div className="text-xs text-zinc-500 truncate">
												D:/Projects/analytics
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
										<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
											<svg
												className="w-5 h-5 text-amber-300"
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
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-zinc-200 truncate">
												文档助手
											</div>
											<div className="text-xs text-zinc-500 truncate">
												D:/Projects/docs
											</div>
										</div>
									</div>
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

				<section
					id="features"
					className="mb-20"
				>
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="text-gradient">核心能力</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto">
							强大的 AI 协作能力，让你的工作效率提升 10 倍
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20">
								<svg
									className="w-7 h-7 text-violet-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								Chrome 风格多标签页
							</h3>
							<p className="text-sm text-zinc-400">
								每个 Tab 独立运行一个 Agent，真正的并行工作流，互不干扰
							</p>
						</div>

						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
								<svg
									className="w-7 h-7 text-indigo-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								MCP 工具集成
							</h3>
							<p className="text-sm text-zinc-400">
								内置 MCP 协议支持（STDIO/HTTP/SSE），连接外部工具和数据源
							</p>
						</div>

						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
								<svg
									className="w-7 h-7 text-emerald-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								Skills 技能系统
							</h3>
							<p className="text-sm text-zinc-400">
								内置和自定义技能，一键触发常用操作，让 Agent 越用越懂你
							</p>
						</div>

						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
								<svg
									className="w-7 h-7 text-amber-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								IM 聊天机器人
							</h3>
							<p className="text-sm text-zinc-400">
								接入 Telegram / 钉钉 / OpenClaw 社区插件，多 Bot 管理
							</p>
						</div>

						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20">
								<svg
									className="w-7 h-7 text-rose-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								智能权限管理
							</h3>
							<p className="text-sm text-zinc-400">
								Act / Plan / Auto 三种模式，安全可控，自主决定 AI 操作权限
							</p>
						</div>

						<div className="glass-card rounded-2xl p-6 feature-shine">
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/20">
								<svg
									className="w-7 h-7 text-cyan-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-zinc-100 mb-2">
								本地数据隐私
							</h3>
							<p className="text-sm text-zinc-400">
								所有对话、文件、记忆存在本地，隐私有保障，完全开源
							</p>
						</div>
					</div>
				</section>

				<section
					id="download"
					className="mb-20"
				>
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="text-gradient">免费下载</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto">
							支持 macOS 和 Windows，一键安装，开箱即用
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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

							<a
								href={downloads.macosDmg || downloads.githubRelease}
								target="_blank"
								rel="noreferrer"
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
							</a>
							<p className="text-center text-xs text-zinc-500 mt-3">
								v0.1.57 · DMG · ~85MB
							</p>
						</div>

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
									<h3 className="text-xl font-semibold text-zinc-100">
										Windows
									</h3>
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

							<a
								href={downloads.windowsNsis || downloads.githubRelease}
								target="_blank"
								rel="noreferrer"
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
								下载 for Windows
							</a>
							<p className="text-center text-xs text-zinc-500 mt-3">
								v0.1.57 · NSIS · ~78MB
							</p>
						</div>
					</div>

					<div className="mt-8 text-center">
						<p className="text-sm text-zinc-500 mb-4">其他下载选项</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<a
								href={downloads.windowsPortable || downloads.githubRelease}
								target="_blank"
								rel="noreferrer"
								className="px-4 py-2 rounded-xl glass-inset hover:bg-white/10 transition-colors text-sm text-zinc-300 cursor-pointer"
							>
								便携版 (Windows)
							</a>
							<a
								href={downloads.homebrew || downloads.githubRelease}
								target="_blank"
								rel="noreferrer"
								className="px-4 py-2 rounded-xl glass-inset hover:bg-white/10 transition-colors text-sm text-zinc-300 cursor-pointer"
							>
								Homebrew
							</a>
							<a
								href={downloads.githubRelease}
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

				<section
					id="providers"
					className="mb-20"
				>
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="text-gradient">支持 10+ 模型供应商</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto">
							按需切换，成本可控，灵活选择最适合你的 AI 模型
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-amber-900">A</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">Anthropic</h4>
							<p className="text-xs text-zinc-500">Claude 4.6</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-blue-900">D</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">DeepSeek</h4>
							<p className="text-xs text-zinc-500">Chat / Reasoner</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-violet-900">M</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">Moonshot</h4>
							<p className="text-xs text-zinc-500">Kimi K2</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-cyan-900">智</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">智谱 AI</h4>
							<p className="text-xs text-zinc-500">GLM 5 / 4.7</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-rose-900">M</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">MiniMax</h4>
							<p className="text-xs text-zinc-500">M2.5 / M2.1</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-orange-900">火</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">火山方舟</h4>
							<p className="text-xs text-zinc-500">Doubao Seed</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-emerald-900">Z</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">ZenMux</h4>
							<p className="text-xs text-zinc-500">Gemini 3.1</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-slate-900">硅</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">硅基流动</h4>
							<p className="text-xs text-zinc-500">Kimi / GLM</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-indigo-900">O</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">OpenRouter</h4>
							<p className="text-xs text-zinc-500">GPT-5.2 / Gemini 3</p>
						</div>

						<div className="glass-card rounded-2xl p-4 text-center">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center mx-auto mb-3">
								<span className="text-lg font-bold text-zinc-900">+</span>
							</div>
							<h4 className="font-medium text-zinc-200 mb-1">更多</h4>
							<p className="text-xs text-zinc-500">持续更新</p>
						</div>
					</div>
				</section>

				<section
					id="architecture"
					className="mb-20"
				>
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
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center flex-shrink-0">
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
											Tauri v2 桌面框架
										</h4>
										<p className="text-sm text-zinc-400">
											Rust 原生性能，体积小、启动快、内存占用低
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0">
										<svg
											className="w-5 h-5 text-emerald-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-semibold text-zinc-100 mb-1">
											React + TypeScript
										</h4>
										<p className="text-sm text-zinc-400">
											现代化前端技术栈，开发体验优秀
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center flex-shrink-0">
										<svg
											className="w-5 h-5 text-amber-300"
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
										<h4 className="font-semibold text-zinc-100 mb-1">
											Bun + Claude Agent SDK
										</h4>
										<p className="text-sm text-zinc-400">
											多实例 Sidecar，并行运行，互不干扰
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center flex-shrink-0">
										<svg
											className="w-5 h-5 text-rose-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-semibold text-zinc-100 mb-1">
											本地数据，隐私安全
										</h4>
										<p className="text-sm text-zinc-400">
											所有数据存储在本地，隐私有保障
										</p>
									</div>
								</div>
							</div>

							<div className="glass-inset rounded-2xl p-6">
								<h4 className="font-semibold text-zinc-200 mb-4">技术栈</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
										<span className="text-sm text-zinc-300">桌面框架</span>
										<span className="text-sm text-brand-secondary">
											Tauri v2 (Rust)
										</span>
									</div>
									<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
										<span className="text-sm text-zinc-300">前端</span>
										<span className="text-sm text-brand-secondary">
											React + TS + Vite
										</span>
									</div>
									<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
										<span className="text-sm text-zinc-300">后端</span>
										<span className="text-sm text-brand-secondary">
											Bun + Claude Agent SDK
										</span>
									</div>
									<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
										<span className="text-sm text-zinc-300">通信</span>
										<span className="text-sm text-brand-secondary">
											Rust HTTP/SSE Proxy
										</span>
									</div>
									<div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
										<span className="text-sm text-zinc-300">运行时</span>
										<span className="text-sm text-brand-secondary">
											Bun + Node.js 内置
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

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
								href="https://github.com/nova-agents/nova-agents"
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

				<section className="mb-20">
					<div className="glass-card rounded-3xl p-8 feature-shine">
						<h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
							<span className="text-gradient">致谢</span>
						</h2>
						<div className="max-w-3xl mx-auto space-y-4">
							<p className="text-zinc-400 leading-relaxed">
								<a
									href="https://github.com/hAcKlyc/MyAgents"
									target="_blank"
									rel="noreferrer"
									className="font-semibold text-brand-secondary hover:text-white transition-colors"
								>
									MyAgents
								</a>
								{" "}
								是这个项目的起点与基石。其开创性的架构启发了 nova-agents
								的诞生。我们在其基础上进行了面向桌面端场景的深度重构，并以更优雅的方式实现了全新的交互范式。
							</p>
							<p className="text-center text-[14px] font-medium italic tracking-wide text-zinc-400">
								站在巨人的肩上，我们致力于青出于蓝。
							</p>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-white/5 py-12 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div className="md:col-span-2">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center">
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
								<span className="text-xl font-semibold text-gradient">
									nova-agents
								</span>
							</div>
							<p className="text-sm text-zinc-500 max-w-md">
								让每个人都有一个懂你、能替你干活的桌面 AI Agent。基于 Claude
								Agent SDK 构建，Apache-2.0 开源协议。
							</p>
						</div>

						<div>
							<h4 className="font-medium text-zinc-200 mb-4">资源</h4>
							<ul className="space-y-2 text-sm text-zinc-400">
								<li>
									<a
										href="#features"
										className="hover:text-white transition-colors"
									>
										核心能力
									</a>
								</li>
								<li>
									<a
										href="#download"
										className="hover:text-white transition-colors"
									>
										下载
									</a>
								</li>
								<li>
									<a
										href="#providers"
										className="hover:text-white transition-colors"
									>
										模型供应商
									</a>
								</li>
								<li>
									<a
										href="#architecture"
										className="hover:text-white transition-colors"
									>
										技术架构
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-medium text-zinc-200 mb-4">社区</h4>
							<ul className="space-y-2 text-sm text-zinc-400">
								<li>
									<a
										href="https://github.com/nova-agents/nova-agents"
										target="_blank"
										rel="noreferrer"
										className="hover:text-white transition-colors"
									>
										GitHub
									</a>
								</li>
								<li>
									<a
										href="https://novaagents.io"
										target="_blank"
										rel="noreferrer"
										className="hover:text-white transition-colors"
									>
										官网
									</a>
								</li>
								<li>
									<a
										href="https://github.com/nova-agents/nova-agents/issues"
										target="_blank"
										rel="noreferrer"
										className="hover:text-white transition-colors"
									>
										问题反馈
									</a>
								</li>
								<li>
									<a
										href="specs/tech_docs/architecture.md"
										className="hover:text-white transition-colors"
									>
										文档
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-zinc-500">
							© 2026 nova-agents. Apache License 2.0
						</p>
						<div className="flex items-center gap-4">
							<span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium">
								v0.1.57
							</span>
							<span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs">
								macOS · Windows
							</span>
						</div>
					</div>
				</div>
			</footer>

			<button
				type="button"
				className={`fixed bottom-6 right-6 w-12 h-12 rounded-full glass-card hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center ${
					showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="Back to top"
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
						d="M5 10l7-7m0 0l7 7m-7-7v18"
					/>
				</svg>
			</button>
		</>
	)
}
