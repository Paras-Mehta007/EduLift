export const calculateEligibility = (student, opportunity) => {
  let score = 0;
  if (student.cgpa >= opportunity.eligibility.minCGPA) score++;
  if (opportunity.eligibility.requiredSkills.every(s => student.skills.includes(s))) score++;
  if (student.incomeRange <= opportunity.eligibility.incomeLimit) score++;

  const status =
    score === 3 ? "eligible" : score >= 2 ? "partially-eligible" : "not-eligible";

  return { eligibilityStatus: status, matchScore: (score / 3) * 100 };
};
