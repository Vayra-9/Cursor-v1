const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: "generated_from_env", // Placeholder, not strictly needed for basic auth usually, or we might not have it
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: "generated_from_env",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
};

fs.writeFileSync('serviceAccountKey.json', JSON.stringify(serviceAccount, null, 2));
console.log('serviceAccountKey.json generated successfully.');
