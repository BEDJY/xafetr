async function testQueries() {
  const loginRes = await fetch('http://localhost:3000/admin-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(username: "dbedjy@gmail.com", password: "bh123bh.com") { ... on CurrentUser { id } } }`
    })
  });
  const token = loginRes.headers.get('vendure-auth-token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const queries = [
    { name: 'roles', query: '{ roles { items { id code description } } }' },
    { name: 'customerGroups', query: '{ customerGroups { items { id name } } }' },
    { name: 'stockLocations', query: '{ stockLocations { items { id name } } }' },
    { name: 'taxCategories', query: '{ taxCategories { items { id name } } }' },
    { name: 'taxRates', query: '{ taxRates { items { id name value } } }' },
    { name: 'zones', query: '{ zones { items { id name } } }' },
    { name: 'countries', query: '{ countries(options: { take: 5 }) { items { id name code enabled } } }' },
    { name: 'sellers', query: '{ sellers { items { id name } } }' },
  ];

  for (const q of queries) {
    const res = await fetch('http://localhost:3000/admin-api', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: q.query })
    });
    const json = await res.json();
    console.log(`[${q.name}]:`, json.data ? 'OK: ' + JSON.stringify(json.data) : 'ERROR: ' + JSON.stringify(json.errors));
  }
}

testQueries();
