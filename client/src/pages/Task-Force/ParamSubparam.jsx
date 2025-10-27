import React, { useState, useMemo } from 'react';
import {
  FolderOpen, Search,
  FileText, ChevronRight,
  Upload,
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import PDFViewer from '../../components/PDFViewer';
import DocumentDropdown from '../../components/Document/DocumentDropdown';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import useParamSubparam from '../../hooks/Task Force/useParamSubparam';
import PATH from '../../constants/path';
import formatAreaName from '../../utils/formatAreaName';
import formatParameterName from '../../utils/formatParameterName';
import TaskForceModal from '../../components/Task Force/TaskForceModal';
import ProfileStack from '../../components/ProfileStack';

const ParamSubparam = () => {
  const { navigate, datas, handlers } = useParamSubparam();
  const {
    accredInfoId, accredInfoUUID, title, year, accredBody,
    levelId, level, programId, programUUID, program, 
    areaId, areaUUID,  area, paramId, paramUUID, paramName, 
    subParametersData, modalType, modalData, 
    taskForceData, assignmentData, user
  } = datas;

  const {
    handleSubParamCardClick,
    handleCloseModal,
    handleProfileStackClick
  } = handlers;

  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Search Filter
  const filteredSubparams = useMemo(() => {
    if (!searchQuery) return subParametersData;
    const q = searchQuery.toLowerCase()
    return subParametersData.filter((sp) =>
      sp.sub_parameter.toLowerCase().includes(q)
    )
  }, [searchQuery, subParametersData]);

  // Breadcrumbs
  const breadcrumbItems = [
    { 
      label: `${title} ${year}`, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { 
      label: program, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { 
      label: formatAreaName(area), 
      onClick: () => {
        navigate(PATH.TASK_FORCE.PROGRAM_AREAS(programUUID));
      } 
    },
    { 
      label: paramName, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.AREA_PARAMETERS(areaUUID));
      } 
    },
    { 
      label: 'Sub-Parameters', 
      isActive: true 
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  };

  // Only logged in user should upload document
  const canUploadFor = (subParamId) =>
  Array.isArray(assignmentData) &&
  assignmentData.some(a =>
    String(a.taskForceID) === String(user?.userId) &&
    String(a.subParameterID) === String(subParamId)
  );

  return (
    <TaskForceLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header */}
          <div className='sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-slate-900 p-4 rounded-t-lg gap-4 border-b border-slate-700'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative flex items-center gap-x-2 w-full md:w-1/4'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search sub-parameter...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>

          {/* Program + Parameter Display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-auto mx-auto mb-6'>
            <p className='relative text-center gap-2 w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-6 right-1/2 translate-x-1/2 text-xs md:text-sm px-6 text-slate-200'>
                {level} &bull; {formatAreaName(area)} &bull; Parameter {formatParameterName(paramName)}
              </span>
            </p>
          </div>

          {/* Subparameter Cards */}
          <div
            className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${
              filteredSubparams.length ? 'items-start' : 'items-center'
            }`}
          >
            {!filteredSubparams.length && (
              <div className='flex flex-col items-center justify-center py-8'>
                <FolderOpen className='text-slate-600' size={160} />
                <p className='text-lg font-medium text-slate-300 mt-2'>
                  No sub-parameters found.
                </p>
              </div>
            )}

            {filteredSubparams.map((data) => (
              <div
                key={data.sub_parameter_uuid}
                className='mb-4 w-full md:w-[45%] relative flex flex-col border border-slate-700 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800'
                onClick={() => handleSubParamCardClick(data.sub_parameter_uuid)}
              >
                {console.log(data)}
                {/* Header: Sub-Parameter Name + Options */}
                <div className='relative flex items-center justify-between mb-3'>
                  <p className='font-medium text-slate-100 text-lg truncate'>
                    {data.sub_parameter}
                  </p>
                </div>

                {/* Documents Section */}
                {data.documents?.length ? (
                  <div className='flex justify-between items-center mt-1 text-sm text-slate-100 hover:bg-slate-700 rounded'>
                    <p className='flex items-center gap-x-2 p-1'>
                      <FileText className='h-5 w-5' />
                      {data.documents.length}{' '}
                      {data.documents.length === 1
                        ? 'document'
                        : 'documents'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(data.sub_parameter_id)
                      }}
                      className='ml-2 p-2 rounded-full cursor-pointer'
                    >
                      <ChevronRight
                        className={`h-5 w-5 transition-all duration-100 ${
                          expandedId === data.sub_parameter_id
                            ? 'rotate-90'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col items-start justify-center mt-2'>
                    <p className='flex items-center gap-2 text-sm text-center my-1.5 text-slate-100'>
                      No uploaded document.
                      {canUploadFor(data.sub_parameter_id) && (
                        <span
                          onClick={(e) => { e.stopPropagation() }}
                          className='flex items-center gap-x-1 bg-slate-700 px-2 py-1 rounded-full hover:bg-slate-600 text-slate-100 cursor-pointer transition  active:scale-95 hover:shadow shadow-slate-700'
                        >
                          <Upload size={18}/> Upload
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <hr className='text-slate-700 my-2 mb-8' />
                <div className='absolute bottom-2.5 left-3 z-20'>
                  <ProfileStack 
                    data={{
                      accredInfoId, levelId, programId, areaId,
                      paramId, subParameterId: data.sub_parameter_id,
                      assignmentData, taskForce: taskForceData
                    }}
                    handlers={{ handleProfileStackClick }}
                    scope='subParameter'
                  />
                </div>

                {/* Expanded Document Dropdown */}
                {expandedId === data.sub_parameter_id &&
                  data.documents.length > 0 && (
                    <div className='mt-3'>
                      <DocumentDropdown
                        docsArray={data.documents}
                        handleFileClick={(file) => setPreviewFile(file)}
                        handleRemoveClick={(file) =>
                          alert(`Remove ${file.name}`)
                        }
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {previewFile && (
        <PDFViewer file={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      <TaskForceModal 
        modalType={modalType}
        datas={{ modalData, user }}
        handlers={{ handleCloseModal }}
        scope='subParameter'
      />
    </TaskForceLayout>
  )
}

export default ParamSubparam;
