import { useVersion } from '../../hooks';

const GITHUB_URL = 'https://github.com/tangtianshuo/nova-agents';

const navLinks = [
	{ href: '#features', label: '核心能力' },
	{ href: '#download', label: '下载' },
	{ href: '#providers', label: '模型' },
	{ href: '#architecture', label: '架构' },
	{ href: GITHUB_URL, label: 'GitHub', external: true },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
	if (href.startsWith('#')) {
		e.preventDefault();
		const target = document.querySelector(href);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
};

export function Navbar() {
	const { versionInfo } = useVersion();

	return (
		<nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl px-6 py-4" style={{background: 'rgb(96 96 96 / 30%)', backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
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
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noreferrer' : undefined}
							onClick={(e) => handleNavClick(e, link.href)}
							className="px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer text-zinc-300 hover:text-white"
						>
							{link.label}
						</a>
					))}
				</div>

				<div className="flex items-center gap-3">
					<a
						href="#download"
						onClick={(e) => handleNavClick(e, '#download')}
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
