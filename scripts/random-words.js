// Usage: node scripts/random-words.js
// Returns 3 random English words from randomwordgenerator.com

(async () => {
  const res = await fetch("https://randomwordgenerator.com/json/words_ws.json");
  const { data } = await res.json();
  const pick = () => data[Math.floor(Math.random() * data.length)].word.value;
  console.log(pick());
  console.log(pick());
  console.log(pick());
})();
