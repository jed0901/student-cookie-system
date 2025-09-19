import React from 'react';
import type { Student } from '../types';

interface OverviewGridProps {
  students: Student[];
}

const OverviewCard: React.FC<{ student: Student }> = ({ student }) => {
    const countColor = student.count > 0 ? 'text-green-500' : student.count < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400';
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate w-full" title={student.name}>{student.name}</h3>
            <p className={`text-4xl font-mono font-bold mt-2 ${countColor}`}>
                {student.count}
            </p>
        </div>
    );
};


const OverviewGrid: React.FC<OverviewGridProps> = ({ students }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {students.map(student => (
        <OverviewCard key={student.id} student={student} />
      ))}
    </div>
  );
};

export default OverviewGrid;