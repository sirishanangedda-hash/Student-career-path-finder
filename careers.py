"""Streamlit interface for the Student Career Path Finder."""

import streamlit as st

from recommendations import CAREERS, EDUCATION_LEVELS, INTERESTS, SKILLS, SUBJECTS, GOALS, recommend_careers


st.set_page_config(
    page_title="Student Career Path Finder",
    page_icon="🧭",
    layout="wide",
)

st.markdown(
    """
    <style>
    .stApp { background: #f4f7fb; }
    .hero {
        padding: 1.5rem 1.8rem;
        border-radius: 18px;
        color: white;
        background: linear-gradient(120deg, #12355b, #287c91);
        margin-bottom: 1rem;
    }
    .hero h1 { margin: 0; font-size: 2.15rem; }
    .hero p { margin: .55rem 0 0; color: #e2f5f7; }
    .muted { color: #637286; font-size: .93rem; }
    .score { color: #147d70; font-size: 1.45rem; font-weight: 700; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    """
    <div class="hero">
        <h1>🧭 Student Career Path Finder</h1>
        <p>Explore career ideas, practical skills, and a learning path shaped by your answers.</p>
    </div>
    """,
    unsafe_allow_html=True,
)
st.caption(
    "A transparent, rule-based guide for exploration—not a hiring assessment or a promise of a career outcome."
)

with st.form("student_questionnaire"):
    st.subheader("1. Tell us about yourself")
    name = st.text_input("Your name", placeholder="e.g., Asha")
    col_education, col_course, col_year = st.columns(3)
    with col_education:
        education_level = st.selectbox("Education level", EDUCATION_LEVELS)
    with col_course:
        education_details = st.text_input(
            "Course, major, or education details",
            placeholder="e.g., B.Sc. Computer Science",
        )
    with col_year:
        study_year = st.selectbox(
            "Current year (if applicable)",
            ["Not applicable", "1st year", "2nd year", "3rd year", "4th year", "Graduate"],
        )

    st.subheader("2. What do you enjoy and want to achieve?")
    interests = st.multiselect(
        "Choose interests",
        INTERESTS,
        help="Select all that sound interesting to you.",
    )
    skills = st.multiselect(
        "Choose skills you have tried or want to use",
        SKILLS,
        help="You do not need to be an expert in these skills.",
    )
    subjects = st.multiselect("Favorite subjects", SUBJECTS)
    goals = st.multiselect(
        "Career goals",
        GOALS,
        help="Choose the kind of work or outcome you would like.",
    )
    submitted = st.form_submit_button("Find my career ideas", type="primary", use_container_width=True)

if submitted:
    if not name.strip():
        st.error("Please enter your name to see your career ideas.")
    else:
        st.session_state["student_profile"] = {
            "name": name.strip(),
            "education_level": education_level,
            "education_details": education_details.strip(),
            "study_year": study_year,
            "interests": interests,
            "skills": skills,
            "subjects": subjects,
            "goals": goals,
        }
        st.session_state["career_results"] = recommend_careers(
            interests=interests,
            skills=skills,
            subjects=subjects,
            goals=goals,
            education_details=education_details,
        )

profile = st.session_state.get("student_profile")
results = st.session_state.get("career_results")

if profile and results:
    st.divider()
    st.header(f"Career ideas for {profile['name']}")
    st.markdown(
        f"Based on your **{profile['education_level']}** background"
        + (f" in **{profile['education_details']}**" if profile["education_details"] else "")
        + ". These are starting points to explore, not guaranteed outcomes."
    )

    if not any(item["score"] > 0 for item in results):
        st.info(
            "Your answers did not strongly match the rule set for a specific path. "
            "The paths below are general options to explore; try adding more interests, "
            "skills, subjects, or goals for a more personalized comparison."
        )
    else:
        st.success("Your highest-scoring paths are shown first. Open a card to see which answers contributed.")

    st.subheader("Your top career matches")
    card_columns = st.columns(3)
    for index, result in enumerate(results[:3]):
        career = CAREERS[result["career_id"]]
        with card_columns[index]:
            with st.container(border=True):
                st.markdown(f"### {career['icon']} {career['title']}")
                st.markdown(f'<div class="score">{result["score"]}% match</div>', unsafe_allow_html=True)
                st.write(career["summary"])
                if result["matched"]:
                    st.caption("Why it appeared")
                    st.write(", ".join(result["matched"]))
                else:
                    st.caption("General option: no selected answer matched this path's rules.")

    career_options = [item["career_id"] for item in results]
    selected_career_id = st.selectbox(
        "Choose a career to explore",
        career_options,
        format_func=lambda career_id: CAREERS[career_id]["title"],
    )
    selected_career = CAREERS[selected_career_id]

    left, right = st.columns([1, 1])
    with left:
        st.subheader(f"{selected_career['icon']} {selected_career['title']}")
        st.write(selected_career["summary"])
        st.markdown("**Useful skills to develop**")
        st.write(" · ".join(selected_career["skills"]))
        with st.expander("How this match was calculated"):
            selected_result = next(item for item in results if item["career_id"] == selected_career_id)
            st.write(f"Weighted answer match: **{selected_result['score']}%**")
            st.write(
                "Interests count for 3 points, skills for 2, favorite subjects for 2, "
                "goals for 3, and a relevant course/major for 1. Each category is "
                "normalized by the answers you selected. Education level and study year "
                "are collected for context but do not raise or lower your score."
            )
            st.write(
                "This simple rule-based score only compares your selected answers with "
                "the app's career tags; it is not a probability of success."
            )
    with right:
        st.subheader("Learning roadmap")
        st.caption("Check off steps as you work through them. Your progress is saved for this browser session.")
        checked_steps = 0
        for step_index, step in enumerate(selected_career["roadmap"]):
            if st.checkbox(
                f"{step_index + 1}. {step}",
                key=f"roadmap_{selected_career_id}_{step_index}",
            ):
                checked_steps += 1
        progress = checked_steps / len(selected_career["roadmap"])
        st.progress(progress, text=f"{checked_steps} of {len(selected_career['roadmap'])} steps completed")

    st.subheader("Beginner project ideas")
    project_columns = st.columns(len(selected_career["projects"]))
    for column, project in zip(project_columns, selected_career["projects"]):
        with column:
            with st.container(border=True):
                st.write(f"💡 {project}")

    st.subheader("Free learning resources")
    for resource_name, resource_url in selected_career["resources"]:
        st.markdown(f"- [{resource_name}]({resource_url})")

    st.caption(
        "Your answers are kept in Streamlit's session state for this browser session only; "
        "this starter version does not save personal data to a file or database."
    )
else:
    st.info("Fill in the questionnaire above and select **Find my career ideas** to get started.")
