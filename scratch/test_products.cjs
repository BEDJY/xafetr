const testProducts = async () => {
  // Test login first
  const loginRes = await fetch('http://localhost:3000/admin-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          login(username: "dbedjy@gmail.com", password: "bh123bh.com") {
            __typename
            ... on CurrentUser {
              id
              channels { id code token }
            }
          }
        }
      `
    })
  });
  const token = loginRes.headers.get('vendure-auth-token');
  const loginData = await loginRes.json();
  const user = loginData.data.login;
  console.log('Logged in user channels:', user.channels.map(c => c.code));

  // Now test querying products for one of the channels, e.g. demo-deportes or __default_channel__
  const chToken = user.channels[0].token;
  const prodRes = await fetch('http://localhost:3000/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'vendure-token': chToken
    },
    body: JSON.stringify({
      query: `
        query GetProducts($options: ProductListOptions) {
          products(options: $options) {
            totalItems
            items {
              id
              name
              slug
              enabled
            }
          }
        }
      `,
      variables: {
        options: { take: 10, skip: 0 }
      }
    })
  });
  const prodData = await prodRes.json();
  console.log('Products query result:', JSON.stringify(prodData, null, 2));
};

testProducts().catch(console.error);
