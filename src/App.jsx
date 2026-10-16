import { createContext, lazy, Suspense, useContext, useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Award, Bookmark, BookOpen, Check, CheckCircle2,
  ChevronDown, ChevronRight, Clock3, Compass, Heart, Menu, Plus, Search, Settings2,
  ShieldCheck, Sparkles, Target, TrendingUp, Users, X, Zap,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { assessmentOptions, assessmentSteps, careers, categories, DEMO_ANSWERS } from "./careers.js";

const AppContext = createContext(null);
const SkillProgressChart = lazy(() => import("./SkillProgressChart.jsx"));

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => readStorage("pathfinder-profile", {
    name: "Alex Morgan",
    educationLevel: DEMO_ANSWERS.educationLevel,
    stream: DEMO_ANSWERS.stream,
    interests: DEMO_ANSWERS.interests,
    skills: DEMO_ANSWERS.skills,
  }));
  const [savedIds, setSavedIds] = useState(() => readStorage("pathfinder-saved", []));
  const [recentIds, setRecentIds] = useState(() => readStorage("pathfinder-recent", []));
  const [answers, setAnswers] = useState(() => readStorage("pathfinder-answers", {}));
  const [hasAssessment, setHasAssessment] = useState(() => readStorage("pathfinder-has-assessment", false));
  const [history, setHistory] = useState(() => readStorage("pathfinder-history", []));

  useEffect(() => localStorage.setItem("pathfinder-profile", JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem("pathfinder-saved", JSON.stringify(savedIds)), [savedIds]);
  useEffect(() => localStorage.setItem("pathfinder-recent", JSON.stringify(recentIds)), [recentIds]);
  useEffect(() => localStorage.setItem("pathfinder-answers", JSON.stringify(answers)), [answers]);
  useEffect(() => localStorage.setItem("pathfinder-has-assessment", JSON.stringify(hasAssessment)), [hasAssessment]);
  useEffect(() => localStorage.setItem("pathfinder-history", JSON.stringify(history)), [history]);

  const value = {
    profile, setProfile, savedIds, recentIds, answers, setAnswers, hasAssessment, history,
    toggleCareer(id) {
      setSavedIds((current) => current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]);
    },
    removeCareer(id) { setSavedIds((current) => current.filter((savedId) => savedId !== id)); },
    addRecent(id) { setRecentIds((current) => [id, ...current.filter((recentId) => recentId !== id)].slice(0, 5)); },
    completeAssessment(nextAnswers) {
      setAnswers(nextAnswers);
      setHasAssessment(true);
      setHistory((current) => [{ date: new Date().toLocaleDateString(), count: 5 }, ...current].slice(0, 8));
      setProfile((current) => ({
        ...current,
        educationLevel: nextAnswers.educationLevel,
        stream: nextAnswers.stream,
        interests: nextAnswers.interests,
        skills: nextAnswers.skills,
      }));
    },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useApp = () => useContext(AppContext);
const cx = (...values) => values.filter(Boolean).join(" ");

function Icon({ icon: IconComponent, size = 18, ...props }) {
  return <IconComponent size={size} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

function Button({ as: Component = "button", variant = "primary", size = "md", className = "", children, ...props }) {
  return <Component className={cx("button", `button-${variant}`, `button-${size}`, className)} {...props}>{children}</Component>;
}

function Badge({ children, color = "slate" }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

function EmptyState({ icon: IconComponent = Compass, title, description, action }) {
  return <div className="empty-state">
    <div className="empty-icon"><Icon icon={IconComponent} size={25} /></div>
    <h3>{title}</h3><p>{description}</p>{action}
  </div>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
    {action}
  </div>;
}

function scoreCareer(career, answers) {
  const groups = [
    { key: "interests", weight: 30, options: career.interests },
    { key: "skills", weight: 20, options: career.skills },
    { key: "subjects", weight: 15, options: career.subjects },
    { key: "goals", weight: 15, options: career.goals },
  ];
  let totalWeight = 0;
  let earned = 0;
  for (const group of groups) {
    const selected = answers[group.key] || [];
    if (!selected.length) continue;
    const matches = selected.filter((answer) => group.options.some((option) =>
      option.toLowerCase() === answer.toLowerCase()
      || (group.key === "skills" && option.toLowerCase().includes(answer.toLowerCase()))
      || (group.key === "skills" && answer.toLowerCase().includes(option.toLowerCase())),
    )).length;
    totalWeight += group.weight;
    earned += group.weight * matches / selected.length;
  }
  if (answers.stream) {
    totalWeight += 15;
    const matches = career.stream.some((option) =>
      option === "Any stream" || option.toLowerCase() === answers.stream.toLowerCase(),
    );
    if (matches) earned += 15;
  }
  if (answers.educationLevel) {
    totalWeight += 5;
    if (career.education.includes(answers.educationLevel) || career.education.includes("Any level")) earned += 5;
  }
  return totalWeight ? Math.round((earned / totalWeight) * 100) : 0;
}

function rankedCareers(answers) {
  return careers.map((career) => ({ ...career, match: scoreCareer(career, answers) }))
    .sort((first, second) => second.match - first.match);
}

function recommendationAnswers({ answers, hasAssessment, profile }) {
  if (hasAssessment) return answers;
  return {
    ...DEMO_ANSWERS,
    educationLevel: profile.educationLevel,
    stream: profile.stream,
    interests: profile.interests || [],
    skills: profile.skills || [],
  };
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile } = useApp();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const links = [
    ["/", "Home"], ["/explore", "Explore careers"], ["/assessment", "Assessment"],
    ["/dashboard", "Dashboard"], ["/profile", "Profile"],
  ];
  return <header className="navbar-wrap"><nav className="navbar container">
    <Link to="/" className="brand" aria-label="Pathfinder home"><span className="brand-mark"><Compass size={21} /></span><span>pathfinder<span className="brand-dot">.</span></span></Link>
    <div className={cx("nav-links", open && "nav-open")}>
      {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => cx("nav-link", isActive && "nav-active")}>{label}</NavLink>)}
      <Link to="/profile" className="mobile-profile"><span className="avatar">{profile.name.slice(0, 1)}</span><span>{profile.name}</span></Link>
    </div>
    <div className="nav-actions"><Link to="/profile" className="avatar-link" aria-label="Open profile"><span className="avatar">{profile.name.slice(0, 1)}</span></Link><button className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}><Icon icon={open ? X : Menu} size={22} /></button></div>
  </nav></header>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-inner"><Link to="/" className="brand"><span className="brand-mark"><Compass size={19} /></span><span>pathfinder<span className="brand-dot">.</span></span></Link><span>Small steps. Bright futures.</span><span className="footer-note">Career matches are suggestions, not guarantees.</span></div></footer>;
}

function CareerCard({ career, compact = false, selectable = false, selected = false, onSelect }) {
  const { savedIds, toggleCareer, addRecent } = useApp();
  const navigate = useNavigate();
  const saved = savedIds.includes(career.id);
  const view = () => { addRecent(career.id); navigate(`/career/${career.id}`); };
  return <article className={cx("career-card", compact && "career-card-compact", selected && "career-card-selected")}>
    <div className="career-card-top"><span className={`career-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={21} /></span><button className={cx("icon-button", saved && "is-saved")} onClick={() => toggleCareer(career.id)} aria-label={`${saved ? "Remove" : "Save"} ${career.title}`}><Icon icon={saved ? Heart : Bookmark} size={18} fill={saved ? "currentColor" : "none"} /></button></div>
    <div className="card-tags"><Badge color="purple">{career.category}</Badge>{career.match !== undefined && <Badge color="green">{career.match}% match</Badge>}</div>
    <button className="card-title-button" onClick={view}><h3>{career.title}</h3></button>
    <p className="career-description">{career.description}</p>
    <div className="skill-list">{career.skills.slice(0, compact ? 2 : 3).map((skill) => <span key={skill}>{skill}</span>)}</div>
    <div className="card-bottom"><span><strong>{career.salary}</strong>{!compact && <small> estimated USD</small>}</span><button className="text-link" onClick={view}>{compact ? "Details" : "View path"} <ArrowUpRight size={15} /></button></div>
    {selectable && <button className={cx("compare-select", selected && "compare-selected")} onClick={() => onSelect(career.id)}><Icon icon={selected ? Check : Plus} size={15} />{selected ? "Selected to compare" : "Add to compare"}</button>}
  </article>;
}

function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const featured = [careers[0], careers[1], careers[3]];
  const visible = featured.filter((career) => `${career.title} ${career.category} ${career.skills.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  return <main>
    <section className="hero-section"><div className="container hero-grid">
      <div className="hero-copy"><div className="hero-kicker"><span className="sparkle-dot"><Sparkles size={13} /></span> YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>Discover Your<br /><span>Perfect Career</span> Path.</h1>
        <p>Big dreams start with one small question. Find careers that fit the things you love, the skills you have, and the person you want to become.</p>
        <div className="hero-actions"><Button as={Link} to="/assessment">Find My Career <ArrowRight size={17} /></Button><Button as={Link} to="/explore" variant="soft">Explore careers</Button></div>
        <div className="hero-social"><div className="avatar-stack"><span>A</span><span>J</span><span>M</span><span><Users size={14} /></span></div><p><strong>Made for curious minds</strong><br />Your future, your way.</p></div>
      </div>
      <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-blob"><div className="hero-illustration"><div className="ill-sun"></div><div className="ill-hill hill-back"></div><div className="ill-hill hill-front"></div><div className="ill-person"><div className="person-head"></div><div className="person-body"></div><div className="person-laptop"></div></div><div className="ill-star star-a">✦</div><div className="ill-star star-b">✧</div></div></div><div className="float-card float-match"><span className="float-icon"><Target size={18} /></span><div><strong>Your path, personalized</strong><small>Built around you</small></div></div><div className="float-card float-growth"><span className="growth-chart"><TrendingUp size={18} /></span><div><strong>One step at a time</strong><small>Make progress your way</small></div></div></div>
    </div></section>
    <section className="container search-section"><div className="search-card"><div className="search-copy"><h2>Curious about a career?</h2><p>Search roles, skills, or industries and start exploring.</p></div><form className="search-form" onSubmit={(event) => { event.preventDefault(); navigate(`/explore?q=${encodeURIComponent(search)}`); }}><Search size={19} /><input aria-label="Search careers, skills, or industries" placeholder="Try “designer” or “data”" value={search} onChange={(event) => setSearch(event.target.value)} /><Button type="submit" size="sm">Search</Button></form></div></section>
    <section className="container section-block category-section"><SectionHeading eyebrow="ROOM TO GROW" title="Explore what moves you" description="There’s no one-size-fits-all future. Start with a field that feels like you." /><div className="category-grid">{categories.map(({ name, icon, tint }) => <Link to={`/explore?industry=${encodeURIComponent(name)}`} key={name} className={`category-card tint-${tint}`}><span><Icon icon={icon} size={21} /></span><strong>{name}</strong><ArrowUpRight size={15} /></Link>)}</div></section>
    <section className="section-soft"><div className="container section-block"><SectionHeading eyebrow="A FEW PLACES TO START" title="Careers worth a closer look" description="Real options, practical skills, and a path you can take one step at a time." action={<Button as={Link} to="/explore" variant="outline" size="sm">See all careers <ArrowRight size={15} /></Button>} /><div className="career-grid">{visible.length ? visible.map((career) => <CareerCard key={career.id} career={career} />) : <EmptyState icon={Search} title="No featured careers found" description="Try another search, or explore the full career directory." action={<Button as={Link} to="/explore" variant="soft" size="sm">Explore all</Button>} />}</div></div></section>
    <section className="container section-block steps-section"><SectionHeading eyebrow="YOUR JOURNEY, SIMPLIFIED" title="Three steps to get moving" description="You don't need to have it all figured out. Just start with a little curiosity." /><div className="steps-grid">{[
      [Target, "01", "Take your assessment", "Tell us what you enjoy, what you’re good at, and what matters to you.", "step-purple"],
      [Compass, "02", "Explore your matches", "Discover career ideas with clear reasons behind every recommendation.", "step-blue"],
      [Zap, "03", "Build your future", "Turn inspiration into a practical plan, one skill and project at a time.", "step-peach"],
    ].map(([icon, number, title, text, className]) => <div className="step-card" key={number}><div className={`step-icon ${className}`}><Icon icon={icon} size={23} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="container final-cta"><div><span className="eyebrow">YOUR FUTURE IS A JOURNEY</span><h2>Ready to see what fits?</h2><p>A few thoughtful questions can open up a whole new direction.</p></div><Button as={Link} to="/assessment">Start my assessment <ArrowRight size={17} /></Button><div className="cta-spark cta-spark-a">✦</div><div className="cta-spark cta-spark-b">✧</div></section>
  </main>;
}

function ExplorePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [industry, setIndustry] = useState(params.get("industry") || "All industries");
  const [education, setEducation] = useState("Any education");
  const [salary, setSalary] = useState("Any salary");
  const [sort, setSort] = useState("match");
  const [compare, setCompare] = useState([]);
  const app = useApp();
  const { hasAssessment } = app;
  const matchAnswers = recommendationAnswers(app);
  const navigate = useNavigate();
  const filtered = rankedCareers(matchAnswers).filter((career) => {
    const haystack = `${career.title} ${career.category} ${career.description} ${career.skills.join(" ")} ${career.industries.join(" ")}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (industry === "All industries" || career.category === industry)
      && (education === "Any education" || career.education.includes(education) || career.education.includes("Any level"))
      && (salary === "Any salary" || (salary === "$80k+" ? career.salaryValue >= 80 : career.salaryValue < 80));
  }).sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "salary" ? b.salaryValue - a.salaryValue : b.match - a.match);
  const toggleCompare = (id) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  return <main className="page-main container">
    <div className="page-title-row"><div><div className="eyebrow">THE CAREER LIBRARY</div><h1>Explore careers</h1><p>Find a path that sparks your curiosity. Your match scores are starting points, not predictions.</p></div><Button as={Link} to="/assessment"><Sparkles size={16} /> Personalize my matches</Button></div>
    <div className="filter-panel"><label className="search-input"><Search size={18} /><input aria-label="Search career directory" placeholder="Search careers, skills, or industries..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="select-wrap"><span className="sr-only">Industry filter</span><select value={industry} onChange={(event) => setIndustry(event.target.value)}><option>All industries</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={15} /></label><label className="select-wrap"><span className="sr-only">Education filter</span><select value={education} onChange={(event) => setEducation(event.target.value)}><option>Any education</option>{assessmentOptions.educationLevel.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label><label className="select-wrap"><span className="sr-only">Salary filter</span><select value={salary} onChange={(event) => setSalary(event.target.value)}><option>Any salary</option><option>$80k+</option><option>Under $80k</option></select><ChevronDown size={15} /></label><label className="select-wrap sort-select"><span className="sr-only">Sort careers</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Best match</option><option value="name">Career name</option><option value="salary">Highest salary</option></select><ChevronDown size={15} /></label></div>
    <div className="results-line"><span>{filtered.length} career{filtered.length === 1 ? "" : "s"} to explore</span><span>Ranked by {sort === "match" ? "your match" : sort === "name" ? "name" : "salary"}</span></div>
    {filtered.length ? <div className="career-grid">{filtered.map((career) => <CareerCard key={career.id} career={career} selectable selected={compare.includes(career.id)} onSelect={toggleCompare} />)}</div> : <EmptyState icon={Search} title="No careers match those filters" description="Try changing your search or relaxing one of the filters." action={<Button variant="soft" onClick={() => { setQuery(""); setIndustry("All industries"); setEducation("Any education"); setSalary("Any salary"); }}>Clear filters</Button>} />}
    {compare.length > 0 && <div className="compare-bar"><div><strong>{compare.length} career{compare.length > 1 ? "s" : ""} selected</strong><span>{compare.map((id) => careers.find((career) => career.id === id)?.title).join(" · ")}</span></div><div><button className="text-link" onClick={() => setCompare([])}>Clear</button><Button size="sm" disabled={compare.length < 2} onClick={() => navigate(`/compare?ids=${compare.join(",")}`)}>Compare careers <ArrowRight size={15} /></Button></div></div>}
    {!hasAssessment && <p className="notice-line">Match scores use a sample profile until you complete the assessment.</p>}
  </main>;
}

function AssessmentPage() {
  const { answers, setAnswers, completeAssessment } = useApp();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const current = assessmentSteps[step];
  const labels = { educationLevel: "Education level", stream: "Academic stream", subjects: "Favorite subjects", interests: "Interests and hobbies", skills: "Skills", environment: "Preferred work environment", goals: "Career goals", salary: "Salary expectations" };
  const multipleChoice = (field) => ["subjects", "interests", "skills", "environment", "goals"].includes(field);
  const update = (field, value) => { setAnswers((data) => ({ ...data, [field]: value })); setError(""); };
  const toggle = (field, option) => update(field, (answers[field] || []).includes(option) ? answers[field].filter((item) => item !== option) : [...(answers[field] || []), option]);
  const progress = ((step + 1) / assessmentSteps.length) * 100;
  const next = () => {
    if (!current.fields.every((field) => multipleChoice(field) ? (answers[field] || []).length > 0 : Boolean(answers[field]))) {
      setError("Please answer each question on this step before continuing.");
      return;
    }
    if (step < assessmentSteps.length - 1) setStep((value) => value + 1);
    else { completeAssessment(answers); navigate("/results"); }
  };
  return <main className="assessment-page container"><div className="assessment-layout">
    <aside className="assessment-aside"><div className="eyebrow">YOUR CAREER DISCOVERY</div><h1>A path that feels like <span>you.</span></h1><p>There are no wrong answers. This is about exploring possibilities—not making a forever decision.</p><div className="assessment-perks"><div><span><CheckCircle2 size={17} /></span>About 3 minutes</div><div><span><CheckCircle2 size={17} /></span>Personalized suggestions</div><div><span><CheckCircle2 size={17} /></span>Save your progress</div></div><div className="assessment-quote">Keep exploring.<small>Your answers are a starting point, not a final decision.</small></div></aside>
    <section className="assessment-card"><div className="assessment-top"><span>STEP {step + 1} OF {assessmentSteps.length}</span><span>{Math.round(progress)}% complete</span></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><div className="assessment-card-heading"><h2>{current.title}</h2><p>{current.description}</p></div>
      <div className="assessment-fields">{current.fields.map((field) => <fieldset className="question-block" key={field}><legend>{labels[field]} <span>{multipleChoice(field) ? "Choose all that apply" : "Choose one"}</span></legend><div className="option-grid">{assessmentOptions[field].map((option) => {
        const selected = multipleChoice(field) ? (answers[field] || []).includes(option) : answers[field] === option;
        return <button type="button" key={option} className={cx("option-pill", selected && "option-selected")} aria-pressed={selected} onClick={() => multipleChoice(field) ? toggle(field, option) : update(field, option)}>{selected && <Check size={14} />}<span>{option}</span></button>;
      })}</div></fieldset>)}</div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="assessment-footer"><button className="back-step" onClick={() => { if (step > 0) setStep(step - 1); else navigate("/"); }}><ArrowLeft size={16} /> {step === 0 ? "Back home" : "Previous"}</button><Button onClick={next}>{step === assessmentSteps.length - 1 ? "See my matches" : "Continue"} <ArrowRight size={16} /></Button></div>
    </section>
  </div></main>;
}

function ResultsPage() {
  const app = useApp();
  const { hasAssessment, profile } = app;
  const matchAnswers = recommendationAnswers(app);
  const [industry, setIndustry] = useState("All industries");
  const [education, setEducation] = useState("Any education");
  const [salary, setSalary] = useState("Any salary");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const recommendations = rankedCareers(matchAnswers).filter((career) =>
    (industry === "All industries" || career.category === industry)
    && (education === "Any education" || career.education.includes(education) || career.education.includes("Any level"))
    && (salary === "Any salary" || (salary === "$80k+" ? career.salaryValue >= 80 : career.salaryValue < 80)),
  ).slice(0, 5);
  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items);
  return <main className="page-main container"><div className="results-hero"><div><Badge color="purple"><Sparkles size={13} /> YOUR PERSONALIZED RESULTS</Badge><h1>{hasAssessment ? `A few paths for you, ${profile.name.split(" ")[0]}.` : "Here are a few paths to explore."}</h1><p>These suggestions are based on overlap with your answers—not a prediction or a limit on what you can do.</p></div><div className="results-spark"><Sparkles size={34} /></div></div>
    {!hasAssessment && <div className="inline-notice"><span>This preview uses a sample student profile. <Link to="/assessment">Take the assessment</Link> to personalize your results.</span></div>}
    <div className="filter-panel compact-filters"><label className="select-wrap"><span className="sr-only">Filter by industry</span><select value={industry} onChange={(event) => setIndustry(event.target.value)}><option>All industries</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={15} /></label><label className="select-wrap"><span className="sr-only">Filter by education</span><select value={education} onChange={(event) => setEducation(event.target.value)}><option>Any education</option>{assessmentOptions.educationLevel.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label><label className="select-wrap"><span className="sr-only">Filter by salary</span><select value={salary} onChange={(event) => setSalary(event.target.value)}><option>Any salary</option><option>$80k+</option><option>Under $80k</option></select><ChevronDown size={15} /></label><Button as={Link} to="/explore" variant="outline" size="sm">Explore all careers</Button></div>
    <div className="section-heading"><div><div className="eyebrow">{recommendations.length} MATCHES</div><h2>Your career matches</h2><p>Open a path to see its skills, qualifications, and next steps.</p></div></div>
    {recommendations.length ? <div className="career-grid">{recommendations.map((career) => <CareerCard key={career.id} career={career} selectable selected={selected.includes(career.id)} onSelect={toggle} />)}</div> : <EmptyState icon={Search} title="No results for those filters" description="Try a different industry, education level, or salary range." action={<Button variant="soft" onClick={() => { setIndustry("All industries"); setEducation("Any education"); setSalary("Any salary"); }}>Reset filters</Button>} />}
    {selected.length > 0 && <div className="compare-bar"><div><strong>{selected.length} selected to compare</strong><span>Choose at least two careers for a side-by-side view.</span></div><Button size="sm" disabled={selected.length < 2} onClick={() => navigate(`/compare?ids=${selected.join(",")}`)}>Compare <ArrowRight size={15} /></Button></div>}
    <div className="transparency-note"><Sparkles size={17} /><div><strong>How are these matches calculated?</strong><p>We compare interests (30%), skills (20%), favorite subjects (15%), goals (15%), academic stream (15%), and education level (5%) with career tags. Categories you skip are left out of the calculation. Scores describe overlap with this demo catalog—not the likelihood of success.</p></div></div>
  </main>;
}

function CareerDetailPage() {
  const { id } = useParams();
  const career = careers.find((item) => item.id === id);
  const app = useApp();
  const { savedIds, toggleCareer, addRecent } = app;
  const matchAnswers = recommendationAnswers(app);
  useEffect(() => { if (career) addRecent(career.id); }, [career?.id]);
  if (!career) return <main className="page-main container"><EmptyState title="Career not found" description="That career may have moved. Explore the full directory to find another path." action={<Button as={Link} to="/explore">Explore careers</Button>} /></main>;
  const saved = savedIds.includes(career.id);
  return <main className="page-main container detail-page"><Link to="/explore" className="back-link"><ArrowLeft size={16} /> Back to careers</Link><div className="detail-hero"><div><div className="card-tags"><Badge color="purple">{career.category}</Badge><Badge color="green">{scoreCareer(career, matchAnswers)}% match</Badge></div><h1>{career.title}</h1><p>{career.description}</p><Button onClick={() => toggleCareer(career.id)} variant={saved ? "soft" : "primary"}><Icon icon={saved ? Check : Bookmark} size={16} />{saved ? "Saved to your profile" : "Save career"}</Button></div><span className={`career-icon detail-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={38} /></span></div>
    <div className="detail-columns"><div className="detail-main">
      <section className="content-card"><h2>Career overview</h2><p>{career.description} {career.opportunity}</p><div className="detail-stats"><div><small>Estimated USD range</small><strong>{career.salary}</strong></div><div><small>Career category</small><strong>{career.category}</strong></div><div><small>Typical job roles</small><strong>{career.roles.length} common paths</strong></div></div></section>
      <section className="content-card"><h2>Growth roadmap</h2><div className="roadmap-list">{career.roadmap.map((step, index) => <div className="roadmap-item" key={step}><span>{index + 1}</span><p>{step}</p></div>)}</div></section>
      <section className="content-card"><h2>Related courses and certifications</h2><div className="resource-list">{career.courses.map((course) => <a href={course.url} target="_blank" rel="noreferrer" key={course.title}><span className="resource-icon"><BookOpen size={17} /></span><span><strong>{course.title}</strong><small>Learning resource · opens in a new tab</small></span><ArrowUpRight size={15} /></a>)}</div><p className="muted-small">Check course prerequisites and certification requirements before enrolling.</p></section>
    </div><aside className="detail-side">
      <section className="content-card"><h3>Education & qualifications</h3><p>{career.qualifications}</p><div className="tag-group">{career.education.map((item) => <Badge key={item}>{item}</Badge>)}</div></section>
      <section className="content-card"><h3>Essential skills</h3><h4>Technical skills</h4><div className="tag-group">{career.skills.map((item) => <Badge key={item} color="blue">{item}</Badge>)}</div><h4>People skills</h4><div className="tag-group">{career.softSkills.map((item) => <Badge key={item} color="purple">{item}</Badge>)}</div></section>
      <section className="content-card"><h3>Where you could work</h3><div className="role-list">{career.industries.map((item) => <span key={item}><ShieldCheck size={15} />{item}</span>)}</div><h4>Typical roles</h4><div className="role-list">{career.roles.map((item) => <span key={item}><ArrowUpRight size={14} />{item}</span>)}</div></section>
    </aside></div><p className="disclaimer">Salary ranges are illustrative estimates in USD for this demo and vary by location, experience, and employer. Career details are general information, not a promise of employment or qualification.</p>
  </main>;
}

function ComparePage() {
  const params = new URLSearchParams(useLocation().search);
  const app = useApp();
  const matchAnswers = recommendationAnswers(app);
  const selected = (params.get("ids") || "").split(",").filter(Boolean).map((id) => careers.find((career) => career.id === id)).filter(Boolean);
  const rows = [
    ["Match score", (career) => `${scoreCareer(career, matchAnswers)}%`],
    ["Salary range", (career) => career.salary],
    ["Education", (career) => career.education.join(", ")],
    ["Essential skills", (career) => career.skills.join(", ")],
    ["Typical roles", (career) => career.roles.join(", ")],
    ["Growth outlook", (career) => career.opportunity],
  ];
  return <main className="page-main container"><div className="page-title-row"><div><div className="eyebrow">SIDE BY SIDE</div><h1>Compare careers</h1><p>Consider the skills, learning paths, and opportunities that matter to you.</p></div><Button as={Link} to="/explore" variant="outline"><Plus size={16} /> Add careers</Button></div>
    {selected.length < 2 ? <EmptyState icon={Compass} title="Choose at least two careers" description="Add careers to compare from Explore or your recommendation results." action={<Button as={Link} to="/explore">Explore careers</Button>} /> : <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Career</th>{selected.map((career) => <th key={career.id}><span className="compare-name">{career.title}</span><span className="compare-category">{career.category}</span></th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th>{selected.map((career) => <td key={career.id}>{value(career)}</td>)}</tr>)}</tbody></table></div>}
  </main>;
}

function DashboardPage() {
  const app = useApp();
  const { profile, savedIds, recentIds, hasAssessment, history } = app;
  const ranked = rankedCareers(recommendationAnswers(app)).slice(0, 3);
  const saved = savedIds.map((id) => careers.find((career) => career.id === id)).filter(Boolean);
  const recent = recentIds.map((id) => careers.find((career) => career.id === id)).filter(Boolean);
  const chartData = [{ name: "Explore", progress: 18 }, { name: "Learn", progress: 34 }, { name: "Practice", progress: 48 }, { name: "Create", progress: 62 }, { name: "Share", progress: 76 }, { name: "Grow", progress: 92 }];
  return <main className="page-main container dashboard-page"><div className="dashboard-welcome"><div><div className="eyebrow">YOUR PERSONAL SPACE</div><h1>Good morning, {profile.name.split(" ")[0]} <span className="wave">✦</span></h1><p>Every small step you take today can open a new door tomorrow.</p></div><Button as={Link} to="/assessment"><Sparkles size={16} />{hasAssessment ? "Retake assessment" : "Take assessment"}</Button></div>
    <div className="dashboard-grid"><section className="dashboard-main-col">
      <div className="stat-grid"><div className="stat-card"><span className="stat-icon stat-purple"><Target size={19} /></span><span>Assessment progress</span><strong>{hasAssessment ? "100%" : "0%"}</strong><div className="mini-progress"><span style={{ width: hasAssessment ? "100%" : "0%" }} /></div><small>{hasAssessment ? "Your matches are personalized" : "Ready when you are"}</small></div><div className="stat-card"><span className="stat-icon stat-blue"><Bookmark size={19} /></span><span>Saved careers</span><strong>{saved.length}</strong><small>Paths to come back to</small></div><div className="stat-card"><span className="stat-icon stat-orange"><TrendingUp size={19} /></span><span>Profile strength</span><strong>{hasAssessment ? "100%" : "40%"}</strong><div className="mini-progress"><span style={{ width: hasAssessment ? "100%" : "40%" }} /></div></div></div>
      <section className="dashboard-panel"><SectionHeading eyebrow="A GOOD PLACE TO START" title="Recommended for you" description={hasAssessment ? "Based on the interests and strengths you shared." : "A sample preview—take the assessment to make it yours."} action={<Link to="/results" className="text-link">See all <ArrowRight size={14} /></Link>} /><div className="recommendation-list">{ranked.map((career) => <Link to={`/career/${career.id}`} key={career.id} className="recommendation-row"><span className={`career-icon small-career-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={18} /></span><span className="recommendation-info"><strong>{career.title}</strong><small>{career.category} · {career.skills.slice(0, 2).join(", ")}</small></span><span className="match-score">{career.match}%<small>match</small></span><ChevronRight size={17} /></Link>)}</div></section>
      <section className="dashboard-panel chart-panel"><div className="chart-heading"><div><div className="eyebrow">YOUR LEARNING MOMENTUM</div><h2>Skills in motion</h2><p>A gentle reminder: progress looks different for everyone.</p></div><Badge color="green"><TrendingUp size={13} /> Keep going</Badge></div><div className="chart-wrap"><Suspense fallback={<div className="chart-loading" role="status"><span className="spinner" />Loading your chart…</div>}><SkillProgressChart data={chartData} /></Suspense></div><div className="chart-footnote"><span><span className="chart-dot" /> Sample skill-building momentum</span><span>Update your goals anytime</span></div></section>
    </section><aside className="dashboard-side-col"><section className="profile-mini"><div className="profile-mini-top"><span className="avatar avatar-large">{profile.name.slice(0, 1)}</span><span className="status-dot"><Check size={12} /></span></div><h3>{profile.name}</h3><p>{profile.educationLevel} · {profile.stream}</p><div className="profile-tags">{(profile.interests || []).slice(0, 3).map((item) => <Badge key={item} color="purple">{item}</Badge>)}</div><Link to="/profile" className="profile-edit-link">View & edit profile <ArrowRight size={14} /></Link></section>
      <section className="side-panel"><div className="side-panel-heading"><h3>Recently viewed</h3><Clock3 size={16} /></div>{recent.length ? recent.slice(0, 3).map((career) => <Link to={`/career/${career.id}`} className="mini-career-row" key={career.id}><span className={`mini-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={15} /></span><span>{career.title}<small>{career.category}</small></span><ChevronRight size={15} /></Link>) : <p className="small-empty">Careers you view will show up here.</p>}</section>
      <section className="side-panel"><div className="side-panel-heading"><h3>Saved careers</h3><Bookmark size={16} /></div>{saved.length ? saved.slice(0, 3).map((career) => <Link to={`/career/${career.id}`} className="mini-career-row" key={career.id}><span className={`mini-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={15} /></span><span>{career.title}<small>{career.salary}</small></span><ChevronRight size={15} /></Link>) : <div className="saved-empty"><p>Save careers that catch your eye.</p><Button as={Link} to="/explore" variant="soft" size="sm">Explore paths</Button></div>}</section>
      <section className="history-panel"><div className="side-panel-heading"><h3>Assessment history</h3><Award size={16} /></div>{history.length ? history.slice(0, 3).map((item, index) => <div className="history-row" key={`${item.date}-${index}`}><span><CheckCircle2 size={16} /></span><div><strong>Career assessment</strong><small>{item.date} · {item.count} matches</small></div></div>) : <div className="history-empty"><p>Your completed assessments will be saved here.</p><Link to="/assessment">Start your first <ArrowRight size={13} /></Link></div>}</section>
    </aside></div></main>;
}

function ProfilePage() {
  const { profile, setProfile, setAnswers, savedIds, removeCareer, history } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const saved = savedIds.map((id) => careers.find((career) => career.id === id)).filter(Boolean);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    if (form.name.trim()) {
      setProfile(form);
      setAnswers((current) => ({
        ...current,
        educationLevel: form.educationLevel,
        stream: form.stream,
        interests: form.interests,
        skills: form.skills,
      }));
      setEditing(false);
    }
  };
  return <main className="page-main container profile-page"><div className="page-title-row"><div><div className="eyebrow">YOUR PATHFINDER PROFILE</div><h1>Your profile</h1><p>Keep your details current to make your career exploration more personal.</p></div>{!editing && <Button variant="outline" onClick={() => { setForm(profile); setEditing(true); }}><Settings2 size={16} /> Edit profile</Button>}</div>
    <div className="profile-layout"><section className="content-card profile-card">{editing ? <form onSubmit={save}><h2>Edit your details</h2><label className="form-label">Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} /></label><label className="form-label">Education level<select value={form.educationLevel} onChange={(event) => update("educationLevel", event.target.value)}>{assessmentOptions.educationLevel.map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-label">Academic stream<input value={form.stream} onChange={(event) => update("stream", event.target.value)} /></label><label className="form-label">Interests <small>Separate with commas</small><input value={(form.interests || []).join(", ")} onChange={(event) => update("interests", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label><label className="form-label">Skills <small>Separate with commas</small><input value={(form.skills || []).join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label><div className="form-actions"><Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit">Save changes <Check size={15} /></Button></div></form> : <><div className="profile-header"><span className="avatar avatar-profile">{profile.name.slice(0, 1)}</span><div><h2>{profile.name}</h2><p>{profile.educationLevel} · {profile.stream}</p></div></div><div className="profile-detail"><small>Education</small><strong>{profile.educationLevel} in {profile.stream}</strong></div><div className="profile-detail"><small>Interests</small><div className="tag-group">{(profile.interests || []).map((item) => <Badge key={item} color="purple">{item}</Badge>)}</div></div><div className="profile-detail"><small>Skills</small><div className="tag-group">{(profile.skills || []).map((item) => <Badge key={item} color="blue">{item}</Badge>)}</div></div><div className="profile-storage-note"><CheckCircle2 size={17} /><span>Your profile is stored in this browser on your device. Clearing browser data will reset it.</span></div></>}</section>
      <aside className="profile-side"><section className="content-card"><div className="side-panel-heading"><h3>Saved careers <Badge>{saved.length}</Badge></h3><Bookmark size={16} /></div>{saved.length ? <div className="profile-saved-list">{saved.map((career) => <div className="profile-saved-row" key={career.id}><Link to={`/career/${career.id}`}><span className={`mini-icon icon-${career.category.toLowerCase()}`}><Icon icon={career.icon} size={16} /></span><span><strong>{career.title}</strong><small>{career.category} · {career.salary}</small></span></Link><button className="icon-button" aria-label={`Remove ${career.title} from saved careers`} onClick={() => removeCareer(career.id)}><X size={17} /></button></div>)}</div> : <EmptyState icon={Bookmark} title="Nothing saved just yet" description="Save a career that interests you and it’ll be easy to find here." action={<Button as={Link} to="/explore" variant="soft" size="sm">Explore careers</Button>} />}</section>
      <section className="content-card history-card"><div className="side-panel-heading"><h3>Assessment history</h3><Clock3 size={16} /></div>{history.length ? history.map((item, index) => <div className="history-row" key={`${item.date}-${index}`}><span><CheckCircle2 size={16} /></span><div><strong>Career discovery assessment</strong><small>{item.date} · {item.count} suggestions</small></div></div>) : <div className="history-empty"><p>No assessments yet. Complete one to see your history here.</p><Link to="/assessment">Start assessment <ArrowRight size={13} /></Link></div>}</section></aside></div>
  </main>;
}

function NotFound() {
  return <main className="page-main container"><EmptyState icon={Compass} title="This page took a wrong turn" description="The page you’re looking for isn’t here. Let’s find your way back." action={<Button as={Link} to="/">Go home</Button>} /></main>;
}

function AppShell() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);
  return <><Navbar /><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/assessment" element={<AssessmentPage />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/career/:id" element={<CareerDetailPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/compare" element={<ComparePage />} />
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /></>;
}

export default function App() {
  return <AppProvider><AppShell /></AppProvider>;
}
