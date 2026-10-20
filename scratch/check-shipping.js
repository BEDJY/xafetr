async function run() {
  const loginRes = await fetch('http://localhost:3000/admin-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(username: "dbedjy@gmail.com", password: "bh123bh.com") { ... on CurrentUser { id } } }`
    })
  });
  const token = loginRes.headers.get('vendure-auth-token');
  const res = await fetch('http://localhost:3000/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `{
        shippingEligibilityCheckers { code args { name type } }
        shippingCalculators { code args { name type } }
        shippingMethods { items { id code name description } }
      }`
    })
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}
run();
