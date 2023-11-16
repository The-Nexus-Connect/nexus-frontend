import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";

export async function fetchLeaderboardsData(contestName) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/contests/codechef/get/allwinners/${contestName}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
}
