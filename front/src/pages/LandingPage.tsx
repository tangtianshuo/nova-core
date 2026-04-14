import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useToast, useVersion } from '../hooks';
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

type TabType = 'chat' | 'workspace' | 'imbot';

interface Message {
	id: string;
	type: 'user' | 'assistant';
	content: string;
	time: string;
	isTool?: boolean;
}

interface Workspace {
	id: string;
	name: string;
	path: string;
	gradient: string;
	icon: string;
}

const workspaces: Workspace[] = [
	{ id: '1', name: '前端项目', path: 'D:/Projects/webapp', gradient: 'from-indigo-500 to-violet-600', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
	{ id: '2', name: '数据分析', path: 'D:/Projects/analytics', gradient: 'from-emerald-500 to-teal-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
	{ id: '3', name: '文档助手', path: 'D:/Projects/docs', gradient: 'from-amber-500 to-orange-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const initialMessages: Message[] = [
	{ id: '1', type: 'user', content: '帮我分析这个项目的代码结构，并给出优化建议', time: '10:32' },
	{ id: '2', type: 'assistant', content: '我来分析一下项目结构。这个项目采用了标准的 Tauri + React 架构，整体结构清晰。让我先查看一下目录结构...', time: '10:32' },
	{ id: '3', type: 'assistant', content: '', time: '10:32', isTool: true },
	{ id: '4', type: 'assistant', content: '根据分析，我发现了几个优化点：\n1. 项目结构清晰，采用标准的 Tauri + React 架构\n2. 建议将工具函数抽离到独立模块\n3. 可以考虑增加错误边界处理', time: '10:33' },
];

const quickActions = [
	{ id: 'new-chat', label: '新建对话', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', action: 'newChat' },
	{ id: 'schedule', label: '定时任务', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action: 'schedule' },
	{ id: 'settings', label: '设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', action: 'settings' },
	{ id: 'history', label: '历史记录', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action: 'history' },
];

export default function LandingPage() {
	const { toasts, removeToast } = useToast();
	const { versionInfo } = useVersion();
	const [activeTab, setActiveTab] = useState<TabType>('chat');

	// 统一格式化版本信息传递给子组件
	const formattedVersionInfo = versionInfo
		? {
				...versionInfo,
				pubDateFormatted: versionInfo.pubDate,
			}
		: null;
	const [activeWorkspace, setActiveWorkspace] = useState<string>('1');
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [inputValue, setInputValue] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	// 在 DOM 绘制前同步执行滚动
	useLayoutEffect(() => {
		document.documentElement.scrollTop = 0;
	}, []);

	useEffect(() => {
		// 作为保险，在渲染完成后再次滚动
		requestAnimationFrame(() => {
			document.documentElement.scrollTop = 0;
		});
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleTabChange = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, [activeTab]);

	const handleWorkspaceChange = useCallback((workspaceId: string) => {
		setActiveWorkspace(workspaceId);
	}, []);

	const handleQuickAction = useCallback((action: string) => {
		if (action === 'newChat') {
			setMessages([]);
			setInputValue('');
			inputRef.current?.focus();
		}
	}, []);

	const handleSendMessage = useCallback(() => {
		if (!inputValue.trim()) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			type: 'user',
			content: inputValue,
			time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
		};

		setMessages(prev => [...prev, userMessage]);
		setInputValue('');
		setIsTyping(true);

		setTimeout(() => {
			setIsTyping(false);
			const assistantMessage: Message = {
				id: crypto.randomUUID(),
				type: 'assistant',
				content: '感谢您的消息！我已收到您的问题，正在思考如何更好地回答...\n\n根据您的描述，我可以为您提供专业的建议和分析。如果您有更多细节想要分享，我会给出更加精准的回复。',
				time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
			};
			setMessages(prev => [...prev, assistantMessage]);
		}, 1500);
	}, [inputValue]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	}, [handleSendMessage]);

	const currentWorkspace = workspaces.find(w => w.id === activeWorkspace);

	return (
		<>
			<BackgroundEffects />
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			<Navbar />

			<main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
				<HeroSection versionInfo={formattedVersionInfo} />

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
									onClick={() => handleTabChange('chat')}
									className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
										activeTab === 'chat'
											? 'bg-brand-primary/20 text-brand-secondary'
											: 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
									}`}
								>
									对话
								</button>
								<button
									type="button"
									onClick={() => handleTabChange('workspace')}
									className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
										activeTab === 'workspace'
											? 'bg-brand-primary/20 text-brand-secondary'
											: 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
									}`}
								>
									工作区
								</button>
								<button
									type="button"
									onClick={() => handleTabChange('imbot')}
									className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
										activeTab === 'imbot'
											? 'bg-brand-primary/20 text-brand-secondary'
											: 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
									}`}
								>
									IM Bot
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
							{/* Main Chat Area */}
							<div className="lg:col-span-2 glass-inset rounded-2xl p-4 flex flex-col min-h-[400px]">
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
											{activeTab === 'chat' && 'Claude Sonnet 4.6'}
											{activeTab === 'workspace' && (currentWorkspace?.name || '选择工作区')}
											{activeTab === 'imbot' && 'Telegram Bot'}
										</div>
										<div className="text-xs text-zinc-500">
											{activeTab === 'chat' && '在线'}
											{activeTab === 'workspace' && currentWorkspace?.path}
											{activeTab === 'imbot' && '已连接'}
										</div>
									</div>
									<div className="ml-auto flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
										<span className="text-xs text-emerald-400">就绪</span>
									</div>
								</div>

								{/* Tab Content */}
								{activeTab === 'chat' && (
									<>
										<div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
											{messages.map((message) => (
												<div key={message.id}>
													{message.isTool ? (
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
													) : message.type === 'user' ? (
														<div className="flex gap-3 justify-end">
															<div className="max-w-[80%]">
																<div className="rounded-2xl rounded-br-md px-4 py-3 bg-brand-primary/20 border border-brand-primary/30">
																	<p className="text-sm text-zinc-200">
																		{message.content}
																	</p>
																</div>
																<p className="text-xs text-zinc-600 mt-1 text-right">{message.time}</p>
															</div>
														</div>
													) : (
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
																	<p className="text-sm text-zinc-200 whitespace-pre-wrap">
																		{message.content}
																	</p>
																</div>
																<p className="text-xs text-zinc-600 mt-1">{message.time}</p>
															</div>
														</div>
													)}
												</div>
											))}
											{isTyping && (
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
															<div className="flex items-center gap-2">
																<div className="flex gap-1">
																	<span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce" style={{ animationDelay: '0ms' }}></span>
																	<span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce" style={{ animationDelay: '150ms' }}></span>
																	<span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce" style={{ animationDelay: '300ms' }}></span>
																</div>
																<span className="text-xs text-zinc-500">AI 正在思考...</span>
															</div>
														</div>
													</div>
												</div>
											)}
											<div ref={messagesEndRef} />
										</div>

										{/* Input Area */}
										<div className="mt-auto pt-4 border-t border-white/5">
											<div className="flex gap-3">
												<input
													ref={inputRef}
													type="text"
													value={inputValue}
													onChange={(e) => setInputValue(e.target.value)}
													onKeyDown={handleKeyDown}
													placeholder="输入消息，Enter 发送..."
													className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
												/>
												<button
													type="button"
													onClick={handleSendMessage}
													disabled={!inputValue.trim()}
													className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-500 font-medium text-sm text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-glow flex items-center gap-2"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
													</svg>
													发送
												</button>
											</div>
										</div>
									</>
								)}

								{activeTab === 'workspace' && (
									<div className="flex-1 flex items-center justify-center">
										<div className="text-center">
											<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
												<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
												</svg>
											</div>
											<h3 className="text-lg font-medium text-zinc-200 mb-2">{currentWorkspace?.name}</h3>
											<p className="text-sm text-zinc-500 mb-4">{currentWorkspace?.path}</p>
											<button
												type="button"
												onClick={() => handleQuickAction('newChat')}
												className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-500 font-medium text-sm text-white hover:opacity-90 transition-opacity cursor-pointer btn-glow"
											>
												在此工作区新建对话
											</button>
										</div>
									</div>
								)}

								{activeTab === 'imbot' && (
									<div className="flex-1 flex items-center justify-center">
										<div className="text-center">
											<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
												<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
												</svg>
											</div>
											<h3 className="text-lg font-medium text-zinc-200 mb-2">Telegram Bot</h3>
											<p className="text-sm text-zinc-500 mb-4">通过 Telegram 与 AI Agent 交互</p>
											<div className="flex items-center justify-center gap-2 text-emerald-400">
												<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
												<span className="text-sm">已连接到 @novagents_bot</span>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Sidebar */}
							<div className="glass-inset rounded-2xl p-4">
								<div className="text-sm font-medium text-zinc-300 mb-4 pb-3 border-b border-white/5">
									工作区
								</div>
								<div className="space-y-3">
									{workspaces.map((workspace) => (
										<button
											key={workspace.id}
											type="button"
											onClick={() => handleWorkspaceChange(workspace.id)}
											className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
												activeWorkspace === workspace.id
													? 'bg-brand-primary/20 border border-brand-primary/30'
													: 'hover:bg-white/5 border border-transparent'
											}`}
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
														d={workspace.icon}
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
											{activeWorkspace === workspace.id && (
												<div className="w-2 h-2 rounded-full bg-brand-primary"></div>
											)}
										</button>
									))}
								</div>

								<div className="mt-6 pt-4 border-t border-white/5">
									<div className="text-xs text-zinc-500 mb-3">快捷功能</div>
									<div className="grid grid-cols-2 gap-2">
										{quickActions.map((action) => (
											<button
												key={action.id}
												type="button"
												onClick={() => handleQuickAction(action.action)}
												className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group"
											>
												<svg
													className="w-4 h-4 text-brand-secondary group-hover:text-brand-primary transition-colors"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d={action.icon}
													/>
												</svg>
												<span className="text-xs text-zinc-300 group-hover:text-zinc-100 transition-colors">{action.label}</span>
											</button>
										))}
									</div>
								</div>

								<div className="mt-6 pt-4 border-t border-white/5">
									<div className="text-xs text-zinc-500 mb-3">模型选择</div>
									<select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 cursor-pointer focus:outline-none focus:border-brand-primary/50 appearance-none">
										<option value="claude-sonnet">Claude Sonnet 4.6</option>
										<option value="claude-opus">Claude Opus 4.6</option>
										<option value="claude-haiku">Claude Haiku 4.5</option>
										<option value="deepseek">DeepSeek Chat</option>
										<option value="moonshot">Moonshot Kimi K2</option>
									</select>
								</div>

								<div className="mt-6 pt-4 border-t border-white/5">
									<div className="text-xs text-zinc-500 mb-3">权限模式</div>
									<div className="flex gap-2">
										{['Act', 'Plan', 'Auto'].map((mode) => (
											<button
												key={mode}
												type="button"
												className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border border-white/10 hover:bg-white/5 hover:border-brand-primary/30"
											>
												{mode}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<FeaturesSection />
				<DownloadSection versionInfo={formattedVersionInfo} />

				{/* Acknowledgments Section */}
				<section id="acknowledgments" className="mb-20">
					<div className="glass-card rounded-3xl p-8 text-center">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-8 h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</div>
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							<span className="text-gradient">致谢</span>
						</h2>
						<p className="text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
							MyAgents 是这个项目的起点与基石。其开创性的架构启发了 NovaAgents 的诞生，
							我们在其基础上进行了面向桌面端场景的深度重构，并以更优雅的方式实现了全新的交互范式。
							<br />
							<br />
							站在巨人的肩上，我们致力于青出于蓝。
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<a
								href="https://github.com/HacKlyc/MyAgents"
								target="_blank"
								rel="noreferrer"
								className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 font-semibold hover:opacity-90 transition-opacity cursor-pointer text-white btn-glow flex items-center gap-2"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								MyAgents
							</a>
							<a
								href="https://github.com/tangtianshuo/nova-agents"
								target="_blank"
								rel="noreferrer"
								className="px-6 py-3 rounded-full glass-card font-semibold hover:bg-white/10 transition-all cursor-pointer text-zinc-200 flex items-center gap-2"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								NovaAgents
							</a>
						</div>
					</div>
				</section>

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
								className="glass-card rounded-2xl p-4 text-center cursor-pointer"
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
