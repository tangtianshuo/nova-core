import { useVersion } from '../../hooks';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

export function Footer() {
	const { versionInfo } = useVersion();

	return (
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
							让每个人都有一个懂你、能替你干活的桌面 AI
							Agent。基于 Claude Agent SDK 构建，Apache-2.0 开源协议。
						</p>
					</div>

					<div>
						<h4 className="font-medium text-zinc-200 mb-4">资源</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<a href="#features" className="hover:text-white transition-colors">
									核心能力
								</a>
							</li>
							<li>
								<a href="#download" className="hover:text-white transition-colors">
									下载
								</a>
							</li>
							<li>
								<a href="#providers" className="hover:text-white transition-colors">
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
									href={GITHUB_URL}
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
									href={`${GITHUB_URL}/issues`}
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
							{versionInfo?.version ? `v${versionInfo.version}` : 'v0.1.57'}
						</span>
						<span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs">
							macOS · Windows
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
