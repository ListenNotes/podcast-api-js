const { Client } = require('podcast-api');

test('Test search endpoint with mock', () => {
    const client = Client();
    return client.search({
        q: 'elon musk',
    }).then((response) => {
        expect(response.data.count).toBe(10);
    });
});

test('Test search endpoint with authentication error', () => {
    const client = Client({
        apiKey: 'wrong key',
    });
    return client.search({
        q: 'elon musk',
    }).then((response) => {
        fail('It should not have come here!')        
    }).catch((error) => {
        if (error.response) {
            switch (error.response.status) {
              case 401:
                // PASS
                break;
              default:
                fail('It should not have come here!')                  
                break;
            }
          } else {
            fail('It should not have come here!')              
          }        
    });
});
