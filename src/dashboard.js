// 1. Configuration
const API_BASE_URL =
  typeof window !== 'undefined' && window.APP_CONFIG?.API_BASE_URL
    ? window.APP_CONFIG.API_BASE_URL
    : 'http://127.0.0.1:8000';

let UI; // declare only

if (typeof window !== 'undefined') {
  UI = {
    list: document.getElementById('job-list'),
    table: document.getElementById('job-table'),
    loading: document.getElementById('loading'),
    status: document.getElementById('connection-status'),
    modal: document.getElementById('job-modal'),
    nameInput: document.getElementById('job-name-input'),
    deleteSelectedBtn: document.getElementById('delete-selected-btn')
  };

  // browser-only logic continues here
}


// 2. Helpers
const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    const date = new Date(isoStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const toggleModal = (show) => {
    if (show) UI.modal.classList.remove('hidden');
    else {
        UI.modal.classList.add('hidden');
        UI.nameInput.value = ''; // Clear input on close
    }
};

// 3. Logic - UI Rendering
function renderJobs(jobs) {
    if (!UI.table || !UI.list) return;
    UI.table.classList.remove('hidden');
    
    UI.list.innerHTML = jobs.map(job => `
        <tr>
            <td><input type="checkbox" class="job-checkbox" value="${job.id}" onclick="toggleDeleteButton()"></td>
            
            <td>${escapeHtml(job.name)}</td>
            
            <td>
                <span class="badge ${job.status.toLowerCase()}" 
                    style="cursor: pointer;" 
                    data-id="${job.id}"
                    data-status="${job.status}">
                    ${job.status}
                </span>

            </td>
            
            <td>${formatDate(job.created_at)}</td>
            
            <td>${formatDate(job.updated_at)}</td>
            
            <td>
                <button class="btn-icon-danger" onclick="deleteJob('${job.id}')" title="Delete Job">🗑️</button>
            </td>
        </tr>
    `).join('');
    document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('click', () => {
        const jobId = badge.dataset.id;
        const currentStatus = badge.dataset.status;
        cycleStatus(jobId, currentStatus);
    });
    });

    
    toggleDeleteButton(); 
}

function selectAllJobs(source) {
    const checkboxes = document.querySelectorAll('.job-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    toggleDeleteButton();
}

function toggleDeleteButton() {
    const anyChecked = document.querySelectorAll('.job-checkbox:checked').length > 0;
    if (anyChecked) UI.deleteSelectedBtn.classList.remove('hidden');
    else UI.deleteSelectedBtn.classList.add('hidden');
}

// 4. API Calls
async function fetchJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        if (!response.ok) throw new Error(`Server error`);
        const data = await response.json();
        renderJobs(data);
        UI.status.textContent = "Connected";
        UI.status.className = "status-indicator status-ok";
    } catch (_err) {
        UI.status.textContent = "Disconnected";
        UI.status.className = "status-indicator status-error";
    }
}

async function createJob() {
    const name = UI.nameInput.value;
    if (!name) return alert("Name is required");

    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        
        if (response.ok) {
            toggleModal(false);
            fetchJobs(); 
        }
    } catch (err) {
        alert("Failed to connect to backend");
    }
}

async function updateJobStatus(jobId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) fetchJobs();
        else console.error("Status update failed");
    } catch (err) {
        console.error("Update error:", err);
    }
}


function cycleStatus(jobId, currentStatus) {
    const statuses = ['pending', 'running', 'completed', 'failed'];
    const index = statuses.indexOf(currentStatus.toLowerCase());
    const nextStatus = statuses[(index + 1) % statuses.length];
    updateJobStatus(jobId, nextStatus);

}




async function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        if (response.ok) fetchJobs();
    } catch (err) { console.error("Delete error:", err); }
}

async function deleteSelectedJobs() {
    const selectedIds = Array.from(document.querySelectorAll('.job-checkbox:checked'))
                             .map(cb => cb.value);
    
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected jobs?`)) return;

    await Promise.all(selectedIds.map(id => 
        fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' })
    ));
    fetchJobs();
}

// 5. Init
if (typeof window !== 'undefined') {
  // UI init
  document.getElementById('open-modal-btn').onclick = () => toggleModal(true);
  document.getElementById('close-modal-btn').onclick = () => toggleModal(false);
  document.getElementById('submit-job-btn').onclick = createJob;
  UI.deleteSelectedBtn.onclick = deleteSelectedJobs;

  window.addEventListener('DOMContentLoaded', fetchJobs);
} 

//unit testing
if (typeof module !== 'undefined') {
  module.exports = { formatDate, cycleStatus , escapeHtml};
}