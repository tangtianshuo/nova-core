import { useEffect, useState } from 'react';
import type { ToastMessage } from '../../hooks/useToast';

interface ToastProps {
	toast: ToastMessage;
	onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
	const [isHiding, setIsHiding] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsHiding(true);
			setTimeout(() => onRemove(toast.id), 300);
		}, 2700);

		return () => clearTimeout(timer);
	}, [toast.id, onRemove]);

	return (
		<div
			className={`
        px-5 py-3 rounded-xl flex items-center gap-3 text-white text-sm font-medium shadow-lg
        bg-gradient-to-r from-brand-primary/95 to-purple-500/95
        backdrop-blur-xl border border-white/15
        shadow-brand-primary/40
        transition-all duration-300
        ${isHiding ? 'opacity-0 translate-y-[-20px] scale-90' : 'opacity-100 translate-y-0 scale-100'}
      `}
		>
			<span className="text-lg animate-bounce">{toast.icon}</span>
			<span>{toast.message}</span>
		</div>
	);
}

interface ToastContainerProps {
	toasts: ToastMessage[];
	onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
	return (
		<div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
			{toasts.map((toast) => (
				<Toast key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
}
