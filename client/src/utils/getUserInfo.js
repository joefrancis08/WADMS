export function getFullNameById (dataset, id) {
  const data = dataset.find(d => d.id === id);
  return data ? data.fullName : null;
};