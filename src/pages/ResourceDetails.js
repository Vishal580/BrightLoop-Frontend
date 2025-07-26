import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { resourcesAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { useTimeSpentModal } from "../hooks/TimeSpentModalContext"
import { useState } from "react"
import Modal from "../components/common/Modal"

const ResourceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: resource, isLoading } = useQuery(["resource", id], () => resourcesAPI.getById(id))

  const markCompleteMutation = useMutation(
    (data) => resourcesAPI.markComplete(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("resources")
        queryClient.invalidateQueries(["resource", id])
        toast.success("Resource marked as completed!")
        navigate("/dashboard")
      },
      onError: () => {
        toast.error("Failed to update resource")
      },
    }
  )

  const { showModal, actualTime, setActualTime, handleSubmit, closeModal, openModal } = useTimeSpentModal()

  const handleMarkComplete = () => {
    openModal((actualTime) => {
      markCompleteMutation.mutate({ actualTimeSpent: actualTime })
    })
  }

  const handleUpdate = () => {
    navigate(`/resource/update/${resourceData._id}`)
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const confirmDelete = async () => {
    try {
      await resourcesAPI.delete(resourceData._id)
      toast.success("Resource deleted!")
      queryClient.invalidateQueries("resources")
      queryClient.invalidateQueries("summary")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Failed to delete resource")
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!resource?.data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Resource not found</h2>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const resourceData = resource.data

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
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
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Resource Details</h1>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">{resourceData.title}</h1>
            <button onClick={handleUpdate} className="icon-btn" title="Edit" style={{ fontSize: "1.1rem" }}>✏️</button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="icon-btn"
              title="Delete"
              style={{ fontSize: "1.1rem", color: "red" }}
            >
              🗑️
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="resource-type">
              {getTypeIcon(resourceData.type)} {resourceData.type}
            </span>
            <span className="resource-category">{resourceData.category?.name || "Uncategorized"}</span>
            <span className={`completion-status ${resourceData.isCompleted ? "completed" : "pending"}`}>
              {resourceData.isCompleted ? "✅ Completed" : "⏳ Pending"}
            </span>
          </div>

          {resourceData.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-secondary leading-relaxed">{resourceData.description}</p>
            </div>
          )}

          <div className="grid grid-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-sm text-secondary mb-1">Created</h4>
              <p>{new Date(resourceData.createdAt).toLocaleDateString()}</p>
            </div>
            {resourceData.completedAt && (
              <div>
                <h4 className="font-medium text-sm text-secondary mb-1">Completed</h4>
                <p>{new Date(resourceData.completedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {(resourceData.estimatedTime || resourceData.actualTimeSpent) && (
            <div className="resource-time-info mt-2 text-sm text-gray-600 mb-6">
              <p>
                ⏱️ Estimated Time:{" "}
                <strong>{resourceData.estimatedTime ? `${resourceData.estimatedTime} min` : "—"}</strong>
              </p>
              <p>
                🕒 Actual Time Spent:{" "}
                <strong>{resourceData.actualTimeSpent ? `${resourceData.actualTimeSpent} min` : "—"}</strong>
              </p>
            </div>
          )}

          {!resourceData.isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={markCompleteMutation.isLoading}
              className="btn btn-success"
            >
              {markCompleteMutation.isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Updating...
                </>
              ) : (
                "✅ Mark as Completed"
              )}
            </button>
          )}

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
        </div>
      </div>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Are you sure you want to delete this resource?
          </h2>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ResourceDetails
