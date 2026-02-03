
async function check() {
    try {
        const res = await fetch('http://localhost:3000/api/test-db');
        // Handle non-200 responses specifically
        if (!res.ok) {
            const text = await res.text();
            console.log(`Status: ${res.status}`);
            console.log("Response:", text);
            return;
        }
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}

check();
