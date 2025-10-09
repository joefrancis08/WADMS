// utils/deduplicateAssignments.js
const deduplicateAssignments = (assignments = [], taskForce = []) => {
  if (!Array.isArray(assignments) || !Array.isArray(taskForce)) return [];

  return Object.values(
    assignments.reduce((acc, curr) => {
      // find the full user details from taskForce list
      const tf = taskForce.find(tf => tf.id === curr.taskForceID);

      if (!acc[curr.taskForceID]) {
        acc[curr.taskForceID] = {
          taskForceID: curr.taskForceID,
          fullName: tf?.fullName || 'Unknown',
          role: tf?.role || '',
          profilePicPath: tf?.profilePicPath || null,
          assignments: []
        };
      }

      acc[curr.taskForceID].assignments.push({
        assignmentID: curr.assignmentID,
        parameterID: curr.parameterID,
        parameter: curr.parameter,
        areaId: curr.areaId
      });

      return acc;
    }, {})
  );
};

export default deduplicateAssignments;
