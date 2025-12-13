import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function setAdmin() {
    const email = "hello@vayra.digital";

    try {
        const user = await admin.auth().getUserByEmail(email);

        await admin.auth().setCustomUserClaims(user.uid, {
            plan: "pro",
            role: "admin",
            isAdmin: true,
        });

        console.log("✔ Admin claims set for:", email);
    } catch (error) {
        console.error("Error finding user or setting claims:", error);
        process.exit(1);
    }
}

setAdmin().catch((err) => {
    console.error("Error setting admin claims:", err);
});
