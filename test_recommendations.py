"""Small standard-library tests for the career recommendation rules."""

import unittest

from recommendations import CAREERS, recommend_careers


class RecommendationTests(unittest.TestCase):
    def test_ai_answers_rank_ai_ml_first_and_explain_the_match(self):
        results = recommend_careers(
            interests=["artificial intelligence", "data and patterns"],
            skills=["python programming", "mathematics and statistics"],
            subjects=["mathematics", "statistics"],
            goals=["solve challenging problems"],
            education_details="B.Sc. Computer Science",
        )

        self.assertEqual(results[0]["career_id"], "ai_ml_engineer")
        self.assertGreater(results[0]["score"], 0)
        self.assertTrue(any("artificial intelligence" in item for item in results[0]["matched"]))
        self.assertEqual(len(results), len(CAREERS))

    def test_education_background_contributes_to_score(self):
        without_education = recommend_careers([], [], [], [], "")[0]["score"]
        with_education = recommend_careers([], [], [], [], "B.Sc. Computer Science")

        software = next(item for item in with_education if item["career_id"] == "software_developer")
        self.assertGreater(software["score"], without_education)
        self.assertTrue(any(item.startswith("education:") for item in software["matched"]))

    def test_empty_answers_return_all_paths_with_zero_scores(self):
        results = recommend_careers([], [], [], [])

        self.assertEqual(len(results), len(CAREERS))
        self.assertTrue(all(item["score"] == 0 for item in results))

    def test_scores_are_bounded_and_results_are_ranked(self):
        results = recommend_careers(
            interests=["coding", "building apps"],
            skills=["python programming"],
            subjects=["computer science"],
            goals=["build useful products"],
        )
        scores = [item["score"] for item in results]

        self.assertTrue(all(0 <= score <= 100 for score in scores))
        self.assertEqual(scores, sorted(scores, reverse=True))


if __name__ == "__main__":
    unittest.main()
