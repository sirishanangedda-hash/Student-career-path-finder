"""Career information and explainable rule-based recommendation logic."""

CAREERS = {
    "software_developer": {
        "title": "Software Developer",
        "icon": "💻",
        "summary": "Design, build, test, and improve software that solves real problems.",
        "tags": {
            "interests": {"coding", "building apps", "solving puzzles", "automation"},
            "skills": {"python programming", "problem solving", "debugging", "git and github"},
            "subjects": {"computer science", "mathematics", "physics"},
            "goals": {"build useful products", "work with technology", "solve challenging problems"},
        },
        "education_keywords": {"computer science", "computer engineering", "software", "information technology", "programming"},
        "skills": ["Python or another programming language", "Data structures and algorithms", "Git and GitHub", "Testing and debugging"],
        "roadmap": [
            "Learn Python basics: variables, conditions, loops, and functions.",
            "Practice lists, dictionaries, files, and object-oriented programming.",
            "Learn Git and GitHub; publish small exercises and projects.",
            "Build a useful application and write tests for its main features.",
            "Create a portfolio and practice explaining your design decisions.",
        ],
        "projects": ["A personal expense tracker", "A study planner with reminders", "A command-line quiz app"],
        "resources": [
            ("Python official tutorial", "https://docs.python.org/3/tutorial/"),
            ("CS50's Introduction to Programming with Python", "https://cs50.harvard.edu/python/"),
            ("GitHub Skills", "https://skills.github.com/"),
        ],
    },
    "ai_ml_engineer": {
        "title": "AI/ML Engineer",
        "icon": "🤖",
        "summary": "Use data, programming, and experiments to build systems that learn from examples.",
        "tags": {
            "interests": {"artificial intelligence", "data and patterns", "coding", "experiments"},
            "skills": {"python programming", "mathematics and statistics", "data analysis", "problem solving"},
            "subjects": {"computer science", "mathematics", "statistics", "physics"},
            "goals": {"work with technology", "solve challenging problems", "help people"},
        },
        "education_keywords": {"computer science", "artificial intelligence", "machine learning", "mathematics", "statistics", "data science"},
        "skills": ["Python programming", "Statistics and linear algebra", "Data cleaning and visualization", "Machine-learning fundamentals"],
        "roadmap": [
            "Strengthen Python, functions, lists, and working with files.",
            "Study basic probability, statistics, and linear algebra concepts.",
            "Learn to clean and visualize small datasets.",
            "Train and evaluate a beginner machine-learning model.",
            "Document a project, including its limitations and possible bias.",
        ],
        "projects": ["A handwritten-digit classifier", "A simple movie review sentiment demo", "A study-time versus score data exploration"],
        "resources": [
            ("Google Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"),
            ("Kaggle Learn", "https://www.kaggle.com/learn"),
            ("3Blue1Brown: Linear Algebra", "https://www.3blue1brown.com/topics/linear-algebra"),
        ],
    },
    "data_analyst": {
        "title": "Data Analyst",
        "icon": "📊",
        "summary": "Turn datasets into clear findings that help people make informed decisions.",
        "tags": {
            "interests": {"data and patterns", "research", "business", "solving puzzles"},
            "skills": {"data analysis", "mathematics and statistics", "communication", "spreadsheets"},
            "subjects": {"mathematics", "statistics", "economics", "business studies"},
            "goals": {"help people", "explain ideas clearly", "solve challenging problems"},
        },
        "education_keywords": {"statistics", "mathematics", "economics", "business", "commerce", "data science"},
        "skills": ["Spreadsheets", "SQL", "Basic statistics", "Data visualization and communication"],
        "roadmap": [
            "Practice spreadsheet formulas, sorting, filtering, and charts.",
            "Learn descriptive statistics and how to ask focused questions.",
            "Learn SQL basics: SELECT, WHERE, GROUP BY, and JOIN.",
            "Explore a public dataset and make a clear visual summary.",
            "Present your findings with context, caveats, and recommendations.",
        ],
        "projects": ["A public transport delay dashboard", "A personal spending trends report", "A survey results visualization"],
        "resources": [
            ("Kaggle Learn: Data Visualization", "https://www.kaggle.com/learn/data-visualization"),
            ("SQLBolt interactive lessons", "https://sqlbolt.com/"),
            ("Our World in Data", "https://ourworldindata.org/"),
        ],
    },
    "web_developer": {
        "title": "Web Developer",
        "icon": "🌐",
        "summary": "Create websites and web applications that people can use in a browser.",
        "tags": {
            "interests": {"building websites", "design", "coding", "building apps"},
            "skills": {"web design", "python programming", "communication", "problem solving"},
            "subjects": {"computer science", "art and design", "mathematics"},
            "goals": {"build useful products", "work with technology", "help people"},
        },
        "education_keywords": {"computer science", "web development", "software", "information technology", "design"},
        "skills": ["HTML and CSS", "JavaScript fundamentals", "Responsive design", "Python web frameworks"],
        "roadmap": [
            "Learn HTML to structure a page and CSS to style it.",
            "Build responsive layouts that work on phones and computers.",
            "Learn JavaScript basics and add simple interactions.",
            "Create a small website and publish it using a free hosting option.",
            "Explore a Python framework such as Flask or Django for the backend.",
        ],
        "projects": ["A student club information site", "A responsive personal portfolio", "A book or movie review page"],
        "resources": [
            ("MDN Learn Web Development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"),
            ("freeCodeCamp", "https://www.freecodecamp.org/learn/"),
            ("The Odin Project", "https://www.theodinproject.com/paths"),
        ],
    },
    "cybersecurity_analyst": {
        "title": "Cybersecurity Analyst",
        "icon": "🛡️",
        "summary": "Help protect systems and information by understanding risks and improving defenses.",
        "tags": {
            "interests": {"cybersecurity", "solving puzzles", "networks", "investigation"},
            "skills": {"problem solving", "attention to detail", "networking", "linux"},
            "subjects": {"computer science", "physics", "mathematics"},
            "goals": {"help people", "solve challenging problems", "protect systems"},
        },
        "education_keywords": {"cybersecurity", "computer science", "networking", "information technology", "computer engineering"},
        "skills": ["Computer and network fundamentals", "Linux command line", "Security basics", "Clear incident documentation"],
        "roadmap": [
            "Learn operating-system, networking, and web fundamentals.",
            "Practice Linux commands in a safe, personal learning environment.",
            "Study common security principles such as updates and access control.",
            "Use beginner-friendly legal labs and document what you learn.",
            "Build a defensive project, such as a security checklist or log summary.",
        ],
        "projects": ["A personal account-security checklist", "A sample log-file summary script", "A home-network safety guide"],
        "resources": [
            ("Cisco Networking Basics", "https://www.netacad.com/courses/networking-basics"),
            ("OverTheWire: Bandit (beginner wargame)", "https://overthewire.org/wargames/bandit/"),
            ("OWASP Top 10", "https://owasp.org/www-project-top-ten/"),
        ],
    },
    "ui_ux_designer": {
        "title": "UI/UX Designer",
        "icon": "🎨",
        "summary": "Understand people's needs and design digital experiences that are clear and usable.",
        "tags": {
            "interests": {"design", "helping people", "building apps", "research"},
            "skills": {"web design", "communication", "creativity", "attention to detail"},
            "subjects": {"art and design", "psychology", "computer science"},
            "goals": {"help people", "build useful products", "explain ideas clearly"},
        },
        "education_keywords": {"design", "interaction design", "human computer interaction", "psychology", "computer science"},
        "skills": ["User research", "Wireframing and prototyping", "Visual design basics", "Accessibility and usability testing"],
        "roadmap": [
            "Observe a familiar app and note where users may get confused.",
            "Learn basic layout, typography, color, and accessibility principles.",
            "Sketch a few low-fidelity screens for a simple user need.",
            "Create a clickable prototype with a free design tool.",
            "Ask a few people to try it, record feedback, and improve the design.",
        ],
        "projects": ["A clearer campus event sign-up flow", "A student-friendly course planner prototype", "An accessibility review of a familiar website"],
        "resources": [
            ("Figma Learn", "https://help.figma.com/hc/en-us/categories/360002051613-Learn-design"),
            ("Laws of UX", "https://lawsofux.com/"),
            ("W3C Web Accessibility Initiative", "https://www.w3.org/WAI/fundamentals/"),
        ],
    },
}

EDUCATION_LEVELS = ["High school", "Diploma", "Undergraduate", "Postgraduate", "Other / prefer not to say"]
INTERESTS = [
    "coding", "building apps", "solving puzzles", "automation", "artificial intelligence",
    "data and patterns", "experiments", "research", "business", "building websites",
    "design", "cybersecurity", "networks", "investigation", "helping people",
]
SKILLS = [
    "python programming", "problem solving", "debugging", "git and github",
    "mathematics and statistics", "data analysis", "communication", "spreadsheets",
    "web design", "networking", "linux", "creativity", "attention to detail",
]
SUBJECTS = ["computer science", "mathematics", "statistics", "physics", "economics", "business studies", "art and design", "psychology"]
GOALS = [
    "build useful products", "work with technology", "solve challenging problems",
    "help people", "explain ideas clearly", "protect systems",
]

_CATEGORY_WEIGHTS = {
    "interests": 3,
    "skills": 2,
    "subjects": 2,
    "goals": 3,
}


def recommend_careers(interests, skills, subjects, goals, education_details=""):
    """Rank career paths using weighted overlap with the student's selected answers."""
    answers = {
        "interests": set(interests),
        "skills": set(skills),
        "subjects": set(subjects),
        "goals": set(goals),
    }
    results = []

    for career_id, career in CAREERS.items():
        matched = []
        weighted_score = 0.0
        maximum_score = 0.0
        for category, weight in _CATEGORY_WEIGHTS.items():
            selected = answers[category]
            matches = selected & career["tags"][category]
            if selected:
                weighted_score += weight * len(matches) / len(selected)
                maximum_score += weight
            matched.extend(sorted(matches))

        education_text = education_details.casefold()
        education_matches = sorted(
            keyword for keyword in career["education_keywords"]
            if keyword in education_text
        )
        if education_matches:
            weighted_score += 1
            matched.extend(f"education: {keyword}" for keyword in education_matches)
        if education_details.strip():
            maximum_score += 1

        score = round(100 * weighted_score / maximum_score) if maximum_score else 0
        results.append({"career_id": career_id, "score": score, "matched": matched})

    return sorted(results, key=lambda result: result["score"], reverse=True)
