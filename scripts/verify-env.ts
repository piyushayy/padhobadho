
import dotenv from 'dotenv';
dotenv.config();

console.log("Checking Environment Variables...");

const keys = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "AUTH_SECRET",
    "DATABASE_URL",
    "NEXTAUTH_URL" // Optional usually with v5 but good to check
];

keys.forEach(key => {
    const value = process.env[key];
    if (value) {
        console.log(`✅ ${key}: Loaded (${value.substring(0, 5)}...)`);
    } else {
        console.log(`❌ ${key}: NOT FOUND`);
    }
});

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("\nERROR: Google Client ID or Secret is missing. The 'Configuration' error is caused by this.");
} else {
    console.log("\nVariables seem present. If error persists, check if they are valid.");
}
