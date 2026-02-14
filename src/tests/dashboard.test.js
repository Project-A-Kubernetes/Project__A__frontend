const { formatDate, cycleStatus } = require('../dashboard');

// Mocking the global dependencies
global.updateJobStatus = jest.fn().mockResolvedValue(true);
global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ success: true }),
});

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