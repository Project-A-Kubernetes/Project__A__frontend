const { formatDate, cycleStatus } = require('../dashboard');

// Mocking the global dependencies
global.fetch = jest.fn().mockResolvedValue({
    ok: true, // <--- Add this so your 'if (response.ok)' check passes
    json: () => Promise.resolve({ success: true }),
});
// Fake the UI object that your dashboard.js expects
global.UI = {
    status: { textContent: '' },
    jobList: { innerHTML: '' },
    // Add any other UI elements your code calls (e.g., table, form, etc.)
};

// Fake the document object if your code calls getElementById directly
global.document = {
    getElementById: jest.fn().mockReturnValue({ textContent: '', innerHTML: '' }),
    querySelector: jest.fn().mockReturnValue({ textContent: '', innerHTML: '' }),
};
describe('Helper function tests', () => {

  test('formatDate returns formatted time string', () => {
    const mockDate = "2026-02-09T10:00:00Z";
    const result = formatDate(mockDate);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  // Added 'async' here so we can use 'await'
  test('cycleStatus returns next status correctly', async () => {
    // We use await because cycleStatus returns a Promise
    expect(await cycleStatus(1, 'pending')).toBe('running');
    expect(await cycleStatus(1, 'running')).toBe('completed');
    expect(await cycleStatus(1, 'completed')).toBe('failed');
    expect(await cycleStatus(1, 'failed')).toBe('pending');
  });

});