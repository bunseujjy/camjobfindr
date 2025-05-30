"use server";

export const fetchJob = async () => {
  const url = "http://localhost:3000/job_data.json";
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        // Forward necessary headers
      },
      
      // Important for Next.js server actions
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};