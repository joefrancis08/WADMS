/**
 * Get color, label color, and status based on progress value
 * @param {number} progress - The progress percentage (0–100)
 * @returns {{ color: string, labelColor: string, status: string }}
 */
export function getProgressStyle(progress) {
  let color = '';
  let labelColor = '';
  let status = '';

  if (progress === 100) {
    color = 'bg-green-500';
    labelColor = 'text-green-100';
    status = 'Complete';
  } else if (progress >= 85) {
    color = 'bg-green-700';
    labelColor = 'text-green-700';
    status = 'Almost Complete';
  } else if (progress >= 1) {
    color = 'bg-green-700';
    labelColor = 'text-green-700';
    status = 'In Progress';
  } else {
    color = 'bg-gray-300';
    labelColor = 'text-gray-600';
    status = 'Not Yet Started';
  }

  return { color, labelColor, status };
}
