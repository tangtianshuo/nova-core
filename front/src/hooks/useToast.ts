import { useState, useCallback } from 'react';

export interface ToastMessage {
	id: string;
	message: string;
	icon?: string;
}

export function useToast() {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = useCallback((message: string, icon = '🔧') => {
		const id = crypto.randomUUID();
		setToasts((prev) => [...prev, { id, message, icon }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 3000);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, showToast, removeToast };
}
