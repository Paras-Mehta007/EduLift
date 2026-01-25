import axios from "./axios";

// Get all recruiters (NGOs)
export const getAllRecruiters = async () => {
  try {
    const response = await axios.get("/recruiter/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    throw error;
  }
};

// Get recruiter dashboard stats
export const getRecruiterDashboard = async () => {
  try {
    const response = await axios.get("/recruiter/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching recruiter dashboard:", error);
    throw error;
  }
};

// Create recruiter profile
export const createRecruiterProfile = async (data) => {
  try {
    const response = await axios.post("/recruiter/profile", data);
    return response.data;
  } catch (error) {
    console.error("Error creating recruiter profile:", error);
    throw error;
  }
};

// Get recruiter profile
export const getRecruiterProfile = async () => {
  try {
    const response = await axios.get("/recruiter/profile/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    throw error;
  }
};

// Update recruiter profile
export const updateRecruiterProfile = async (data) => {
  try {
    const response = await axios.patch("/recruiter/profile/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating recruiter profile:", error);
    throw error;
  }
};

