const { formatDate, cycleStatus } = require('../dashboard');

describe('Helper function tests', () => {

  test('formatDate returns formatted time string', () => {
    const mockDate = "2026-02-09T10:00:00Z";
    const result = formatDate(mockDate);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('cycleStatus returns next status correctly', () => {
    expect(cycleStatus('pending')).toBe('running');
    expect(cycleStatus('running')).toBe('completed');
    expect(cycleStatus('completed')).toBe('failed');
    expect(cycleStatus('failed')).toBe('pending');
  });

});
