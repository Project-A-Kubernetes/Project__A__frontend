

const {
  formatDate,
  escapeHtml,
  cycleStatus,
  toggleDeleteButton,
  selectAllJobs
} = require('../src/dashboard');

// ---------- Helpers ----------

beforeEach(() => {
  document.body.innerHTML = `
    <button id="delete-selected-btn" class="hidden"></button>
    <input type="checkbox" class="job-checkbox" value="1" />
    <input type="checkbox" class="job-checkbox" value="2" />
  `;
});

// ---------- Tests ----------

// Test 1: Date Formatting
test('formatDate should return a formatted time string', () => {
  const mockDate = '2026-02-09T10:00:00Z';
  const result = formatDate(mockDate);

  expect(typeof result).toBe('string');
  expect(result.length).toBeGreaterThan(0);
});

// Test 2: HTML Escaping
test('escapeHtml should escape HTML content', () => {
  const unsafe = '<script>alert("xss")</script>';
  const escaped = escapeHtml(unsafe);

  expect(escaped).not.toContain('<script>');
  expect(escaped).toContain('&lt;script&gt;');
});

// Test 3: cycleStatus logic (mocking API call)
test('cycleStatus should call update with next status', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true })
  );

  // spy on fetch calls
  cycleStatus('123', 'pending');

  expect(fetch).toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toContain('status=running');
});

// Test 4: toggleDeleteButton shows button when checkbox selected
test('toggleDeleteButton shows delete button when any checkbox is checked', () => {
  const checkboxes = document.querySelectorAll('.job-checkbox');
  const deleteBtn = document.getElementById('delete-selected-btn');

  checkboxes[0].checked = true;
  toggleDeleteButton();

  expect(deleteBtn.classList.contains('hidden')).toBe(false);
});

// Test 5: selectAllJobs checks all job checkboxes
test('selectAllJobs should select all job checkboxes', () => {
  const masterCheckbox = { checked: true };
  const checkboxes = document.querySelectorAll('.job-checkbox');

  selectAllJobs(masterCheckbox);

  checkboxes.forEach(cb => {
    expect(cb.checked).toBe(true);
  });
});
