const https = require('https');

const data = JSON.stringify({
    email: 'hello@vayra.digital'
});

const options = {
    hostname: 'cursor-v1.vercel.app',
    port: 443,
    path: '/api/admin/setup-user',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
