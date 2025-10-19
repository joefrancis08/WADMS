const allowedRoles = () => {
  const AR = {
    D: 'Dean',
    C: 'Task Force Chair',
    M: 'Task Force Member',
    I: 'Internal Assessor',
    A: 'Accreditor'
  };

  return {
    D: AR.D,
    C: AR.C,
    M: AR.M,
    I: AR.I,
    A: AR.A
  }
};

export default allowedRoles;
