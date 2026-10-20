const test = async () => {
  const mutation = `
    mutation RegisterStore($input: RegisterStoreInput!) {
      registerStore(input: $input) {
        success
        message
      }
    }
  `;
  const res = await fetch('http://localhost:3000/shop-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          storeName: 'Unique Store ' + Date.now(),
          slug: 'unique-slug-' + Date.now(),
          emailAddress: 'dbedjy@gmail.com', // existing email
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    })
  });
  const data = await res.json();
  console.log('Result with existing email:', JSON.stringify(data, null, 2));
};
test();
