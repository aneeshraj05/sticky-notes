const EmptyState = () => (
    <div className="empty-state">
        <div className="empty-icon">🗒️</div>
        <h2 className="empty-title">Your canvas is empty</h2>
        <p className="empty-sub">
            Pick a color and click <strong>+</strong> to add your first sticky note
        </p>
    </div>
);

export default EmptyState;
