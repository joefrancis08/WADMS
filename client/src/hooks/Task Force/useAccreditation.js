import { useEffect, useMemo, useRef, useState } from "react";
import { useFetchILP } from "../fetch-react-query/useFetchILP";
import { useAuth } from "../../contexts/AuthContext";
import useFetchAssignmentsByUserId from "../fetch-react-query/useFetchAssignmentsByUserId";

const LEVEL_ORDER = ['Preliminary', 'Level I', 'Level II', 'Level III', 'Level IV', 'Unspecified'];

const useAccreditation = () => {
  const { user } = useAuth();

  // ---- Programs API ----
  const { accredInfoLevelPrograms, loading, error, refetch } = useFetchILP();
  const infoLevelPrograms = useMemo(
    () => accredInfoLevelPrograms?.data ?? [],
    [accredInfoLevelPrograms]
  );

  // ---- Assignments API (by user) ----
  const { assignments } = useFetchAssignmentsByUserId(user?.userId);
  const taskForceAssignments = assignments?.assignmentData ?? [];

  const items = [
    { id: 'programs', name: 'Programs' },
    { id: 'assignments', name: 'Assignments' },
  ];

  // ---- optional fallback / empty-state ----
  const dummyPrograms = [
    {
      accredTitle: 'Institutional Accreditation 2025',
      levels: {
        Preliminary: [
          { id: 1, program: 'BS Information Technology' },
          { id: 2, program: 'BS Computer Science' },
        ],
        'Level I': [{ id: 3, program: 'BS Mechanical Engineering' }],
      },
    },
    {
      accredTitle: 'Program Accreditation 2024',
      levels: {
        'Level II': [
          { id: 4, program: 'BS Architecture' },
          { id: 5, program: 'BS Civil Engineering' },
        ],
      },
    },
  ];

  const dummyAssignments = [
    {
      accredTitle: 'Institutional Accreditation 2025',
      levels: {
        'Level I': [
          {
            program: 'BS Information Technology',
            areas: [
              {
                area: 'Area I – Vision, Mission, Goals',
                parameters: [
                  {
                    parameter: 'Parameter A – Implementation',
                    subParameters: [
                      { subParameter: 'Sub-Parameter 1', indicators: ['Indicator 1', 'Indicator 2'] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ];

  // UI helper: "Institutional Accreditation 2025" -> ["Institutional", "Accreditation 2025"]
  function formatAccreditationTitleForUI(title) {
    if (!title) return ['',''];
    const parts = title.split(' ');
    if (parts.length < 2) return [title, ''];
    return [parts[0], parts.slice(1).join(' ')];
  }

  const normalize = (v) => (v?.toString?.().toLowerCase().trim() ?? '');

  const [activeItemId, setActiveItemId] = useState('programs');
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showParameters, setShowParameters] = useState(false);
  const [showSubParam, setShowSubParam] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  const searchInputRef = useRef(null);
  const levelRef = useRef({});
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  // --------------------------------------------------
  // PROGRAMS: rows + grouping (unchanged from your version)
  // --------------------------------------------------
  const rows = useMemo(() => {
    if (Array.isArray(infoLevelPrograms)) return infoLevelPrograms;
    if (infoLevelPrograms) return [infoLevelPrograms];
    return [];
  }, [infoLevelPrograms]);

  const groupedPrograms = useMemo(() => {
    const acc = {}; // { [accredTitleKey]: { [level]: Program[] } }

    for (const item of rows) {
      const ai = item.accreditationInfo ?? {};
      const titleBase = item.accred_title ?? ai.accred_title ?? 'Accreditation';
      const year = item.accred_year ?? ai.accred_year ?? '';
      const accredTitleKey = String(year).length ? `${titleBase} ${year}` : titleBase;
      const level = item.level || 'Unspecified';

      const progObj = typeof item.program === 'string' ? { program: item.program } : (item.program ?? {});
      const programName = progObj.program ?? 'Unnamed Program';
      const programId =
        (progObj.id ?? progObj.program_uuid) ??
        item.program_uuid ??
        item.ilpmId ??
        `${accredTitleKey}-${level}-${programName}`;

      if (!acc[accredTitleKey]) acc[accredTitleKey] = {};
      if (!acc[accredTitleKey][level]) acc[accredTitleKey][level] = [];

      const exists = acc[accredTitleKey][level].some(p => (p.id ?? p.program_uuid ?? p.ilpmId) === programId);
      if (!exists) {
        acc[accredTitleKey][level].push({
          id: programId,
          program: programName,
          program_uuid: progObj.program_uuid ?? item.program_uuid,
          ilpmId: item.ilpmId,
          level,
          accred_id: ai.id ?? item.accred_id,
          accred_uuid: ai.accred_uuid ?? item.accred_uuid,
          accred_year: year,
          accred_title: titleBase,
          accred_body_name: ai.accred_body ?? item.accred_body_name,
        });
      }
    }

    // sort programs + order levels
    Object.entries(acc).forEach(([k, levels]) => {
      Object.values(levels).forEach((arr) => arr.sort((a, b) => a.program.localeCompare(b.program)));
      const ordered = {};
      LEVEL_ORDER.forEach(lvl => { if (levels[lvl]) ordered[lvl] = levels[lvl]; });
      Object.keys(levels).filter(lvl => !LEVEL_ORDER.includes(lvl)).sort().forEach(lvl => { ordered[lvl] = levels[lvl]; });
      acc[k] = ordered;
    });

    return acc;
  }, [rows]);

  const apiProgramsArray = useMemo(() => {
    return Object.entries(groupedPrograms).map(([accredTitle, levels]) => ({
      accredTitle,
      levels,
    }));
  }, [groupedPrograms]);

  const programsRaw = useMemo(() => {
    return apiProgramsArray.length ? apiProgramsArray : dummyPrograms;
  }, [apiProgramsArray]);

  // --------------------------------------------------
  // ASSIGNMENTS: transform API -> UI shape
  // --------------------------------------------------
  const assignmentRows = useMemo(() => {
    if (Array.isArray(taskForceAssignments)) return taskForceAssignments;
    if (taskForceAssignments) return [taskForceAssignments];
    return [];
  }, [taskForceAssignments]);

  const apiAssignmentsArray = useMemo(() => {
    // Build: { [accredTitle]: { [level]: { [programName]: { program, areas[] } } } }
    const acc = {};

    for (const row of assignmentRows) {
      const titleBase = row.accredTitle || 'Accreditation';
      const year = row.accredYear || '';
      const accredTitle = year ? `${titleBase} ${year}` : titleBase;
      const level = row.level || 'Unspecified';
      const programName = row.program || 'Unnamed Program';

      if (!acc[accredTitle]) acc[accredTitle] = {};
      if (!acc[accredTitle][level]) acc[accredTitle][level] = {};
      if (!acc[accredTitle][level][programName]) {
        acc[accredTitle][level][programName] = {
          program: programName,
          areas: [],
        };
      }

      // Get the program record
      const programObj = acc[accredTitle][level][programName];

      // Area (may be null)
      if (row.area) {
        let areaObj = programObj.areas.find(a => a.area === row.area);
        if (!areaObj) {
          areaObj = { area: row.area, parameters: [] };
          programObj.areas.push(areaObj);
        }

        // Parameter
        if (row.parameter) {
          let paramObj = areaObj.parameters.find(p => p.parameter === row.parameter);
          if (!paramObj) {
            paramObj = { parameter: row.parameter, subParameters: [] };
            areaObj.parameters.push(paramObj);
          }

          // Sub-Parameter
          if (row.subParameter) {
            let subParamObj = paramObj.subParameters.find(s => s.subParameter === row.subParameter);
            if (!subParamObj) {
              subParamObj = { subParameter: row.subParameter, indicators: [] };
              paramObj.subParameters.push(subParamObj);
            }

            // Indicator
            if (row.indicator) {
              if (!subParamObj.indicators.includes(row.indicator)) {
                subParamObj.indicators.push(row.indicator);
              }
            }
          }
        }
      }
    }

    // Convert to array shape your UI expects:
    // [{ accredTitle, levels: { [level]: [ { program, areas } ] } }]
    const result = Object.entries(acc).map(([accredTitle, levelsObj]) => {
      // Optionally re-order levels by LEVEL_ORDER
      const orderedLevels = {};
      LEVEL_ORDER.forEach(lvl => {
        if (levelsObj[lvl]) orderedLevels[lvl] = Object.values(levelsObj[lvl]);
      });
      Object.keys(levelsObj)
        .filter(lvl => !LEVEL_ORDER.includes(lvl))
        .sort()
        .forEach(lvl => { orderedLevels[lvl] = Object.values(levelsObj[lvl]); });

      return { accredTitle, levels: orderedLevels };
    });

    return result;
  }, [assignmentRows]);

  // Use API assignments if present; fallback to dummy
  const assignmentsRaw = useMemo(() => {
    return apiAssignmentsArray.length ? apiAssignmentsArray : dummyAssignments;
  }, [apiAssignmentsArray]);

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------
  const filteredPrograms = useMemo(() => {
    if (!query) return programsRaw;
    const q = normalize(query);
    return programsRaw
      .map((accred) => {
        const includeAccred = normalize(accred.accredTitle).includes(q);
        const filteredLevels = Object.fromEntries(
          Object.entries(accred.levels).map(([lvl, progs]) => [
            lvl,
            progs.filter((p) => normalize(p.program).includes(q)),
          ])
        );
        const hasMatches = includeAccred || Object.values(filteredLevels).some((arr) => arr.length > 0);
        return hasMatches ? { ...accred, levels: filteredLevels } : null;
      })
      .filter(Boolean);
  }, [programsRaw, query]);

  const filteredAssignments = useMemo(() => {
    if (!query) return assignmentsRaw;
    const q = normalize(query);
    return assignmentsRaw
      .map((accred) => {
        const includeAccred = normalize(accred.accredTitle).includes(q);
        const filteredLevels = Object.fromEntries(
          Object.entries(accred.levels).map(([lvl, progs]) => [
            lvl,
            progs
              .map((p) => {
                const includeProgram = normalize(p.program).includes(q);
                const areas = (p.areas || []).map((a) => ({
                  ...a,
                  parameters: (a.parameters || []).map((pr) => ({
                    ...pr,
                    subParameters: (pr.subParameters || []).map((sp) => ({
                      ...sp,
                      indicators: (sp.indicators || []).filter((ind) => normalize(ind).includes(q)),
                    })),
                  })),
                }));
                const keptAreas = areas.filter((a) =>
                  normalize(a.area).includes(q) ||
                  a.parameters.some((pr) =>
                    normalize(pr.parameter).includes(q) ||
                    pr.subParameters.some((sp) =>
                      normalize(sp.subParameter).includes(q) || sp.indicators.length > 0
                    )
                  )
                );
                const hasAny = includeProgram || keptAreas.length > 0;
                return hasAny ? { ...p, areas: keptAreas.length ? keptAreas : p.areas } : null;
              })
              .filter(Boolean),
          ])
        );
        const hasMatches = includeAccred || Object.values(filteredLevels).some((arr) => arr.length > 0);
        return hasMatches ? { ...accred, levels: filteredLevels } : null;
      })
      .filter(Boolean);
  }, [assignmentsRaw, query]);

  // --------------------------------------------------
  // UI helpers & collapsibles
  // --------------------------------------------------
  const handleItemClick = (item) => setActiveItemId(item.id);
  const handleLevelScroll = (id) => levelRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleDropdownClick = (opts = {}) => {
    if (opts.isShowParameter) setShowParameters((v) => !v);
    if (opts.isShowSubParam) setShowSubParam((v) => !v);
    if (opts.isShowIndicator) setShowIndicator((v) => !v);
  };

  const [openAreas, setOpenAreas] = useState({});
  const [openParams, setOpenParams] = useState({});
  const toggleArea = (key) => setOpenAreas((s) => ({ ...s, [key]: !s[key] }));
  const toggleParam = (key) => setOpenParams((s) => ({ ...s, [key]: !s[key] }));

  // --------------------------------------------------
  // Choose + group for assignments UI
  // --------------------------------------------------
  const dataPrograms = filteredPrograms;      // array: [{accredTitle, levels}]
  const dataAssignments = filteredAssignments;

  const groupedAssignments = useMemo(() => {
    const acc = {};
    (dataAssignments || []).forEach(({ accredTitle, levels }) => {
      if (!acc[accredTitle]) acc[accredTitle] = {};
      Object.entries(levels || {}).forEach(([levelKey, programs]) => {
        if (!acc[accredTitle][levelKey]) acc[accredTitle][levelKey] = {};
        programs.forEach((p) => { acc[accredTitle][levelKey][p.program] = p; });
      });
    });
    return acc;
  }, [dataAssignments]);

  // --------------------------------------------------
  // Return
  // --------------------------------------------------
  return {
    refs: { searchInputRef, scrollContainerRef, levelRef },
    states: {
      setQuery,
      showParameters,
      showSubParam,
      showIndicator,
      loading,
      error,
    },
    datas: {
      items,
      activeItemId,
      query,
      dataPrograms,
      groupedPrograms,      // programs map
      dummyPrograms,        // optional
      groupedAssignments,   // used by your Assignments tab component
    },
    helpers: { formatAccreditationTitleForUI },
    handlers: {
      handleItemClick,
      handleLevelScroll,
      handleDropdownClick,
      refetch,
    },
  };
};

export default useAccreditation;
