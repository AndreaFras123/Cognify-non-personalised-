import { ReelContent, Interest, QuizQuestion } from '../types';

const scienceQuiz1: QuizQuestion = {
  id: 'sq1',
  questionText: "Who developed the theory of relativity?",
  options: [
    { id: 'sq1o1', text: 'Isaac Newton' },
    { id: 'sq1o2', text: 'Albert Einstein' },
    { id: 'sq1o3', text: 'Galileo Galilei' },
    { id: 'sq1o4', text: 'Nikola Tesla' },
  ],
  correctOptionId: 'sq1o2',
};

const techQuiz1: QuizQuestion = {
  id: 'tq1',
  questionText: "What does 'Python' primarily refer to in data science?",
  options: [
    { id: 'tq1o1', text: 'A type of snake' },
    { id: 'tq1o2', text: 'A statistical method' },
    { id: 'tq1o3', text: 'A programming language' },
    { id: 'tq1o4', text: 'A data visualization tool' },
  ],
  correctOptionId: 'tq1o3',
};

const historyQuiz1: QuizQuestion = {
  id: 'hq1',
  questionText: "Which empire is known for its Pax Romana period?",
  options: [
    { id: 'hq1o1', text: 'Ottoman Empire' },
    { id: 'hq1o2', text: 'Mongol Empire' },
    { id: 'hq1o3', text: 'Persian Empire' },
    { id: 'hq1o4', text: 'Roman Empire' },
  ],
  correctOptionId: 'hq1o4',
};

const mathQuiz1: QuizQuestion = {
  id: 'mq1',
  questionText: "What is the derivative of x^2?",
  options: [
    { id: 'mq1o1', text: '2x' },
    { id: 'mq1o2', text: 'x' },
    { id: 'mq1o3', text: 'x^3/3' },
    { id: 'mq1o4', text: '2' },
  ],
  correctOptionId: 'mq1o1',
};


export const mockReels: ReelContent[] = [
  {
    id: '1',
    type: 'video',
    sourceUrl: '/videos/LLdiffusionmodel.mp4',
    user: { name: 'physics.insight', avatarUrl: 'https://picsum.photos/seed/avatar_physics/40/40' },
    description: 'Exploring diffusion models in deep learning. #AI #diffusion',
    likes: 1850,
    comments: 120,
    tags: ['Science'],
    quiz: scienceQuiz1,
  },
  {
    id: '2',
    type: 'video',
    sourceUrl: '/videos/aivoicecloning.mp4',
    user: { name: 'coder.pete', avatarUrl: 'https://picsum.photos/seed/avatar_coder/40/40' },
    description: 'AI voice cloning demo. #AI #voicecloning',
    likes: 2500,
    comments: 210,
    tags: ['Technology & Programming'],
    quiz: techQuiz1,
  },
  {
    id: '3',
    type: 'video',
    sourceUrl: '/videos/areaunderparabola.mp4',
    user: { name: 'math.magician', avatarUrl: 'https://picsum.photos/seed/avatar_math/40/40' },
    description: 'Calculating area under a parabola. #math #calculus',
    likes: 1100,
    comments: 75,
    tags: ['Mathematics'],
    quiz: mathQuiz1,
  },
  {
    id: '4',
    type: 'video',
    sourceUrl: '/videos/quantitativefinance.mp4',
    user: { name: 'finance.guru', avatarUrl: 'https://picsum.photos/seed/avatar_finance/40/40' },
    description: 'Introduction to quantitative finance. #finance #quant',
    likes: 950,
    comments: 60,
    tags: ['Technology & Programming'],
    quiz: techQuiz1,
  },
  {
    id: '5',
    type: 'video',
    sourceUrl: '/videos/quantitativehedgefunds.mp4',
    user: { name: 'hedgefund.insider', avatarUrl: 'https://picsum.photos/seed/avatar_hedge/40/40' },
    description: 'How quantitative hedge funds work. #finance #hedgefunds',
    likes: 2200,
    comments: 150,
    tags: ['Science'],
    quiz: scienceQuiz1,
  },
  {
    id: '6',
    type: 'video',
    sourceUrl: '/videos/stoichiometry.mp4',
    user: { name: 'chemistry.whiz', avatarUrl: 'https://picsum.photos/seed/avatar_chem/40/40' },
    description: 'Stoichiometry explained! #chemistry #science',
    likes: 3100,
    comments: 280,
    tags: ['Science'],
    quiz: scienceQuiz1,
  },
  {
    id: '7',
    type: 'video',
    sourceUrl: '/videos/tutancamon.mp4',
    user: { name: 'history.revealed', avatarUrl: 'https://picsum.photos/seed/avatar_chem/40/40' },
    description: 'A brief look into the rise and fall of the Roman Empire. #history #ancientcivilizations',
    likes: 1100,
    comments: 75,
    tags: ['History'],
    quiz: historyQuiz1,
  },
  {
    id: '8',
    type: 'video',
    sourceUrl: 'https://picsum.photos/seed/math_calculus/400/700',
    user: { name: 'math.magician', avatarUrl: 'https://picsum.photos/seed/avatar_math/40/40' },
    description: 'Understanding the fundamentals of Calculus. Derivatives explained simply! #mathematics #education',
    likes: 950,
    comments: 60,
    tags: ['Mathematics'],
    quiz: mathQuiz1,
  },
  {
    id: '9',
    type: 'video',
    sourceUrl: 'https://picsum.photos/seed/gauss_distribution_example/400/700',
    user: { name: 'stats.simplified', avatarUrl: 'https://picsum.photos/seed/avatar_stats/40/40' },
    description: 'Understanding Gaussian Distribution (Normal Distribution) in statistics. #mathematics #statistics #science',
    likes: 1256,
    comments: 88,
    tags: ['Mathematics', 'Science'],
    quiz: {
      id: 'mq2',
      questionText: "A Gaussian distribution is also known as?",
      options: [
        { id: 'mq2o1', text: 'Poisson Distribution' },
        { id: 'mq2o2', text: 'Binomial Distribution' },
        { id: 'mq2o3', text: 'Normal Distribution' },
      ],
      correctOptionId: 'mq2o3',
    }
  },
  {
    id: '10',
    type: 'video',
    sourceUrl: 'https://picsum.photos/seed/clt_meme_example/400/700',
    user: { name: 'data.driven.decisions', avatarUrl: 'https://picsum.photos/seed/avatar_data/40/40' },
    description: 'The Central Limit Theorem (CLT) visualized. Why is it so important? #mathematics #statistics #datascience',
    likes: 3021,
    comments: 152,
    tags: ['Mathematics', 'Science', 'Technology & Programming'],
    quiz: {
      id: 'mq4',
      questionText: "The Central Limit Theorem states that the sampling distribution of the mean will approximate a normal distribution as what increases?",
      options: [
        { id: 'mq4o1', text: 'Population variance' },
        { id: 'mq4o2', text: 'Number of variables' },
        { id: 'mq4o3', text: 'Sample size' },
        { id: 'mq4o4', text: 'Standard deviation' },
      ],
      correctOptionId: 'mq4o3',
    },
  }
];

export const getMockReels = async (): Promise<ReelContent[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockReels);
    }, 300);
  });
};