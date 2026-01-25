export const calculateEligibility = (student, opportunity) => {
  let score = 0;
  
  // Check CGPA requirement
  if (student.cgpa && opportunity.eligibility.minCGPA) {
    if (parseFloat(student.cgpa) >= parseFloat(opportunity.eligibility.minCGPA)) {
      score++;
    }
  } else if (!opportunity.eligibility.minCGPA) {
    score++; // No CGPA requirement, pass
  }

  // Check skills requirement
  if (opportunity.eligibility.requiredSkills && opportunity.eligibility.requiredSkills.length > 0) {
    const studentSkills = (student.skills || []).map(s => s.toLowerCase().trim());
    const requiredSkills = opportunity.eligibility.requiredSkills.map(s => s.toLowerCase().trim());
    if (requiredSkills.every(s => studentSkills.includes(s))) {
      score++;
    }
  } else {
    score++; // No skills requirement, pass
  }

  // Check income limit requirement (only if specified)
  if (opportunity.eligibility.incomeLimit) {
    if (!student.incomeRange || student.incomeRange <= opportunity.eligibility.incomeLimit) {
      score++;
    }
  } else {
    score++; // No income limit requirement, pass
  }

  const status =
    score === 3 ? "eligible" : score >= 2 ? "partially-eligible" : "not-eligible";

  return { eligibilityStatus: status, matchScore: (score / 3) * 100 };
};
