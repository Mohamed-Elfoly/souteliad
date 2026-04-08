const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const User = require('../models/userModel');
const Level = require('../models/levelModel');
const Lesson = require('../models/lessonModel');
const Quiz = require('../models/quizModel');
const Question = require('../models/questionModel');
const QuizAttempt = require('../models/quizAttemptModel');
const UserAnswer = require('../models/userAnswerModel');
const LessonProgress = require('../models/lessonProgressModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Report = require('../models/reportModel');
const Notification = require('../models/notificationModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILES
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);
const levels = JSON.parse(
  fs.readFileSync(`${__dirname}/data/levels.json`, 'utf-8')
);
const lessons = JSON.parse(
  fs.readFileSync(`${__dirname}/data/lessons.json`, 'utf-8')
);
const quizzes = JSON.parse(
  fs.readFileSync(`${__dirname}/data/quizzes.json`, 'utf-8')
);
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/data/questions.json`, 'utf-8')
);
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/data/posts.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // Import in dependency order
    await User.create(users, { validateBeforeSave: false });
    console.log('Users imported!');

    await Level.create(levels);
    console.log('Levels imported!');

    await Lesson.create(lessons);
    console.log('Lessons imported!');

    await Quiz.create(quizzes);
    console.log('Quizzes imported!');

    await Question.create(questions);
    console.log('Questions imported!');

    await Post.create(posts);
    console.log('Posts imported!');

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Notification.deleteMany();
    await Report.deleteMany();
    await Like.deleteMany();
    await Comment.deleteMany();
    await Post.deleteMany();
    await UserAnswer.deleteMany();
    await QuizAttempt.deleteMany();
    await LessonProgress.deleteMany();
    await Question.deleteMany();
    await Quiz.deleteMany();
    await Lesson.deleteMany();
    await Level.deleteMany();
    await User.deleteMany();

    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
