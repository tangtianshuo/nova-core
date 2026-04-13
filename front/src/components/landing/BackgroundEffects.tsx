export function BackgroundEffects() {
	return (
		<>
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="orb orb-1"></div>
				<div className="orb orb-2"></div>
				<div className="orb orb-3"></div>
			</div>
			<div className="fixed inset-0 grid-pattern"></div>
		</>
	);
}
