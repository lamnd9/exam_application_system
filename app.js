// ===== App.js — Shared logic for all pages =====

// --- Password toggle (Login page) ---
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// --- Checkbox → enable/disable button (Privacy Consent page) ---
function setupCheckboxToggle(checkboxId, buttonId) {
  const checkbox = document.getElementById(checkboxId);
  const button = document.getElementById(buttonId);
  if (!checkbox || !button) return;
  
  function update() {
    button.disabled = !checkbox.checked;
  }
  checkbox.addEventListener('change', update);
  update();
}

// --- Radio → enable/disable button (Exam Selection page) ---
function setupRadioToggle(radioName, buttonId) {
  const radios = document.querySelectorAll(`input[name="${radioName}"]`);
  const button = document.getElementById(buttonId);
  if (!radios.length || !button) return;

  function update() {
    const selected = document.querySelector(`input[name="${radioName}"]:checked`);
    button.disabled = !selected;
  }
  radios.forEach(radio => radio.addEventListener('change', update));
  update();
}

// --- Multi-step tabs (Register page) ---
let currentSubStep = 0;
const totalSubSteps = 4;

function switchSubStep(index) {
  if (index < 0 || index >= totalSubSteps) return;
  currentSubStep = index;

  // Update tabs
  document.querySelectorAll('.substep-tab').forEach((tab, i) => {
    tab.classList.remove('active', 'completed');
    if (i === currentSubStep) {
      tab.classList.add('active');
    } else if (i < currentSubStep) {
      tab.classList.add('completed');
    }
  });

  // Update content
  document.querySelectorAll('.substep-content').forEach((content, i) => {
    content.classList.toggle('active', i === currentSubStep);
  });

  // Update progress
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    const value = 33 + ((currentSubStep + 1) / totalSubSteps) * 34;
    progressFill.style.width = value + '%';
  }

  // Update step label
  const stepLabel = document.getElementById('step-label');
  const labels = ['志願者情報入力', '保護者情報', '志望校アンケート', '出身高等学校情報'];
  if (stepLabel && labels[currentSubStep]) {
    stepLabel.textContent = labels[currentSubStep];
  }

  window.scrollTo(0, 0);
}

function nextSubStep() {
  switchSubStep(currentSubStep + 1);
}

function prevSubStep() {
  switchSubStep(currentSubStep - 1);
}

// --- Photo upload preview ---
function setupPhotoUpload(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// --- Initialize on page load ---
document.addEventListener('DOMContentLoaded', function () {
  // Privacy Consent checkbox
  setupCheckboxToggle('agree-checkbox', 'agree-next-btn');

  // Exam Selection radios
  setupRadioToggle('exam-category', 'exam-next-btn');

  // Register page tabs
  const tabs = document.querySelectorAll('.substep-tab');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i <= currentSubStep) {
        switchSubStep(i);
      }
    });
  });

  // Photo upload
  setupPhotoUpload('photo-input', 'photo-preview');

  // Initialize first tab as active
  if (tabs.length > 0) {
    switchSubStep(0);
  }
});
