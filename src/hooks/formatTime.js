const formatTime = (minutes) => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`
  if (hrs > 0) return `${hrs}h`
  return `${mins}m`
}

export default formatTime