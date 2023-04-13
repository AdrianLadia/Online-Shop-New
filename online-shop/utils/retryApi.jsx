const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  
  const retryApi = async (functionToCall, retries = 5) => {
    if (typeof functionToCall !== 'function') {
      throw new Error('Function argument must be callable (e.g. function or lambda)');
    }
  
    let count = 0;
    let maxRetriesReached = false;
  
    while (!maxRetriesReached) {
      count += 1;
  
      try {
        const value = await functionToCall(); // Call the function and capture its return value
        return value; // Return the value
      } catch (e) {
        if (count >= retries) {
          maxRetriesReached = true; // Set the flag to break the loop
          console.error('Max retries reached. API call failed');
        } else {
          // Handle other exceptions
          console.log(`Retrying in 1 second, error: ${e.toString()}`);
          await sleep(1000);
        }
      }
    }
  
    throw new Error('Max retries reached. API call failed');
  };
  
  export default retryApi;
  