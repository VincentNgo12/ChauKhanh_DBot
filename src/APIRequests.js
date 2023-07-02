

// get affirmation quotes
async function getAffirmation(){
  try{
    const res = await fetch("https://www.affirmations.dev/")
    const data = await res.json()
    return data["affirmation"]
    
  } catch(error){
    console.log(error)
    return `Error getting quote: ${error}`
  }
  
}


// get Zen quotes
async function getZenQuote() {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    return data[0].q;
  } catch (error) {
    console.log(error);
    return 'Error getting quote.';
  }
}



module.exports = {
  getAffirmation,
  getZenQuote,
}