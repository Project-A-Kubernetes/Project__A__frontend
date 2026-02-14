// STEP 1: Define all global variables BEFORE importing the source code
global.updateJobStatus = jest.fn(); 
global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true }),
});
global.UI = {
    status: { textContent: '' },
    jobList: { innerHTML: '' }
};

const { formatDate, cycleStatus } = require('../dashboard');

// Run your tests
describe('Helper function tests', () => {

  test('formatDate returns formatted time string', () => {
    const mockDate = "2026-02-09T10:00:00Z";
    const result = formatDate(mockDate);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('cycleStatus triggers an update correctly', async () => {
    // Use 'await' because cycleStatus is async
    await cycleStatus(1, 'pending');
    
    // Instead of checking the return value (which might be undefined),
    // we check if it successfully called our fake update function
    expect(global.updateJobStatus).toHaveBeenCalledWith(1, 'running');
  });

});