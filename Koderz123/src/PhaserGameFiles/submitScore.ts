export const submitScore = async (score: number) => {
    try {
      const response = await fetch("https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/update_score.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: `score=${score}`,
      });
  
      const result = await response.json();
      console.log("Score submission result:", result);
    } catch (error) {
      console.error("Score submission failed:", error);
    }
  };
  