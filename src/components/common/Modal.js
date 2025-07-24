const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="time-spent-modal">
      <div className="time-spent-modal-content">
        {children}
      </div>
    </div>
  )
}
export default Modal