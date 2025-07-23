import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { resourcesAPI } from "../services/api"
import LoadingSpinner from "../components/common/LoadingSpinner"
import StatsCard from "../components/dashboard/StatsCard"
import ResourceCard from "../components/dashboard/ResourceCard"
import formatTime from "../hooks/formatTime"

const Dashboard = () => {
  const { data: resources, isLoading: resourcesLoading } = useQuery("resources", resourcesAPI.getAll)

  const { data: summary, isLoading: summaryLoading } = useQuery("summary", resourcesAPI.getSummary)

  if (resourcesLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const resourcesList = resources?.data || []
  const summaryData = summary?.data || {}

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/add-resource" className="btn btn-primary">
          ➕ Add Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard title="Total Resources" value={summaryData.totalResources || 0} icon="📚" color="bg-primary" />
        <StatsCard title="Completed" value={summaryData.completedResources || 0} icon="✅" color="bg-success" />
        <StatsCard
          title="In Progress"
          value={(summaryData.totalResources || 0) - (summaryData.completedResources || 0)}
          icon="⏳"
          color="bg-warning"
        />
        <StatsCard title="Total Time" value={formatTime(summaryData.totalTimeSpent || 0)} icon="⏰" color="bg-primary" />
      </div>

      {/* Category Progress */}
      {summaryData.categoryStats && summaryData.categoryStats.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Progress by Category</h2>
          {summaryData.categoryStats.map((category) => (
            <div key={category._id} className="category-progress">
              <div className="category-progress-header">
                <span className="category-name">{category._id}</span>
                <span className="category-percentage">{Math.round(category.completionPercentage)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${category.completionPercentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Resources */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Resources</h2>
        {resourcesList.length === 0 ? (
          <div className="card text-center p-8">
            <p className="text-secondary mb-4">No resources added yet</p>
            <Link to="/add-resource" className="btn btn-primary">
              Add Your First Resource
            </Link>
          </div>
        ) : (
          <div className="resource-grid">
            {resourcesList.slice(0, 6).map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
