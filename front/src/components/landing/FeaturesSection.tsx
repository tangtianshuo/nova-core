const features = [
	{
		title: 'Chrome 风格多标签页',
		description: '每个 Tab 独立运行一个 Agent，真正的并行工作流，互不干扰',
		gradient: 'from-violet-600 to-purple-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
			/>
		),
	},
	{
		title: 'MCP 工具集成',
		description: '内置 MCP 协议支持（STDIO/HTTP/SSE），连接外部工具和数据源',
		gradient: 'from-indigo-600 to-blue-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
			/>
		),
	},
	{
		title: 'Skills 技能系统',
		description: '内置和自定义技能，一键触发常用操作，让 Agent 越用越懂你',
		gradient: 'from-emerald-600 to-teal-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
			/>
		),
	},
	{
		title: 'IM 聊天机器人',
		description: '接入 Telegram / 钉钉 / OpenClaw 社区插件，多 Bot 管理',
		gradient: 'from-amber-600 to-orange-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
			/>
		),
	},
	{
		title: '智能权限管理',
		description: 'Act / Plan / Auto 三种模式，安全可控，自主决定 AI 操作权限',
		gradient: 'from-rose-600 to-pink-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
			/>
		),
	},
	{
		title: '本地数据隐私',
		description: '所有对话、文件、记忆存在本地，隐私有保障，完全开源',
		gradient: 'from-cyan-600 to-blue-700',
		icon: (
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
			/>
		),
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="mb-20">
			<div className="text-center mb-12">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">
					<span className="text-gradient">核心能力</span>
				</h2>
				<p className="text-zinc-400 max-w-2xl mx-auto">
					强大的 AI 协作能力，让你的工作效率提升 10 倍
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{features.map((feature, index) => (
					<div
						key={index}
						className="glass-card rounded-2xl p-6 feature-shine"
					>
						<div
							className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
							style={{
								boxShadow: `0 8px 32px rgba(${
									feature.gradient.includes('violet')
										? '139, 92, 246'
										: feature.gradient.includes('indigo')
											? '99, 102, 241'
											: feature.gradient.includes('emerald')
												? '16, 185, 129'
												: feature.gradient.includes('amber')
													? '245, 158, 11'
													: feature.gradient.includes('rose')
														? '244, 63, 94'
														: '6, 182, 212'
								}, 0.2)`,
							}}
						>
							<svg
								className="w-7 h-7 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{feature.icon}
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-zinc-100 mb-2">
							{feature.title}
						</h3>
						<p className="text-sm text-zinc-400">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
