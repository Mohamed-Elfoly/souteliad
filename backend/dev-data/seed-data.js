const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'data');

const users = [
  { _id: '507f1f77bcf86cd799439011', firstName: 'Admin', lastName: 'System', email: 'admin@sout-elyad.com', password: 'password123', passwordConfirm: 'password123', role: 'admin', active: true },
  { _id: '507f1f77bcf86cd799439012', firstName: 'Mai', lastName: 'Awni', email: 'teacher@sout-elyad.com', password: 'password123', passwordConfirm: 'password123', role: 'teacher', active: true },
  { _id: '507f1f77bcf86cd799439013', firstName: 'Youssef', lastName: 'Omar', email: 'user2@sout-elyad.com', password: 'password123', passwordConfirm: 'password123', role: 'user', active: true },
  { _id: '507f1f77bcf86cd799439014', firstName: 'Sara', lastName: 'Ahmed', email: 'sara@sout-elyad.com', password: 'password123', passwordConfirm: 'password123', role: 'user', active: true },
];
fs.writeFileSync(path.join(base, 'users.json'), JSON.stringify(users, null, 2));
console.log('users.json written');

const levels = [
  { _id: '507f1f77bcf86cd799439021', title: 'الاول', description: 'تعلّم أساسيات لغة الإشارة العربية — الحروف والأرقام والألوان', levelOrder: 1, adminId: '507f1f77bcf86cd799439011' },
  { _id: '507f1f77bcf86cd799439022', title: 'الثانى', description: 'تعابير الأسرة والمشاعر والتحيات في الحياة اليومية', levelOrder: 2, adminId: '507f1f77bcf86cd799439011' },
  { _id: '507f1f77bcf86cd799439023', title: 'الثالث', description: 'غرف المنزل والأدوات والملابس وكل ما يخص البيت', levelOrder: 3, adminId: '507f1f77bcf86cd799439011' },
  { _id: '507f1f77bcf86cd799439024', title: 'الرابع', description: 'أنواع الطعام والسوق والمطعم والمعاملات اليومية', levelOrder: 4, adminId: '507f1f77bcf86cd799439011' },
];
fs.writeFileSync(path.join(base, 'levels.json'), JSON.stringify(levels, null, 2));
console.log('levels.json written');

const lessons = [
  { _id: '507f1f77bcf86cd799439031', title: 'الحروف العربية', description: 'تعلّم إشارات جميع حروف الهجاء العربية خطوة بخطوة من خلال فيديوهات قصيرة وتمارين تفاعلية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/letters.png', lessonOrder: 1, levelId: '507f1f77bcf86cd799439021', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439032', title: 'الأرقام من ١ إلى ١٠', description: 'تعلّم إشارات الأرقام من واحد إلى عشرة بطريقة ممتعة وتفاعلية مع أمثلة من الحياة اليومية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/letters.png', lessonOrder: 2, levelId: '507f1f77bcf86cd799439021', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439033', title: 'الألوان الأساسية', description: 'تعلّم إشارات الألوان الأساسية وكيفية توظيفها في جمل مفيدة تستخدمها يومياً', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/letters.png', lessonOrder: 3, levelId: '507f1f77bcf86cd799439021', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439034', title: 'أفراد الأسرة', description: 'تعلّم كيفية التعبير عن أفراد الأسرة بلغة الإشارة مع أمثلة عملية من البيئة العربية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/family.png', lessonOrder: 1, levelId: '507f1f77bcf86cd799439022', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439035', title: 'المشاعر والأحاسيس', description: 'عبّر عن الفرح والحزن والدهشة والحب بلغة الإشارة بطريقة طبيعية وواضحة', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/family.png', lessonOrder: 2, levelId: '507f1f77bcf86cd799439022', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439036', title: 'التحيات والمجاملات', description: 'تعلّم عبارات التحية والمجاملة الأكثر استخداماً في الحياة اليومية بلغة الإشارة', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/family.png', lessonOrder: 3, levelId: '507f1f77bcf86cd799439022', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439037', title: 'غرف المنزل', description: 'تعلّم إشارات غرف المنزل ومناطقه المختلفة كالمطبخ والغرفة والصالة', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/home.png', lessonOrder: 1, levelId: '507f1f77bcf86cd799439023', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439038', title: 'الأدوات المنزلية', description: 'تعلّم أسماء الأجهزة والأدوات المنزلية الشائعة بلغة الإشارة مع تمارين تطبيقية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/home.png', lessonOrder: 2, levelId: '507f1f77bcf86cd799439023', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439039', title: 'الملابس والأثاث', description: 'تعلّم إشارات الملابس والأثاث التي تستخدمها في حياتك اليومية داخل البيت وخارجه', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/home.png', lessonOrder: 3, levelId: '507f1f77bcf86cd799439023', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439040', title: 'أنواع الطعام', description: 'تعلّم إشارات الأطعمة والمشروبات الشائعة في المطبخ العربي والحياة اليومية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/food.png', lessonOrder: 1, levelId: '507f1f77bcf86cd799439024', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439041', title: 'السوق والتسوق', description: 'تعلّم كيفية التسوق والتواصل مع البائعين في السوق بلغة الإشارة بثقة واحترافية', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/food.png', lessonOrder: 2, levelId: '507f1f77bcf86cd799439024', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439042', title: 'المطعم والطلب', description: 'تعلّم إشارات الطلب في المطعم والتعامل مع القائمة والنادل بلغة الإشارة', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: '/images/food.png', lessonOrder: 3, levelId: '507f1f77bcf86cd799439024', teacherId: '507f1f77bcf86cd799439012' },
];
fs.writeFileSync(path.join(base, 'lessons.json'), JSON.stringify(lessons, null, 2));
console.log('lessons.json written');

const quizzes = [
  { _id: '507f1f77bcf86cd799439051', title: 'اختبار الحروف العربية', lessonId: '507f1f77bcf86cd799439031', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439052', title: 'اختبار الأرقام', lessonId: '507f1f77bcf86cd799439032', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439053', title: 'اختبار الألوان', lessonId: '507f1f77bcf86cd799439033', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439054', title: 'اختبار أفراد الأسرة', lessonId: '507f1f77bcf86cd799439034', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439055', title: 'اختبار المشاعر', lessonId: '507f1f77bcf86cd799439035', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439056', title: 'اختبار التحيات', lessonId: '507f1f77bcf86cd799439036', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439057', title: 'اختبار غرف المنزل', lessonId: '507f1f77bcf86cd799439037', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439058', title: 'اختبار الأدوات المنزلية', lessonId: '507f1f77bcf86cd799439038', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439059', title: 'اختبار الملابس', lessonId: '507f1f77bcf86cd799439039', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439060', title: 'اختبار الطعام', lessonId: '507f1f77bcf86cd799439040', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439061', title: 'اختبار التسوق', lessonId: '507f1f77bcf86cd799439041', teacherId: '507f1f77bcf86cd799439012' },
  { _id: '507f1f77bcf86cd799439062', title: 'اختبار المطعم', lessonId: '507f1f77bcf86cd799439042', teacherId: '507f1f77bcf86cd799439012' },
];
fs.writeFileSync(path.join(base, 'quizzes.json'), JSON.stringify(quizzes, null, 2));
console.log('quizzes.json written');

const questions = [
  { _id: '507f1f77bcf86cd799439071', questionText: 'ما إشارة حرف الألف؟', questionType: 'mcq', marks: 2, options: [{ text: 'رفع السبابة للأعلى', isCorrect: true }, { text: 'إغلاق جميع الأصابع', isCorrect: false }, { text: 'فتح الكف كاملاً', isCorrect: false }, { text: 'ثني الإبهام', isCorrect: false }], quizId: '507f1f77bcf86cd799439051' },
  { _id: '507f1f77bcf86cd799439072', questionText: 'إشارة حرف الباء تُؤدَّى بمد السبابة أفقياً', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439051' },
  { _id: '507f1f77bcf86cd799439073', questionText: 'أيّ إشارة تمثّل حرف الميم؟', questionType: 'mcq', marks: 2, options: [{ text: 'وضع السبابة على الشفتين', isCorrect: true }, { text: 'إبهام للأعلى', isCorrect: false }, { text: 'فتح الكف تجاه الوجه', isCorrect: false }, { text: 'تشبيك السبابتين', isCorrect: false }], quizId: '507f1f77bcf86cd799439051' },
  { _id: '507f1f77bcf86cd799439074', questionText: 'ما إشارة الرقم ٥؟', questionType: 'mcq', marks: 2, options: [{ text: 'فتح الأصابع الخمسة', isCorrect: true }, { text: 'رفع إصبعين', isCorrect: false }, { text: 'ثني ثلاثة أصابع', isCorrect: false }, { text: 'القبضة المغلقة', isCorrect: false }], quizId: '507f1f77bcf86cd799439052' },
  { _id: '507f1f77bcf86cd799439075', questionText: 'إشارة الرقم ١ تُؤدَّى برفع السبابة فقط', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439052' },
  { _id: '507f1f77bcf86cd799439076', questionText: 'كيف تُؤدِّي إشارة الرقم ١٠؟', questionType: 'mcq', marks: 2, options: [{ text: 'فتح الكفّين معاً', isCorrect: true }, { text: 'رفع إصبع واحد', isCorrect: false }, { text: 'ثني الإبهام', isCorrect: false }, { text: 'تشبيك الأصابع', isCorrect: false }], quizId: '507f1f77bcf86cd799439052' },
  { _id: '507f1f77bcf86cd799439077', questionText: 'ما إشارة اللون الأحمر؟', questionType: 'mcq', marks: 2, options: [{ text: 'تمرير السبابة على الشفة السفلى', isCorrect: true }, { text: 'تغطية العين باليد', isCorrect: false }, { text: 'رفع الكفّين للأعلى', isCorrect: false }, { text: 'لمس الأنف', isCorrect: false }], quizId: '507f1f77bcf86cd799439053' },
  { _id: '507f1f77bcf86cd799439078', questionText: 'إشارة اللون الأزرق تشبه إشارة الماء', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: false }, { text: 'خطأ', isCorrect: true }], quizId: '507f1f77bcf86cd799439053' },
  { _id: '507f1f77bcf86cd799439079', questionText: 'ما إشارة كلمة أمّ؟', questionType: 'mcq', marks: 2, options: [{ text: 'وضع اليد برفق على الخد', isCorrect: true }, { text: 'إبهام للأعلى', isCorrect: false }, { text: 'الأصابع للأمام', isCorrect: false }, { text: 'فتح الكف ومدّه للأمام', isCorrect: false }], quizId: '507f1f77bcf86cd799439054' },
  { _id: '507f1f77bcf86cd799439080', questionText: 'إشارة الأب تُوضع على الجبهة', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439054' },
  { _id: '507f1f77bcf86cd799439081', questionText: 'ما إشارة الشعور بالسعادة؟', questionType: 'mcq', marks: 2, options: [{ text: 'حركة دائرية على الصدر', isCorrect: true }, { text: 'الإشارة للأسفل بكلتا اليدين', isCorrect: false }, { text: 'تغطية الوجه باليدين', isCorrect: false }, { text: 'تلويح اليدين بشكل متكرر', isCorrect: false }], quizId: '507f1f77bcf86cd799439055' },
  { _id: '507f1f77bcf86cd799439082', questionText: 'إشارة الحزن تتضمّن تحريك اليدين للأسفل أمام الوجه', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439055' },
  { _id: '507f1f77bcf86cd799439083', questionText: 'ما إشارة التحية بكلمة مرحباً؟', questionType: 'mcq', marks: 2, options: [{ text: 'تلويح الكف المسطّح من الجبهة للخارج', isCorrect: true }, { text: 'الإشارة إلى الشخص بالسبابة', isCorrect: false }, { text: 'النقر على الصدر مرتين', isCorrect: false }, { text: 'لمس الأذن', isCorrect: false }], quizId: '507f1f77bcf86cd799439056' },
  { _id: '507f1f77bcf86cd799439084', questionText: 'إشارة شكراً تُؤدَّى بلمس الشفتين ثم تحريك اليد للخارج', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439056' },
  { _id: '507f1f77bcf86cd799439085', questionText: 'ما إشارة غرفة النوم؟', questionType: 'mcq', marks: 2, options: [{ text: 'وضع اليدين على جانب الوجه كأنك نائم', isCorrect: true }, { text: 'تلويح اليدين للأعلى', isCorrect: false }, { text: 'النقر على السبابتين معاً', isCorrect: false }, { text: 'تشكيل سقف بالأصابع', isCorrect: false }], quizId: '507f1f77bcf86cd799439057' },
  { _id: '507f1f77bcf86cd799439086', questionText: 'إشارة المطبخ تتضمّن حركة اليد المرتبطة بالطهي', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439057' },
  { _id: '507f1f77bcf86cd799439087', questionText: 'ما إشارة الكرسي؟', questionType: 'mcq', marks: 2, options: [{ text: 'نقر إصبعين مثنيّين على اليد الأخرى', isCorrect: true }, { text: 'تقاطع الذراعين على الصدر', isCorrect: false }, { text: 'رفع الكفّين للأعلى', isCorrect: false }, { text: 'تمرير يد تحت الأخرى', isCorrect: false }], quizId: '507f1f77bcf86cd799439058' },
  { _id: '507f1f77bcf86cd799439088', questionText: 'إشارة الطاولة تُؤدَّى بوضع ساعد فوق الآخر', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439058' },
  { _id: '507f1f77bcf86cd799439089', questionText: 'ما إشارة القميص؟', questionType: 'mcq', marks: 2, options: [{ text: 'قرص قماش القميص على الصدر بكلتا اليدين', isCorrect: true }, { text: 'لمس الكتف والانزلاق للأسفل', isCorrect: false }, { text: 'وضع اليدين على الخصر', isCorrect: false }, { text: 'النقر على المعصم بشكل متكرر', isCorrect: false }], quizId: '507f1f77bcf86cd799439059' },
  { _id: '507f1f77bcf86cd799439090', questionText: 'إشارة الحذاء تُؤدَّى بالنقر على قبضتين معاً', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439059' },
  { _id: '507f1f77bcf86cd799439091', questionText: 'ما إشارة الخبز؟', questionType: 'mcq', marks: 2, options: [{ text: 'تقطيع يد على ظهر اليد الأخرى', isCorrect: true }, { text: 'لمس الشفتين بأطراف الأصابع', isCorrect: false }, { text: 'فرك الراحتين بشكل دائري', isCorrect: false }, { text: 'جمع الأصابع عند الفم', isCorrect: false }], quizId: '507f1f77bcf86cd799439060' },
  { _id: '507f1f77bcf86cd799439092', questionText: 'إشارة الماء تُؤدَّى بحرف الواو ملموساً على الذقن', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439060' },
  { _id: '507f1f77bcf86cd799439093', questionText: 'ما إشارة الشراء أو التسوق؟', questionType: 'mcq', marks: 2, options: [{ text: 'تحريك الكف المسطّح للأمام كأنك تدفع مالاً', isCorrect: true }, { text: 'فرك الإبهام والسبابة معاً', isCorrect: false }, { text: 'نقر القبضة على الراحة', isCorrect: false }, { text: 'الإشارة للبضائع واحدة تلو الأخرى', isCorrect: false }], quizId: '507f1f77bcf86cd799439061' },
  { _id: '507f1f77bcf86cd799439094', questionText: 'إشارة الغالي تتضمّن تحريك اليد للأعلى بسرعة', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439061' },
  { _id: '507f1f77bcf86cd799439095', questionText: 'ما إشارة طلب الطعام في المطعم؟', questionType: 'mcq', marks: 2, options: [{ text: 'الإشارة للقائمة والإيماء برفع السبابة', isCorrect: true }, { text: 'التلويح نحو النفس بشكل متكرر', isCorrect: false }, { text: 'فرك البطن بشكل دائري', isCorrect: false }, { text: 'التصفيق مرتين', isCorrect: false }], quizId: '507f1f77bcf86cd799439062' },
  { _id: '507f1f77bcf86cd799439096', questionText: 'إشارة القائمة تُؤدَّى بفتح الكف كأنك تقلّب صفحة', questionType: 'true-false', marks: 1, options: [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }], quizId: '507f1f77bcf86cd799439062' },
];
fs.writeFileSync(path.join(base, 'questions.json'), JSON.stringify(questions, null, 2));
console.log('questions.json written');

const posts = [
  { _id: '507f1f77bcf86cd799439101', content: 'أتممت المستوى الأول! تعلّمت جميع حروف الهجاء بلغة الإشارة. كانت الرحلة ممتعة جداً!', status: 'active', userId: '507f1f77bcf86cd799439013', createdAt: new Date('2024-02-01') },
  { _id: '507f1f77bcf86cd799439102', content: 'هل يعرف أحد كيف أمارس لغة الإشارة في الحياة اليومية؟ أبحث عن أصدقاء للتدرّب معهم.', status: 'active', userId: '507f1f77bcf86cd799439014', createdAt: new Date('2024-02-02') },
  { _id: '507f1f77bcf86cd799439103', content: 'درس المشاعر كان رائعاً! أستطيع الآن التعبير عن مشاعري بثقة. شكراً لهذه المنصة المميزة.', status: 'active', userId: '507f1f77bcf86cd799439013', createdAt: new Date('2024-02-03') },
  { _id: '507f1f77bcf86cd799439104', content: 'نصيحة للمبتدئين: تدرّبوا أمام المرآة يومياً لمدة ١٥ دقيقة. ساعدني كثيراً في ضبط حركات يديّ.', status: 'active', userId: '507f1f77bcf86cd799439014', createdAt: new Date('2024-02-04') },
  { _id: '507f1f77bcf86cd799439105', content: 'أنهيت اختبار الأرقام بدرجة كاملة! أصبحت لغة الإشارة جزءاً من حياتي اليومية.', status: 'active', userId: '507f1f77bcf86cd799439013', createdAt: new Date('2024-02-05') },
];
fs.writeFileSync(path.join(base, 'posts.json'), JSON.stringify(posts, null, 2));
console.log('posts.json written');

console.log('\nAll seed files ready!');
