const InstitutionList = {
    MIT: 'MediCaps Institute of Technology ',
    MIM: 'MediCaps Institute of Management ',
    MIPER: 'MediCaps  Institute Of Pharmaceutical Education & Research',
    MMR: 'MediCaps Faculty of Management and Research',
    MIL: 'MediCaps  Institute of LAW',
    CDC: 'Career Development Cell',
    AC: 'Acro Care',
    // Add more institution mappings as needed
  };
  
  const DepartmentList = {
    CE: 'Civil Engineering',
    ME: 'Mechanical Engineering',
    EC: 'Electronics & Communication',
    CSE: 'Computer Science & Engineering',
    AIML: 'Artificial Intelligence and Machine Learning',
    IT: 'Information Technology',
    CSIT: 'Computer Science and Information Technology',
    FCA: 'Faculty of Computer Applications',
    HUMI: 'Humanities',
    CHEM: 'Chemistry',
    AC: 'Acro Care',
    CDC: 'Career Development Cell',
    BSC: 'Bio Science',
    BBA: 'Bachelor of Business Administration',
    MIPER: 'MediCaps  Institute Of Pharmaceutical Education & Research',
    MMR: 'MediCaps Faculty of Management and Research',
    MIL: 'MediCaps  Institute of LAW',
    EDC: 'EDC',
    PLACEMENT: 'Placement',
    TRAINING: 'Training',
    IIPC: 'IIPC',
    // Add more department mappings as needed
  };
  
  const institutions = [
    {
      name: InstitutionList['AITR'],
      departments: [
        DepartmentList['CE'],
        DepartmentList['ME'],
        DepartmentList['EC'],
        DepartmentList['CSE'],
        DepartmentList['AIML'],
        DepartmentList['IT'],
        DepartmentList['CSIT'],
        DepartmentList['FCA'],
        DepartmentList['HUMI'],
        DepartmentList['CHEM'],
      ],
    },
    {
      name: InstitutionList['MIM'],
      departments: [
        DepartmentList['BSC'],
        DepartmentList['BBA'],
        DepartmentList['MBA'],
      ],
    },
    {
      name: InstitutionList['MIPER'],
      departments: [
        DepartmentList['MIPER'],
      ],
    },
    {
      name: InstitutionList['AMR'],
      departments: [
        DepartmentList['AMR'],
      ],
    },
    {
      name: InstitutionList['MMR'],
      departments: [
        DepartmentList['AILAW'],
      ],
    },
    {
      name: InstitutionList['CDC'],
      departments: [
        DepartmentList['CDC'],
        DepartmentList['EDC'],
        DepartmentList['PLACEMENT'],
        DepartmentList['TRAINING'],
        DepartmentList['IIPC'],
      ],
    },
    {
      name: InstitutionList['AC'],
      departments: [
        DepartmentList['AC'],
      ],
    },
    // Add more institutions based on InstitutionList mappings as needed
  ];
  
  export { institutions, InstitutionList, DepartmentList };
  