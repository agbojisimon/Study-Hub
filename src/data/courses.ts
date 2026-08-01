export interface CourseDefinition {
  code: string;
  title: string;
  description: string;
  weekTitles: string[];
}

export const COURSES: CourseDefinition[] = [
  {
    code: 'COS102',
    title: 'Introduction to Problem Solving',
    description:
      'A foundational course covering problem-solving strategies, algorithm development, flowcharting, pseudocode, object-oriented concepts, abstraction, and control flow in C programming.',
    weekTitles: [
      'Understanding the Problem',
      'An Overview of Problem Solving Strategies',
      'Divide and Conquer',
      'Algorithm Concept',
      'Flowchart Concepts',
      'Pseudocode',
      'Program Objects Concept',
      'Abstraction Concepts',
      'Statements and Blocks',
    ],
  },
  {
    code: 'GST122',
    title: 'Communication in English II',
    description:
      'A communication course focused on language skills, comprehension, grammar, and speaking development.',
    weekTitles: [
      'Language Skills I',
      'Language Skills II',
      'Grammar',
      'Writing Activities I',
      'Writing Activities II',
      'Types of Writing',
      'Comprehension Strategies I',
      'Comprehension Strategies II',
      'Speaking I',
      'Speaking II',
    ],
  },
];

export function getCourseDefinition(courseCode: string) {
  return COURSES.find((course) => course.code === courseCode);
}