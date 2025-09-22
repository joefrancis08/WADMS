import { useQueries } from "@tanstack/react-query";

/**
 * Generic hook to fetch documents for multiple entities
 * (areas, parameters, subparameters, indicators)
 *
 * @param {Array} items - Array of entities (areas, params, subparams, indicators)
 * @param {Object} ids - Object containing IDs needed for API
 * @param {Function} fetchFn - Function to fetch documents
 * @param {string} idKey - Key in item objects to use as identifier
 * @param {string} entityType - Entity type: "area" | "param" | "subparam" | "indicator"
 * @returns {Array} Array of queries from useQueries
 */
export function useDocumentsQueries(items, ids, fetchFn, idKey, entityType) {
  return useQueries({
    queries: items.map((item) => ({
      queryKey: [
        `${entityType}-documents`,
        item[idKey],
        ids.accredInfoId,
        ids.levelId,
        ids.programId,
        ids.areaId,
        ids.paramId,
      ],
      queryFn: () =>
        fetchFn({
          ...ids,
          areaId: entityType === 'area' ? item[idKey] : ids.areaId,
          parameterId: entityType === 'param' ? item[idKey] : ids.paramId,
          subParameterId: entityType === 'subparam' ? item[idKey] : null,
          indicatorId: entityType === 'indicator' ? item[idKey] : null,
        }),
      staleTime: 0,
    })),
  });
}
