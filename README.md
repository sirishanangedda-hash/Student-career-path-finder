# Student Career Finder

A responsive React application for exploring career paths through a short assessment. The frontend uses mock data and local browser storage, so the full student journey works without a backend or paid API.

Career matches are suggestions for exploration—not a measure of a student's ability, a hiring prediction, or a guaranteed career outcome. Salary figures are illustrative USD demo estimates and vary by location, experience, and employer. Qualification requirements also vary by region.

## Run on Windows

Install Node.js 20.19 or later (preferably the current LTS release) from [nodejs.org](https://nodejs.org/). The installer includes npm. Open Command Prompt or the VS Code terminal and check the installation:

```powershell
node --version
npm --version
```

From the project folder:

```powershell
cd C:\Users\DELL\carrer_finder
npm install
npm run dev
```

Open the local address printed by Vite, typically `http://localhost:5173`. Keep the terminal running while using the site. Press **Ctrl+C** to stop it.

To create and preview an optimized production build:

```powershell
npm run build
npm run preview
```

## Features

- **Home:** responsive hero, working career search, six category shortcuts, featured career cards, and a three-step introduction.
- **Assessment:** a four-step wizard covering education, academic stream, subjects, interests, skills, work environment, goals, and salary expectations. It validates each step and preserves answers when moving between steps.
- **Results:** up to five recommendations, industry/education/salary filters, save controls, and side-by-side comparison.
- **Explore:** searchable, filterable career directory; sort by name, salary, or match; add careers to compare.
- **Career details:** overview, qualifications, technical and soft skills, growth roadmap, learning resources, job roles, industries, and save control.
- **Dashboard:** profile summary, assessment completion, recommendations, saved and recently viewed careers, assessment history, and a Recharts skill-development chart.
- **Profile:** edit and save name, education, interests, and skills; view/remove saved careers and review assessment history.
- Responsive mobile navigation, keyboard focus indicators, descriptive labels, empty states, and a reduced-motion preference.

The app currently includes ten mock career profiles across Technology, Healthcare, Business, Engineering, Design, and Education. Profile details, assessment answers, saved careers, recently viewed careers, and assessment history are stored in `localStorage` on the current browser/device. This demo does not send them to a server.

## Recommendation logic

`src/App.jsx` calculates the match score by comparing selected answers with tags in `src/careers.js`:

- Interests: 30% of the available score.
- Skills: 20%.
- Favorite subjects: 15%.
- Career goals: 15%.
- Academic stream: 15%.
- Education level: 5%.

Categories with no answer are left out of the denominator. The score is rounded percentage overlap with this small mock dataset, not a probability of success. Preferred work environment and salary expectations are collected but do not affect the current score. Adjust career tags and weights after discussing the trade-offs with students and mentors.

The initial dashboard and results preview use a clearly identified sample student profile. Completing the assessment replaces those sample preferences with the student's answers.

## Project structure

```text
carrer_finder/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx       React entry point and router setup
    App.jsx        reusable components, state, pages, scoring, and routes
    careers.js     mock careers and assessment options
    SkillProgressChart.jsx lazy-loaded Recharts visualization
    styles.css     Tailwind import and responsive design system
```

The original Streamlit/Python prototype and its tests remain in the folder as a separate starter; the React app is the primary application launched by `npm run dev`.

## API integration later

The pages and career objects are kept separate from any backend. To connect an API later, replace the mock career data and local `scoreCareer` function with a small API client/service, show loading and error states around requests, and keep browser storage as a deliberate fallback only. Avoid placing private API keys in the frontend.

## Hackathon presentation outline

1. **Problem:** Students often struggle to connect their interests and strengths with realistic career options and actionable learning steps.
2. **Solution:** Student Career Finder offers an interactive, transparent starting point for career exploration.
3. **Demo:** Search featured roles, take the assessment, view the top matches, open a roadmap, save two options, compare them, and revisit the dashboard/profile.
4. **Features:** six career categories, multi-step assessment, explainable match scores, learning paths, filters, comparison, and local profile persistence.
5. **Technology:** React, React Router, Tailwind CSS, Lucide React, Recharts, Vite, and mock data.
6. **Future improvements:** connect a privacy-conscious backend, expand locally relevant pathways and salary sources, add downloadable roadmaps, validate recommendations with students and counselors, and make progress tracking fully personalized.
