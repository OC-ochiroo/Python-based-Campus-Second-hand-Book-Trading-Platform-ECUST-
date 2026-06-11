import "./TradeModal.css";

interface TradeModalProps {
  bookTitle: string;
  ownerName: string;
  wechatUsername: string;
  onClose: () => void;
}

export default function TradeModal({ bookTitle, ownerName, wechatUsername, onClose }: TradeModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>

        <div className="modal__icon">💬</div>
        <h3 className="modal__title">Contact to Trade</h3>
        <p className="modal__book">"{bookTitle}"</p>

        <div className="modal__wechat-box">
          <div className="modal__label">WeChat username</div>
          <div className="modal__wechat-id">{wechatUsername}</div>
        </div>

        <p className="modal__hint">
          Add <strong>{ownerName}</strong> on WeChat and mention the book to arrange the trade.
        </p>

        <button
          className="modal__copy-btn"
          onClick={() => navigator.clipboard.writeText(wechatUsername)}
        >
          Copy username
        </button>
      </div>
    </div>
  );
}