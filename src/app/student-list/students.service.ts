import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from './student.interface';

@Injectable()
export class StudentService {
  private readonly _students = new BehaviorSubject<Student[]>([
    { id: 1, name: 'Georgi', age: 20 },
    { id: 2, name: 'Ivan', age: 21 },
    { id: 3, name: 'Maria', age: 22 },
  ]);
  public readonly students$ = this._students.asObservable();

  get students(): Student[] {
    return this._students.getValue();
  }

  private set students(val: Student[]) {
    this._students.next(val);
  }

  addStudent(student: Student) {
    this.students = [
      ...this.students,
      { id: this.students.length + 1, name: student.name, age: student.age },
    ];
  }

  removeStudent(id: number) {
    this.students = this.students.filter((student) => student.id !== id);
  }
}
