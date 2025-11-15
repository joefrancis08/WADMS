import { useEffect, useMemo, useRef, useState } from "react";
import { useFetchILP } from "../fetch-react-query/useFetchILP";
import { useAuth } from "../../contexts/AuthContext";
import useFetchAssignmentsByUserId from "../fetch-react-query/useFetchAssignmentsByUserId";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addDocument, deleteDoc } from "../../api-calls/accreditation/accreditationAPI";
import useFetchDocumentsByUploader from "../fetch-react-query/useFetchDocumentsByUploader";
import useOutsideClick from "../useOutsideClick";
import PATH from "../../constants/path";
import { useNavigate } from "react-router-dom";

const LEVEL_ORDER = ['Preliminary', 'Level I', 'Level II', 'Level III', 'Level IV', 'Unspecified'];
const { PROGRAM_AREAS } = PATH.TASK_FORCE;

const useAccreditation = () => {
  const { user } = useAuth();
  const docOptionRef = useRef();
  const navigate = useNavigate();

  const { accredInfoLevelPrograms, loading, error, refetch } = useFetchILP();
  const infoLevelPrograms = useMemo(
    () => accredInfoLevelPrograms?.data ?? [],
    [accredInfoLevelPrograms]
  );

  const { assignments } = useFetchAssignmentsByUserId(user?.userId);
  const taskForceAssignments = useMemo(() => assignments?.assignmentData ?? [], [assignments?.assignmentData]);

  const {
    uploaderDocuments,
    loadingUploaderDocuments,
    errorUploaderDocuments,
    refetchUploaderDocuments
  } = useFetchDocumentsByUploader(user.userId);
  const uploaderDocs = useMemo(() => uploaderDocuments?.documents ?? [], [uploaderDocuments?.documents]);

  console.log(loadingUploaderDocuments);

  const items = [
    { id: 'programs', name: 'Programs' },
    { id: 'assignments', name: 'Assignments' },
  ];

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
  const [activeParamId, setActiveParamId] = useState(null);
  const [activeSubparamId, setActiveSubparamId] = useState(null);
  const [activeIndicatorId, setActiveIndicatorId] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({}); // { [id]: File[] }
  const [uploadingIds, setUploadingIds] = useState([]); // store subParameter IDs currently uploading
  const [activeDocId, setActiveDocId] = useState(null);

  const searchInputRef = useRef(null);
  const levelRef = useRef({});
  const scrollContainerRef = useRef(null);

  useOutsideClick(docOptionRef, () => setActiveDocId(null));

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

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
    return apiProgramsArray.length ? apiProgramsArray : [];
  }, [apiProgramsArray]);

  const assignmentRows = useMemo(() => {
    if (Array.isArray(taskForceAssignments)) return taskForceAssignments;
    if (taskForceAssignments) return [taskForceAssignments];
    return [];
  }, [taskForceAssignments]);

  const apiAssignmentsArray = useMemo(() => {
    // Build: { [accredTitle]: { [level]: { [programName]: { program, areas[] } } } }
    const acc = {};

    for (const row of assignmentRows) {
      console.log(row);
      const titleBase = row.accredTitle || 'Accreditation';
      const year = row.accredYear || '';
      const accredID = row.accredID || null;
      const accredTitle = year ? `${titleBase} ${year}` : titleBase;
      const levelID = row.levelID || null;
      const level = row.level || 'Unspecified';
      const programID = row.programID || null;
      const programName = row.program || 'Unnamed Program';

      if (!acc[accredTitle]) acc[accredTitle] = {};
      if (!acc[accredTitle][level]) acc[accredTitle][level] = {};
      if (!acc[accredTitle][level][programName]) {
        acc[accredTitle][level][programName] = {
          accredID,
          levelID,
          programID,
          program: programName,
          areas: [],
        };
      }

      // Get the program record
      const programObj = acc[accredTitle][level][programName];

      // Area (may be null)
      if (row.area) {
        let areaObj = programObj.areas.find(a => a.areaID === row.areaID);
        if (!areaObj) {
          areaObj = { 
            areaID: row.areaID,
            area: row.area, 
            parameters: [] 
          };
          programObj.areas.push(areaObj);
        }

        // Parameter
        if (row.parameter) {
          let paramObj = areaObj.parameters.find(p => p.parameterID === row.parameterID);
          if (!paramObj) {
            paramObj = { 
              parameterID: row.parameterID,
              parameter: row.parameter, 
              subParameters: [] 
            };
            areaObj.parameters.push(paramObj);
          }

          // Sub-Parameter
          if (row.subParameter) {
            let subParamObj = paramObj.subParameters.find(s => s.subParameterID === row.subParameterID);
            if (!subParamObj) {
              subParamObj = { subParameterID: row.subParameterID, subParameter: row.subParameter, indicators: [] };
              paramObj.subParameters.push(subParamObj);
            }

            // Indicator
            if (row.indicator) {
              if (!subParamObj.indicators.includes(row.indicatorID)) {
                subParamObj.indicators.push(row.indicatorID);
              }
            }
          }
        }
      }
    }

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
    return apiAssignmentsArray.length ? apiAssignmentsArray : [];
  }, [apiAssignmentsArray]);

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

  const handleItemClick = (item) => setActiveItemId(item.id);
  const handleLevelScroll = (id) => levelRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleDropdownClick = (opts = {}) => {
    if (opts.isShowParameter && opts.id) setActiveParamId(prev => prev !== opts.id ? opts.id : null);
    if (opts.isShowSubParam && opts.id) setActiveSubparamId(prev => prev !== opts.id ? opts.id : null);
    if (opts.isShowIndicator && opts.id) setActiveIndicatorId(prev => prev !== opts.id ? opts.id : null);
  };

  console.log({
    activeParamId,
    activeSubparamId,
    activeIndicatorId
  });

  const dataPrograms = filteredPrograms;    
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

  console.log(groupedAssignments);

  /* -----------Program tab handlers ----------- */
  const handleProgramCardClick = (accredInfoUUID, level, programUUID) => {
    const formattedLevel = String(level).toLowerCase().split(' ').join('-');
    localStorage.setItem('a_uuid', accredInfoUUID);
    localStorage.setItem('a_level', level);
    localStorage.setItem('f_a_level', formattedLevel);
    console.log({accredInfoUUID, formattedLevel, programUUID})
    navigate(PROGRAM_AREAS(programUUID));
  };

  /* -----------Assignment tab handlers ----------- */
  const handleUploadClick = (id) => {
    document.getElementById(`file-input-${id}`).click();
  };

  const handleFileChange = async (e, id) => {
    const { 
      accredInfoId, levelId, programId, areaId, 
      paramId = null, subParameterId = null,
      indicatorId = null
    } = e.target.dataset; 

    console.log(e.target.dataset);
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      showErrorToast(
        'Only PDF, DOCX, PPTX, and image files are allowed.',
        'top-center',
        5000
      );
      e.target.value = ''; // reset input
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [id]: validFiles
    }));

    setUploadingIds(prev => [...prev, id]);

    await handleSaveFile({
      validFiles,
      accredInfoId,
      levelId,
      programId,
      areaId,
      paramId,
      subParameterId,
      indicatorId
    });

    // Once upload completes (success or fail), remove it
    setUploadingIds(prev => prev.filter(id => id !== subParameterId));

    refetchUploaderDocuments();
  };

  console.log({ selectedFiles });

  const handleSaveFile = async (data = {}) => {
    const { 
      validFiles, accredInfoId, levelId, programId, areaId, 
      paramId = null, subParameterId = null, indicatorId = null 
    } = data;

    if (!accredInfoId || !levelId || !programId || !areaId) {
      showErrorToast('Missing required data for upload.');
      return;
    }
    
    if (validFiles.length === 0) {
      showErrorToast('No file selected!');
      return;
    }

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('accredInfoId', accredInfoId);
      formData.append('levelId', levelId);
      formData.append('programId', programId);
      formData.append('areaId', areaId);
      paramId && formData.append('parameterId', paramId);
      subParameterId && formData.append('subParameterId', subParameterId);
      indicatorId && formData.append('indicatorId', indicatorId);
      user.userId && formData.append('uploadBy', user.userId);

      const res = await addDocument(formData);

      if (res.data.success) {
        showSuccessToast(res?.data?.message || 'File uploaded successfully!');
        // Clear selection
        setSelectedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[subParameterId];
          return newFiles;
        });

        // Refetch docs so UI updates
        await refetch();
      }
      console.log(res);

      return res;
  
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast('Upload failed. Try again.');
    }
  };

  const handleDocOptionClick = (docId) => {
    setActiveDocId(prev => prev !== docId ? docId : null);
  };

  const handleDelete = async (e, docId) => {
    e.stopPropagation();

    try {
      const res = await deleteDoc(docId);

      if (res.data?.success) {
        showSuccessToast(res?.data?.message || 'Deleted successfully!');
      }

    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong. Try again.');
      throw error;
    }
  };

  console.log({ selectedFiles });

  return {
    refs: { searchInputRef, scrollContainerRef, levelRef, docOptionRef },
    states: {
      setQuery,
      activeParamId,
      activeSubparamId,
      activeIndicatorId,
      loading,
      error,
      activeDocId
    },
    datas: {
      user,
      items,
      activeItemId,
      query,
      dataPrograms,
      groupedPrograms,      
      groupedAssignments, 
      selectedFiles,
      uploaderDocs,
      loadingUploaderDocuments,
      errorUploaderDocuments, 
    },
    helpers: { formatAccreditationTitleForUI },
    handlers: {
      handleProgramCardClick,
      handleItemClick,
      handleLevelScroll,
      handleDropdownClick,
      refetch,
      handleUploadClick,
      handleFileChange,
      handleDocOptionClick,
      handleDelete
    },
  };
};

export default useAccreditation;
