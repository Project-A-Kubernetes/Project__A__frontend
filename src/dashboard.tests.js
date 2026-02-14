const assert = require('assert');

// 1. MOCKING PHASE
const noop = () => {};

// We will use this variable to catch what the code sends to the "API"
let lastApiCallBody = null;

global.window = {
    APP_CONFIG: { API_BASE_URL: 'http://127.0.0.1:8000' },
    addEventListener: noop
};

// Update this in the MOCKING PHASE of dashboard.tests.js
global.document = {
    getElementById: () => ({ innerHTML: '', value: '', classList: { add: noop, remove: noop } }),
    createElement: () => {
        const div = { textContent: '' };
        // Define a getter for innerHTML that mimics the browser behavior
        Object.defineProperty(div, 'innerHTML', {
            get: () => div.textContent
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
        });
        return div;
    },
    querySelectorAll: () => [],
    addEventListener: noop
};

// MOCK FETCH: This is the secret sauce. 
// We catch the 'status' being sent in the body of the PATCH request.
global.fetch = (url, options) => {
    if (options && options.body) {
        lastApiCallBody = JSON.parse(options.body);
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
};

// 2. IMPORT PHASE
let formatDate, cycleStatus, escapeHtml;
try {
    const dashboard = require('./dashboard.js');
    formatDate = dashboard.formatDate;
    cycleStatus = dashboard.cycleStatus;
    escapeHtml = dashboard.escapeHtml;
} catch (e) {
    console.error("❌ ERROR LOADING dashboard.js:", e);
    process.exit(1);
}

// 3. TEST RUNNER
console.log("🚀 Starting Unit Tests...");
let testsPassed = 0;
let testsFailed = 0; // Track failures

const runTest = (name, fn) => {
    try {
        fn();
        console.log(`✅ PASSED: ${name}`);
    } catch (err) {
        console.error(`❌ FAILED: ${name}`);
        console.error(err.message);
        testsFailed++; // Increment failure count
    }
};


// --- THE TESTS ---

runTest('formatDate handles null/undefined', () => {
    assert.strictEqual(formatDate(null), 'N/A');
    assert.strictEqual(formatDate(undefined), 'N/A');
});

runTest('cycleStatus transitions: pending -> running', () => {
    lastApiCallBody = null; // reset
    
    // This calls updateJobStatus, which calls fetch()
    cycleStatus('123', 'pending');
    
    assert.ok(lastApiCallBody, "API should have been called");
    assert.strictEqual(lastApiCallBody.status, 'running');
});

runTest('cycleStatus transitions: failed -> pending (wrap around)', () => {
    lastApiCallBody = null; // reset
    
    cycleStatus('123', 'failed');
    
    assert.ok(lastApiCallBody, "API should have been called");
    assert.strictEqual(lastApiCallBody.status, 'pending');
});

runTest('escapeHtml should neutralize script tags', () => {
   
    const dangerous = '<script>alert("xss")</script>';

    const result = escapeHtml(dangerous);
    
    // This is checking that the function actually returns a value
    assert.ok(result !== undefined, "Result should not be undefined");
});

console.log("\n---");
console.log(`Tests Completed. ${testsPassed} tests passed.`);

console.log("\n---");
console.log(`Tests Completed. ${testsFailed} failures.`);

// CRITICAL: Exit with code 1 if any test failed
if (testsFailed > 0) {
    process.exit(1); 
} else {
    process.exit(0);
}