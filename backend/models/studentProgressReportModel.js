const mongoose = require('mongoose');

const studentProgressReportSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A progress report must belong to a student'],
  },
  teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A progress report must have a teacher'],
  },
  level: {
    type: String,
    default: 'الأول',
  },
  lesson: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

studentProgressReportSchema.index({ studentId: 1 });
studentProgressReportSchema.index({ teacherId: 1 });

const StudentProgressReport = mongoose.model(
  'StudentProgressReport',
  studentProgressReportSchema
);

module.exports = StudentProgressReport;
