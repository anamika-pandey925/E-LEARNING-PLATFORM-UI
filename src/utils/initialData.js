export const initialCourses = [
  {
    id: 'web-dev-basics',
    title: 'Web Development Basics',
    description: 'Master the core building blocks of the web. Learn HTML5 structure, semantic elements, CSS3 styles, responsive grid/flexbox layouts, and basic page deployment.',
    duration: '12 hrs',
    rating: 4.8,
    students: '3.4k',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
    instructor: 'Alex Rivera, Senior Web Architect',
  },
  {
    id: 'javascript-beginners',
    title: 'JavaScript for Beginners',
    description: 'Unlock the power of programming in the browser. Learn variables, conditional structures, loops, array methods, DOM manipulation, and asynchronous API actions.',
    duration: '18 hrs',
    rating: 4.7,
    students: '4.1k',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80',
    instructor: 'Sarah Chen, Full-Stack Developer',
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Step into data engineering and analysis. Understand Python coding structures, Jupyter Notebook operations, Pandas datasets, and data visualization using Matplotlib.',
    duration: '22 hrs',
    rating: 4.9,
    students: '2.8k',
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    instructor: 'Dr. Michael Vance, Data Scientist',
  },
  {
    id: 'math-competitive',
    title: 'Mathematics for Competitive Exams',
    description: 'Crack core quantitative sections of competitive entry tests. Cover shortcuts for probability, complex arithmetic, statistics, algebraic theories, and reasoning puzzles.',
    duration: '35 hrs',
    rating: 4.6,
    students: '1.9k',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. Ramesh Sharma',
  },
  {
    id: 'english-grammar',
    title: 'Comprehensive English Grammar',
    description: 'Refine syntax and build outstanding communications. Perfect your understanding of tenses, active/passive voice, direct speech, essay formats, and advanced vocabulary.',
    duration: '15 hrs',
    rating: 4.5,
    students: '1.2k',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    instructor: 'Emma Watson, Linguistics Specialist',
  },
  {
    id: 'chemistry-physics-basics',
    title: 'Fundamentals of Science (Physics/Chemistry)',
    description: 'Delve into the core mechanisms governing the universe. Learn atomic structures, chemical bonds, thermodynamics, kinematics, laws of motion, and electromagnetic forces.',
    duration: '28 hrs',
    rating: 4.7,
    students: '1.5k',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    instructor: 'Dr. Robert Oppenheimer, STEM Chair',
  },
];

export const initialVideos = [
  {
    id: 'video-html-basics',
    title: 'HTML Complete Crash Course',
    embedUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4?enablejsapi=1',
    duration: '45 mins',
    category: 'HTML',
    description: 'Understand core tag structures, document sections, link embeddings, and layout rules for HTML templates.',
  },
  {
    id: 'video-css-layouts',
    title: 'Advanced CSS Flexbox & Grid',
    embedUrl: 'https://www.youtube.com/embed/ESnrn1kAD4E?enablejsapi=1',
    duration: '50 mins',
    category: 'CSS',
    description: 'Master aligning web content elements. Deep dive into container styling, wraps, grid lines, and adaptive viewports.',
  },
  {
    id: 'video-js-beginners',
    title: 'JavaScript DOM Manipulation',
    embedUrl: 'https://www.youtube.com/embed/ajdRvxDWH4w?enablejsapi=1',
    duration: '65 mins',
    category: 'JavaScript',
    description: 'Learn to interact dynamically with web pages. Attach listeners, update classes, and handle page structure events.',
  },
  {
    id: 'video-python-science',
    title: 'Python for Data Analysis',
    embedUrl: 'https://www.youtube.com/embed/UrsmFxEIp5k?enablejsapi=1',
    duration: '70 mins',
    category: 'Python',
    description: 'Get started with Pandas datasets. Load raw csv text, compile statistics data, and run graphs using math plots.',
  },
];

export const initialAssignments = [
  {
    id: 'html-basics',
    title: 'HTML Structure & Forms',
    subject: 'HTML',
    deadline: 'Aug 18, 2026',
    fileUrl: '/assignment pdf/Assignments.pdf',
    description: 'Build a standard landing page layout and a functional registration form incorporating proper tags, metadata, semantic blocks, and field validations.',
    pages: [
      {
        pageNum: 1,
        title: 'HTML Structural Layout Task',
        content: `Task 1: Creating a Landing Page Structure
Create an index.html file containing:
- A responsive <header> block with logo and basic unordered list links.
- A main content area using <section>, <article>, and <aside> tags.
- A <footer> element with a simulated copyright claim.

Ensure all tags are closed properly, indentation is standard, and UTF-8 encoding is declared.`,
      },
      {
        pageNum: 2,
        title: 'HTML Form Validation Task',
        content: `Task 2: Registration Form validation
Create a register.html form with the following inputs:
- Full Name (required, text, min 3 chars).
- Email Address (type="email", required).
- Password (type="password", min 8 chars).
- Student ID (type="number", range 1000-9999).

Test proper validation constraints in the browser before submitting.`,
      },
    ],
  },
  {
    id: 'css-layouts',
    title: 'Flexbox, Grid & Responsive UI',
    subject: 'CSS',
    deadline: 'Aug 22, 2026',
    fileUrl: '/assignment pdf/Assignments1.pdf',
    description: 'Design a beautiful multi-column dashboard grid and a responsive card library that resizes fluidly on tablet, laptop, and mobile screens without breaking text boundaries.',
    pages: [
      {
        pageNum: 1,
        title: 'Asymmetrical Layouts using Grid',
        content: `Task 1: The Multi-Grid Dashboard
Create a style.css stylesheet configuring a dashboard wrapper:
- Define grid-template-rows and grid-template-columns.
- Align sidebar item to fill column 1, spans rows 1-3.
- Build header spanning columns 2-4.
- Create 3 data cards below the header that adapt size dynamically.`,
      },
      {
        pageNum: 2,
        title: 'Responsive Card Grids using Flexbox',
        content: `Task 2: Fluid Flex Items
Design 4 learning cards. Apply display: flex; flex-wrap: wrap; justify-content: space-around;.
Add media queries modifying the layout structure:
- Laptop: 4 cards in a row.
- Tablet: 2 cards in a row.
- Mobile: cards stack vertically, text centers.`,
      },
    ],
  },
  {
    id: 'js-dom',
    title: 'Dynamic Web App & Event Handlers',
    subject: 'JavaScript',
    deadline: 'Aug 28, 2026',
    fileUrl: '/assignment pdf/Assignments2.pdf',
    description: 'Write JavaScript code to create a dynamic Todo List containing local storage hooks, input filters, edit modal, delete animations, and completion indicators.',
    pages: [
      {
        pageNum: 1,
        title: 'Event Handlers & State Management',
        content: `Task 1: Dynamically Appending Items
Write DOM code:
- Query input field and submit button elements.
- Create event listener on button click.
- Prevent default form reload, extract input value.
- Instantiate new <li>, set text, and append to <ul> container.`,
      },
      {
        pageNum: 2,
        title: 'Browser Local Storage Hookup',
        content: `Task 2: Persistence Setup
Implement persistent state:
- When a task is added, write array to localStorage as JSON string.
- Create onload hook loading the string, parsing it, and rendering cards.
- Add toggle action on item double-click marking items finished.`,
      },
    ],
  },
  {
    id: 'python-basics',
    title: 'Python File Processing & Pandas',
    subject: 'Python',
    deadline: 'Sep 05, 2026',
    fileUrl: '/assignment pdf/Assignments3.pdf',
    description: 'Create a Python script to import and process CSV files, calculate data frames, handle missing values, and export aggregate data tables using Pandas.',
    pages: [
      {
        pageNum: 1,
        title: 'Python File Parsing Basics',
        content: `Task 1: Text file cleaner
Write main.py script:
- Open a text file raw.txt using "with open()" pattern.
- Parse text lines, strip spaces, discard lines starting with #.
- Write cleaned records into standard output.txt file.`,
      },
      {
        pageNum: 2,
        title: 'Data Frame Analysis using Pandas',
        content: `Task 2: Aggregate Student Scores
Create data.py script:
- Load scores.csv into a pandas DataFrame.
- Compute average scores grouped by course subjects.
- Filter out records showing less than 50% score.
- Export results to final_report.csv.`,
      },
    ],
  },
];
