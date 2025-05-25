const fetch = require('node-fetch');

async function testWisdomAPI() {
  const res = await fetch('http://localhost:8000/search_wisdom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'auto industry', top_k: 3 })
  });
  const data = await res.json();
  console.log('Wisdom API response:', data);
}

testWisdomAPI().catch(console.error);
