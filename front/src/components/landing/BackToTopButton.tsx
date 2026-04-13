import { useBackToTop } from '../../hooks';

export function BackToTopButton() {
	const { visible, scrollToTop } = useBackToTop();

	return (
		<button
			type="button"
			className={`fixed bottom-6 right-6 w-12 h-12 rounded-full glass-card hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center ${
				visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			onClick={scrollToTop}
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
	);
}
