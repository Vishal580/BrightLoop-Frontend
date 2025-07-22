const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return <div className={`loading-spinner ${sizeClasses[size]}`}></div>
}

export default LoadingSpinner
