import React from 'react';
import './DepartmentList.css'; 

const DepartmentList = () => {

  const departments = [
    { code: 'AD', name: 'Artificial Intelligence and Data Science',color:"#FF6666" },
    { code: 'CB', name: 'COMPUTER SCIENCE AND BUSSINESS SYSTEM',color:"#FFB366" },
    { code: 'CD', name: 'COMPUTER SCIENCE AND DESIGN',color:"#FF9933" },
    { code: 'CE', name: 'Civil Engineering',color:"#80E6B3" },
    { code: 'CS', name: 'Computer Science and Engineering',color:"#66CCCC" },
    { code: 'EC', name: 'Electronics and Communication Engineering',color:"#9999FF" },
    { code: 'EE', name: 'Electrical and Electronics Engineering',color:"#FF66FF" },
    { code: 'EI', name: 'Electronics and Instrumentation Engineering',color:"#66FF66" },
    { code: 'IT', name: 'Information Technology',color:"#FFB300" },
    { code: 'ME', name: 'Mechanical Engineering',color:"#FF80AA" },
  ];

  return (
    <div className="department-list">
      <h2>Department Codes and Names</h2>
      <div className="departments-container">
        {departments.map(dept => (
          <div key={dept.code} className="department-item" style={{ backgroundColor: dept.color,color:"white" }}>
            <span className="dept-code">{dept.code}</span>
            <span className="dept-name">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentList;
