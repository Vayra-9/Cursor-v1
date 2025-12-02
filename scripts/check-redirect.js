const http = require('http');

http.get('http://localhost:3000/dashboard', (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log('Redirect to:', res.headers.location);
    }
}).on('error', (e) => {
    console.error(e);
});
