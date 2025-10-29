export interface ILockIn {
  schoolName: string;
  students: IStudent[];
}

export interface IStudent {
  studentName: string;
  lockinScore: number;
  lockedInInterpretation: string;
  lockedInColor: string;
}
