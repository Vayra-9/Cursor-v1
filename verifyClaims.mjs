import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function verifyClaims() {
    const email = "hello@vayra.digital";
    try {
        const user = await admin.auth().getUserByEmail(email);
        console.log("UID:", user.uid);
        console.log("Custom Claims:", user.customClaims);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

verifyClaims();
