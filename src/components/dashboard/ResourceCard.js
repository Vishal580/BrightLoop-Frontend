import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { resourcesAPI } from "../../services/api"
import toast from "react-hot-toast"
import { useTimeSpentModal } from "../../hooks/TimeSpentModalContext"
import { useState } from "react"
import Modal from "../common/Modal"

const ResourceCard = ({ resource }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { openModal, closeModal, showModal, actualTime, setActualTime, handleSubmit } = useTimeSpentModal()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const markCompleteMutation = useMutation(
    (data) => resourcesAPI.markComplete(resource._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("resources")
        queryClient.invalidateQueries("summary")
        toast.success("Resource marked as completed!")
        closeModal()
      },
      onError: () => {
        toast.error("Failed to update resource")
      },
    }
  )

  const handleUpdate = () => {
    navigate(`/resource/update/${resource._id}`)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    resourcesAPI.delete(resource._id)
      .then(() => {
        queryClient.invalidateQueries("resources")
        queryClient.invalidateQueries("summary")
        toast.success("Resource deleted!")
      })
      .catch(() => {
        toast.error("Failed to delete resource")
      })
      .finally(() => setShowDeleteModal(false))
  }

  const cancelDelete = () => setShowDeleteModal(false)

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "article":
        return "📄"
      case "video":
        return "🎥"
      case "quiz":
        return "❓"
      case "book":
        return "📖"
      case "course":
        return "🎓"
      default:
        return "📚"
    }
  }

  return (
    <>
      <div className="resource-card">
        <div className="resource-card-header">
          <h3 className="resource-card-title">{resource.title}</h3>
          <div className="resource-card-meta">
            <span className="resource-type">
              {getTypeIcon(resource.type)} {resource.type}
            </span>
            <span className="resource-category">{resource.category?.name || "Uncategorized"}</span>
          </div>
          <p className="resource-card-description">{resource.description}</p>

          {(resource.estimatedTime || resource.actualTimeSpent) && (
            <div className="resource-time-info mt-2 text-sm text-gray-600">
              <p>
                ⏱️ Estimated Time:{" "}
                <strong>{resource.estimatedTime ? `${resource.estimatedTime} min` : "—"}</strong>
              </p>
              <p>
                🕒 Actual Time Spent:{" "}
                <strong>{resource.actualTimeSpent ? `${resource.actualTimeSpent} min` : "—"}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="resource-card-footer">
          <div className={`completion-status ${resource.isCompleted ? "completed" : "pending"}`}>
            {resource.isCompleted ? "✅ Completed" : "⏳ Pending"}
          </div>

          <div className="flex gap-2">
            {/* Update Icon */}
            <button
              onClick={handleUpdate}
              className="icon-btn"
              title="Edit"
              style={{ fontSize: "1.1rem" }}
            >
              ✏️
            </button>
            {/* Delete Icon */}
            <button
              onClick={handleDelete}
              className="icon-btn"
              title="Delete"
              style={{ fontSize: "1.1rem", color: "red" }}
            >
              🗑️
            </button>
            <Link
              to={`/resource/${resource._id}`}
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.5rem 1rem", marginRight: "0.5rem"}}
            >
              View
            </Link>
            {!resource.isCompleted && (
              <button
                onClick={() => openModal((actualTime) => {
                  markCompleteMutation.mutate({ actualTimeSpent: actualTime })
                })}
                className="btn btn-success"
                style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal OUTSIDE the card */}
      <Modal open={showDeleteModal} onClose={cancelDelete}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Are you sure you want to delete this resource?
          </h2>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary" onClick={cancelDelete}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={showModal} onClose={closeModal}>
        <div>
          <h2 className="text-xl mb-4">Enter Actual Time Spent (in minutes)</h2>
          <input
            type="number"
            className="form-input mb-4"
            value={actualTime}
            onChange={(e) => setActualTime(e.target.value)}
            placeholder="e.g. 60"
            min="0"
          />
          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save & Complete
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ResourceCard

