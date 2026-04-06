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
const GUARDIAN_SAME_HOUSEHOLD_KEY = 'guardianSameHousehold';
let substepLabels = ['志願者情報入力', '保護者情報', '志望校アンケート', '出身高等学校情報'];

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
        const value = 20 + ((currentSubStep + 1) / totalSubSteps) * 20;
        progressFill.style.width = value + '%';
    }

    // Update step label
    const stepLabel = document.getElementById('step-label');
    if (stepLabel && substepLabels[currentSubStep]) {
        stepLabel.textContent = substepLabels[currentSubStep];
    }

    window.scrollTo(0, 0);
}

function readGuardianSameHouseholdState() {
    return readStorage(sessionStorage, GUARDIAN_SAME_HOUSEHOLD_KEY) ||
        readStorage(localStorage, GUARDIAN_SAME_HOUSEHOLD_KEY) ||
        '0';
}

function writeGuardianSameHouseholdState(checked) {
    const value = checked ? '1' : '0';
    writeStorage(sessionStorage, GUARDIAN_SAME_HOUSEHOLD_KEY, value);
    writeStorage(localStorage, GUARDIAN_SAME_HOUSEHOLD_KEY, value);
}

function getGuardianSameHouseholdCheckbox() {
    return document.getElementById('guardian-same-household') || document.getElementById('guardian-same-household-en');
}

function getGuardianFields() {
    return Array.from(document.querySelectorAll('[data-guardian-field]'));
}

function getGuardianFieldset() {
    return document.getElementById('guardian-fields-group');
}

function getGuardianNextButton() {
    return document.getElementById('guardian-next-btn');
}

function getGuardianValidationMessage() {
    return document.getElementById('guardian-validation-message');
}

function scrollGuardianNextButtonIntoView() {
    const button = getGuardianNextButton();
    if (!button) return;

    window.requestAnimationFrame(function () {
        button.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        try {
            button.focus({ preventScroll: true });
        } catch (error) {
            button.focus();
        }
    });
}

function areGuardianFieldsComplete() {
    const fields = getGuardianFields();
    if (!fields.length) return true;

    return fields.every(function (field) {
        return field.value.trim() !== '';
    });
}

function setGuardianValidationMessageVisible(visible) {
    const message = getGuardianValidationMessage();
    if (!message) return;

    message.classList.toggle('hidden', !visible);
}

function updateGuardianNextButtonState() {
    const button = getGuardianNextButton();
    if (!button) return;

    const checkbox = getGuardianSameHouseholdCheckbox();
    const canProceed = !!(checkbox && checkbox.checked) || areGuardianFieldsComplete();
    button.disabled = !canProceed;
}

function syncGuardianStepState() {
    const checkbox = getGuardianSameHouseholdCheckbox();
    const fieldset = getGuardianFieldset();
    const isSameHousehold = !!(checkbox && checkbox.checked);

    if (fieldset) {
        fieldset.disabled = isSameHousehold;
        fieldset.classList.toggle('guardian-fields-disabled', isSameHousehold);
    }

    if (isSameHousehold) {
        setGuardianValidationMessageVisible(false);
    }

    updateGuardianNextButtonState();
}

function validateGuardianStep() {
    const checkbox = getGuardianSameHouseholdCheckbox();
    if (!checkbox) return true;

    if (checkbox.checked) {
        setGuardianValidationMessageVisible(false);
        return true;
    }

    const isValid = areGuardianFieldsComplete();
    setGuardianValidationMessageVisible(!isValid);

    if (!isValid) {
        const firstEmptyField = getGuardianFields().find(function (field) {
            return field.value.trim() === '';
        });

        if (firstEmptyField) {
            firstEmptyField.focus();
        }
    }

    return isValid;
}

function setupGuardianStepControls() {
    const checkbox = getGuardianSameHouseholdCheckbox();
    if (!checkbox) return;

    checkbox.checked = readGuardianSameHouseholdState() === '1';

    checkbox.addEventListener('change', function () {
        writeGuardianSameHouseholdState(this.checked);
        syncGuardianStepState();

        if (this.checked) {
            scrollGuardianNextButtonIntoView();
        }
    });

    getGuardianFields().forEach(function (field) {
        field.addEventListener('input', function () {
            if (!checkbox.checked) {
                setGuardianValidationMessageVisible(false);
            }
            updateGuardianNextButtonState();
        });
    });

    syncGuardianStepState();
}

function renderGuardianSameHouseholdConfirm() {
    const checkbox = document.getElementById('guardian-same-household-confirm');
    const isSameHousehold = readGuardianSameHouseholdState() === '1';

    if (checkbox) {
        checkbox.checked = isSameHousehold;
    }

    const skipMessageRow = document.getElementById('guardian-skip-message-row');
    if (skipMessageRow) {
        skipMessageRow.hidden = !isSameHousehold;
    }

    const skipMessageRowEn = document.getElementById('guardian-skip-message-row-en');
    if (skipMessageRowEn) {
        skipMessageRowEn.hidden = !isSameHousehold;
    }

    document.querySelectorAll('.guardian-detail-row').forEach(function (row) {
        row.hidden = isSameHousehold;
    });
}

function nextSubStep() {
    if (currentSubStep === 1 && !validateGuardianStep()) {
        return;
    }

    switchSubStep(currentSubStep + 1);
}

function prevSubStep() {
    switchSubStep(currentSubStep - 1);
}

function submitRegistration() {
    window.location.href = 'register-confirm.html';
}

// --- Uploaded photo persistence ---
const UPLOADED_PHOTO_DB_NAME = 'examApplicationUploads';
const UPLOADED_PHOTO_STORE_NAME = 'photoAssets';
const UPLOADED_PHOTO_KEY = 'uploadedPhoto';
let uploadedPhotoDbPromise = null;
let pendingPhotoSavePromise = Promise.resolve();

function readStorage(storage, key) {
    try {
        return storage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeStorage(storage, key, value) {
    try {
        storage.setItem(key, value);
    } catch (error) {
        // Ignore storage quota/security errors for this mock app.
    }
}

function removeStorage(storage, key) {
    try {
        storage.removeItem(key);
    } catch (error) {
        // Ignore storage quota/security errors for this mock app.
    }
}

function formatUploadedPhotoSize(size) {
    return Math.max(1, Math.round(size / 1024)) + 'KB';
}

function getStoredPhotoMeta() {
    return {
        name: readStorage(sessionStorage, 'uploadedPhotoName') || readStorage(localStorage, 'uploadedPhotoName') || '',
        sizeLabel: readStorage(sessionStorage, 'uploadedPhotoSize') || readStorage(localStorage, 'uploadedPhotoSize') || ''
    };
}

function setStoredPhotoMeta(name, sizeLabel) {
    writeStorage(sessionStorage, 'uploadedPhotoName', name);
    writeStorage(sessionStorage, 'uploadedPhotoSize', sizeLabel);
    writeStorage(localStorage, 'uploadedPhotoName', name);
    writeStorage(localStorage, 'uploadedPhotoSize', sizeLabel);
}

function clearLegacyStoredPhoto() {
    removeStorage(sessionStorage, 'uploadedPhoto');
    removeStorage(sessionStorage, 'uploadedPhotoPreview');
    removeStorage(localStorage, 'uploadedPhoto');
}

async function deleteUploadedPhotoRecord() {
    const db = await openUploadedPhotoDb();
    if (!db) return false;

    return new Promise(function (resolve) {
        const tx = db.transaction(UPLOADED_PHOTO_STORE_NAME, 'readwrite');
        const store = tx.objectStore(UPLOADED_PHOTO_STORE_NAME);
        store.delete(UPLOADED_PHOTO_KEY);

        tx.oncomplete = function () {
            resolve(true);
        };
        tx.onerror = function () {
            resolve(false);
        };
        tx.onabort = function () {
            resolve(false);
        };
    });
}

async function clearStoredUploadedPhoto() {
    clearLegacyStoredPhoto();
    removeStorage(sessionStorage, 'uploadedPhotoName');
    removeStorage(sessionStorage, 'uploadedPhotoSize');
    removeStorage(localStorage, 'uploadedPhotoName');
    removeStorage(localStorage, 'uploadedPhotoSize');
    await deleteUploadedPhotoRecord();
}

function openUploadedPhotoDb() {
    if (uploadedPhotoDbPromise) return uploadedPhotoDbPromise;
    uploadedPhotoDbPromise = new Promise(function (resolve) {
        if (!window.indexedDB) {
            resolve(null);
            return;
        }

        const request = window.indexedDB.open(UPLOADED_PHOTO_DB_NAME, 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(UPLOADED_PHOTO_STORE_NAME)) {
                db.createObjectStore(UPLOADED_PHOTO_STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            resolve(null);
        };
    });

    return uploadedPhotoDbPromise;
}

function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function () {
            reject(reader.error || new Error('Failed to read photo file.'));
        };
        reader.readAsDataURL(file);
    });
}

async function saveUploadedPhotoRecord(file) {
    const db = await openUploadedPhotoDb();
    if (!db) return false;

    return new Promise(function (resolve) {
        const tx = db.transaction(UPLOADED_PHOTO_STORE_NAME, 'readwrite');
        const store = tx.objectStore(UPLOADED_PHOTO_STORE_NAME);
        store.put({
            id: UPLOADED_PHOTO_KEY,
            blob: file,
            name: file.name,
            sizeLabel: formatUploadedPhotoSize(file.size),
            type: file.type,
            updatedAt: Date.now()
        });

        tx.oncomplete = function () {
            resolve(true);
        };
        tx.onerror = function () {
            resolve(false);
        };
        tx.onabort = function () {
            resolve(false);
        };
    });
}

async function getUploadedPhotoRecord() {
    const db = await openUploadedPhotoDb();
    if (!db) return null;

    return new Promise(function (resolve) {
        const tx = db.transaction(UPLOADED_PHOTO_STORE_NAME, 'readonly');
        const store = tx.objectStore(UPLOADED_PHOTO_STORE_NAME);
        const request = store.get(UPLOADED_PHOTO_KEY);

        request.onsuccess = function () {
            resolve(request.result || null);
        };
        request.onerror = function () {
            resolve(null);
        };
    });
}

async function persistUploadedPhoto(file, previewSrc) {
    setStoredPhotoMeta(file.name, formatUploadedPhotoSize(file.size));
    if (previewSrc) {
        writeStorage(sessionStorage, 'uploadedPhotoPreview', previewSrc);
    }

    const storedInDb = await saveUploadedPhotoRecord(file);
    if (storedInDb) {
        removeStorage(sessionStorage, 'uploadedPhoto');
        return true;
    }

    try {
        const dataUrl = previewSrc || await readFileAsDataUrl(file);
        writeStorage(sessionStorage, 'uploadedPhoto', dataUrl);
        return true;
    } catch (error) {
        return false;
    }
}

async function loadStoredUploadedPhoto() {
    const sessionPreview = readStorage(sessionStorage, 'uploadedPhotoPreview');
    if (sessionPreview) {
        const meta = getStoredPhotoMeta();
        return {
            src: sessionPreview,
            revokeObjectUrl: false,
            name: meta.name,
            sizeLabel: meta.sizeLabel
        };
    }

    const record = await getUploadedPhotoRecord();
    if (record && record.blob) {
        return {
            src: URL.createObjectURL(record.blob),
            revokeObjectUrl: true,
            name: record.name || getStoredPhotoMeta().name,
            sizeLabel: record.sizeLabel || getStoredPhotoMeta().sizeLabel
        };
    }

    const legacySrc = readStorage(sessionStorage, 'uploadedPhoto') || readStorage(localStorage, 'uploadedPhoto');
    if (legacySrc) {
        const meta = getStoredPhotoMeta();
        return {
            src: legacySrc,
            revokeObjectUrl: false,
            name: meta.name,
            sizeLabel: meta.sizeLabel
        };
    }

    return null;
}

function updateRenderedPhotoSource(img, holder, src, revokeObjectUrl) {
    if (holder && holder.dataset.objectUrl) {
        URL.revokeObjectURL(holder.dataset.objectUrl);
        delete holder.dataset.objectUrl;
    }

    img.src = src;
    if (holder && revokeObjectUrl) {
        holder.dataset.objectUrl = src;
    }
}

function renderPhotoUploadPreview(preview, src, revokeObjectUrl) {
    if (!preview) return;

    const placeholder = preview.querySelector('.photo-upload-placeholder');
    const image = preview.querySelector('.photo-upload-image');
    if (!image) return;

    image.onerror = function () {
        resetPhotoUploadPreview(preview);
        clearStoredUploadedPhoto();
    };
    if (placeholder) placeholder.hidden = true;
    image.hidden = false;
    updateRenderedPhotoSource(image, preview, src, revokeObjectUrl);
    preview.classList.add('has-image');
}

function resetPhotoUploadPreview(preview) {
    if (!preview) return;

    const placeholder = preview.querySelector('.photo-upload-placeholder');
    const image = preview.querySelector('.photo-upload-image');

    if (placeholder) placeholder.hidden = false;
    if (image) {
        image.hidden = true;
        image.onerror = null;
        image.removeAttribute('src');
    }

    if (preview.dataset.objectUrl) {
        URL.revokeObjectURL(preview.dataset.objectUrl);
        delete preview.dataset.objectUrl;
    }

    preview.classList.remove('has-image');
}

async function renderStoredUploadedPhoto(targetId, fallbackId, options) {
    const target = document.getElementById(targetId);
    if (!target) return false;

    const storedPhoto = await loadStoredUploadedPhoto();

    // No photo uploaded — keep container hidden, nothing to show
    if (!storedPhoto || !storedPhoto.src) return false;

    // Photo exists — un-hide container if it was hidden by default
    target.style.display = '';

    const fallback = fallbackId ? document.getElementById(fallbackId) : null;
    if (fallback) fallback.style.display = 'none';

    let image = target.querySelector('img.stored-upload-photo');
    if (!image) {
        image = document.createElement('img');
        image.className = 'stored-upload-photo';
        target.appendChild(image);
    }

    image.alt = (options && options.alt) || 'アップロード済み写真';
    image.style.cssText =
        'width:100%;height:100%;object-fit:' + (((options && options.objectFit) || 'cover')) +
        ';border-radius:' + (((options && options.borderRadius) || '4px')) + ';';

    updateRenderedPhotoSource(image, target, storedPhoto.src, storedPhoto.revokeObjectUrl);
    return true;
}

function setupRegisterConfirmLink(linkId) {
    const link = document.getElementById(linkId);
    if (!link) return;

    link.addEventListener('click', function (event) {
        const input = document.getElementById('photo-input');
        if (!input || !input.files || !input.files[0]) return;

        event.preventDefault();
        Promise.resolve(pendingPhotoSavePromise).finally(function () {
            window.location.href = link.href;
        });
    });
}

// --- Photo upload preview ---
function setupPhotoUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!input || !preview) return;

    loadStoredUploadedPhoto().then(function (storedPhoto) {
        if (storedPhoto && storedPhoto.src) {
            renderPhotoUploadPreview(preview, storedPhoto.src, storedPhoto.revokeObjectUrl);
        }
    });

    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        if (!file.type || allowedImageTypes.indexOf(file.type) === -1) {
            alert('JPEG、PNG、WebP形式の画像ファイルを選択してください。');
            this.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('顔写真は5MB以内のファイルを選択してください。');
            this.value = '';
            return;
        }

        readFileAsDataUrl(file)
            .then(function (dataUrl) {
                renderPhotoUploadPreview(preview, dataUrl, false);
                pendingPhotoSavePromise = persistUploadedPhoto(file, dataUrl);
            })
            .catch(function () {
                alert('画像ファイルの読み込みに失敗しました。別のファイルをお試しください。');
                input.value = '';
                resetPhotoUploadPreview(preview);
                clearStoredUploadedPhoto();
            });
    });
}

// --- Registration flow tracking ---
// Pages that are part of the registration flow (before final submit)
var REGISTRATION_FLOW_PAGES = [
    'privacy-consent.html',
    'exam-selection.html',
    'register.html'
];

// Pages that are considered "outside" the flow — clear data when landing here
var REGISTRATION_EXIT_PAGES = [
    'index.html',
    'dashboard.html',
    '' // bare root path
];

function getCurrentPageName() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).split('?')[0].split('#')[0];
}

function isRegistrationFlowPage() {
    var page = getCurrentPageName();
    return REGISTRATION_FLOW_PAGES.indexOf(page) !== -1;
}

function isRegistrationExitPage() {
    var page = getCurrentPageName();
    return REGISTRATION_EXIT_PAGES.indexOf(page) !== -1;
}

// Clear all registration form data (photo + any stored state)
function clearRegistrationData() {
    // Clear photo meta from sessionStorage & localStorage
    removeStorage(sessionStorage, 'uploadedPhotoName');
    removeStorage(sessionStorage, 'uploadedPhotoSize');
    removeStorage(sessionStorage, 'uploadedPhotoPreview');
    removeStorage(sessionStorage, 'uploadedPhoto');
    removeStorage(localStorage, 'uploadedPhotoName');
    removeStorage(localStorage, 'uploadedPhotoSize');
    removeStorage(localStorage, 'uploadedPhoto');
    removeStorage(sessionStorage, GUARDIAN_SAME_HOUSEHOLD_KEY);
    removeStorage(localStorage, GUARDIAN_SAME_HOUSEHOLD_KEY);
    // Clear flow flag
    removeStorage(sessionStorage, 'registrationFlowActive');
    // Clear IndexedDB record asynchronously
    deleteUploadedPhotoRecord();
    // Reset in-memory sub-step counter
    currentSubStep = 0;
}

// Mark that we are in the registration flow
function markRegistrationFlowActive() {
    writeStorage(sessionStorage, 'registrationFlowActive', '1');
}

// Hook all [data-clear-registration] links to clear data before navigating
function setupClearRegistrationLinks() {
    var links = document.querySelectorAll('[data-clear-registration]');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            clearRegistrationData();
            // Navigation proceeds normally
        });
    });
}

// --- Gender restriction based on URL param ---
function setupGenderRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isOnlyFemale = urlParams.get('is_only_female') === 'true';
    if (!isOnlyFemale) return;

    const maleRadio = document.getElementById('g-male') || document.getElementById('g-male-en');
    const femaleRadio = document.getElementById('g-female') || document.getElementById('g-female-en');
    if (!maleRadio || !femaleRadio) return;

    // Force select female
    femaleRadio.checked = true;

    // Disable and hide male option
    maleRadio.disabled = true;
    const maleContainer = maleRadio.closest('.radio-item');
    if (maleContainer) {
        maleContainer.style.display = 'none';
    }
}

// --- Foreigner logic ---
function setupForeignerRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isForeigner = urlParams.get('is_foreigner') === 'true';
    if (!isForeigner) return;

    // Applicant Info sections
    const sectionApplicantJp = document.getElementById('section-applicant-jp');
    const sectionApplicantEn = document.getElementById('section-applicant-en');
    
    if (sectionApplicantJp) sectionApplicantJp.style.display = 'none';
    if (sectionApplicantEn) sectionApplicantEn.style.display = 'block';

    // Residence section
    const sectionResidence = document.getElementById('section-residence');
    if (sectionResidence) sectionResidence.style.display = 'block';

    // Address sections
    const sectionContactJp = document.getElementById('section-contact-jp');
    const sectionCurrentAddressEn = document.getElementById('section-current-address-en');
    const sectionHomeAddress = document.getElementById('section-home-address');

    if (sectionContactJp) sectionContactJp.style.display = 'none';
    if (sectionCurrentAddressEn) sectionCurrentAddressEn.style.display = 'block';
    if (sectionHomeAddress) sectionHomeAddress.style.display = 'block';

    // Guardian Info logic
    const sectionGuardian = document.getElementById('section-guardian');
    const sectionGuardianEn = document.getElementById('section-guardian-en');
    if (sectionGuardian) sectionGuardian.style.display = 'none';
    if (sectionGuardianEn) sectionGuardianEn.style.display = 'block';

    // Step 3 logic (High School vs EJU/JLPT)
    const sectionHighschool = document.getElementById('section-highschool');
    const sectionEjuJlpt = document.getElementById('section-eju-jlpt');
    if (sectionHighschool) sectionHighschool.style.display = 'none';
    if (sectionEjuJlpt) sectionEjuJlpt.style.display = 'block';

    // Update global step label for Step 3
    substepLabels[2] = '日本留学試験・日本語能力試験';

    // Update Tab text for Step 3
    const tab3 = document.getElementById('tab-step3');
    if (tab3) tab3.textContent = '日本留学試験・日本語能力試験';
}

function setupJpueRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isJpue = urlParams.get('is_jpue') === 'true';
    if (!isJpue) return;

    // is_jpue is a subset of foreigner, but with some sections hidden
    const sectionApplicantJp = document.getElementById('section-applicant-jp');
    const sectionApplicantEn = document.getElementById('section-applicant-en');
    const sectionResidence = document.getElementById('section-residence');
    const sectionContactJp = document.getElementById('section-contact-jp');
    const sectionCurrentAddressEn = document.getElementById('section-current-address-en');
    const sectionHomeAddress = document.getElementById('section-home-address');
    const sectionGuardian = document.getElementById('section-guardian');
    const sectionGuardianEn = document.getElementById('section-guardian-en');
    const sectionHighschool = document.getElementById('section-highschool');
    const sectionEjuJlpt = document.getElementById('section-eju-jlpt');
    const sectionJpue = document.getElementById('section-jpue');

    if (sectionApplicantJp) sectionApplicantJp.style.display = 'none';
    if (sectionApplicantEn) sectionApplicantEn.style.display = 'block';
    if (sectionResidence) sectionResidence.style.display = 'block';
    
    // EXPLICITLY HIDE for JPUE
    if (sectionContactJp) sectionContactJp.style.display = 'none';
    if (sectionHomeAddress) sectionHomeAddress.style.display = 'none';

    if (sectionCurrentAddressEn) sectionCurrentAddressEn.style.display = 'block';
    
    if (sectionGuardian) sectionGuardian.style.display = 'none';
    if (sectionGuardianEn) sectionGuardianEn.style.display = 'block';

    // Step 3 Content
    if (sectionHighschool) sectionHighschool.style.display = 'none';
    if (sectionEjuJlpt) sectionEjuJlpt.style.display = 'none';
    if (sectionJpue) sectionJpue.style.display = 'block';

    // Update labels
    substepLabels[2] = '日本大学連合学力試験(JPUE)';
    const tab3 = document.getElementById('tab-step3');
    if (tab3) tab3.textContent = '日本大学連合学力試験(JPUE)';
}

function setupGraduateSchoolRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isGrad = urlParams.get('is_graduate_school') === 'true';
    if (!isGrad) return;

    // 1. Labels
    substepLabels[1] = '最終学歴';
    const tab1 = document.getElementById('tab-step1');
    if (tab1) tab1.textContent = '最終学歴';

    // 2. Hide Guardian (both JP and EN)
    const sectionGuardian = document.getElementById('section-guardian');
    const sectionGuardianEn = document.getElementById('section-guardian-en');
    if (sectionGuardian) sectionGuardian.style.display = 'none';
    if (sectionGuardianEn) sectionGuardianEn.style.display = 'none';

    // 3. Show Grad Final Edu & Alumni
    const sectionFinalEduGrad = document.getElementById('section-final-edu-grad');
    const sectionUheAlumni = document.getElementById('section-uhe-alumni');
    const sectionFinalEduAdult = document.getElementById('section-final-edu');

    if (sectionFinalEduAdult) sectionFinalEduAdult.style.display = 'none';
    if (sectionFinalEduGrad) sectionFinalEduGrad.style.display = 'block';
    if (sectionUheAlumni) sectionUheAlumni.style.display = 'block';

    // 4. Hide High School & Exam related (Step 3)
    const sectionHighschool = document.getElementById('section-highschool');
    const sectionEjuJlpt = document.getElementById('section-eju-jlpt');
    const sectionJpue = document.getElementById('section-jpue');
    
    if (sectionHighschool) sectionHighschool.style.display = 'none';
    if (sectionEjuJlpt) sectionEjuJlpt.style.display = 'none';
    if (sectionJpue) sectionJpue.style.display = 'none';

    // Hide Step 3 tab as it's not applicable for Graduate School
    const tab3 = document.getElementById('tab-step3');
    if (tab3) tab3.style.display = 'none';
}

function setupNursingGraduateRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isNursingGrad = urlParams.get('is_nursing_grad') === 'true';
    if (!isNursingGrad) return;

    // 1. Labels
    substepLabels[1] = '出願資格・勤務先等';
    const tab1 = document.getElementById('tab-step1');
    if (tab1) tab1.textContent = '出願資格・勤務先等';

    // 2. Hide Guardian & High School
    const sectionGuardian = document.getElementById('section-guardian');
    const sectionGuardianEn = document.getElementById('section-guardian-en');
    const sectionHighschool = document.getElementById('section-highschool');
    
    if (sectionGuardian) sectionGuardian.style.display = 'none';
    if (sectionGuardianEn) sectionGuardianEn.style.display = 'none';
    if (sectionHighschool) sectionHighschool.style.display = 'none';

    // 3. Show Nursing Grad Sections
    const sectionNursingElig = document.getElementById('section-nursing-eligibility');
    const sectionWorkplace = document.getElementById('section-workplace');
    const sectionSupervisor = document.getElementById('section-supervisor');
    const sectionEligScreening = document.getElementById('section-eligibility-screening');
    const sectionUheAlumni = document.getElementById('section-uhe-alumni');

    if (sectionNursingElig) sectionNursingElig.style.display = 'block';
    if (sectionWorkplace) sectionWorkplace.style.display = 'block';
    if (sectionSupervisor) sectionSupervisor.style.display = 'block';
    if (sectionEligScreening) sectionEligScreening.style.display = 'block';
    if (sectionUheAlumni) sectionUheAlumni.style.display = 'block';

    // 4. Hide Step 3 tab
    const tab3 = document.getElementById('tab-step3');
    if (tab3) tab3.style.display = 'none';
    
    // Hide standard exams
    const sectionEjuJlpt = document.getElementById('section-eju-jlpt');
    const sectionJpue = document.getElementById('section-jpue');
    if (sectionEjuJlpt) sectionEjuJlpt.style.display = 'none';
    if (sectionJpue) sectionJpue.style.display = 'none';
}

// --- Department Transfer logic ---
function setupDepartmentTransferRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDeptTransfer = urlParams.get('is_department_transfer') === 'true';
    if (!isDeptTransfer) return;

    const studentIdRow = document.getElementById('row-student-id');
    if (studentIdRow) {
        studentIdRow.style.display = 'table-row';
    }
}

// --- Adult logic ---
function setupAdultRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdult = urlParams.get('is_adult') === 'true';
    if (!isAdult) return;

    // Change label globally
    substepLabels[1] = '最終学歴';

    // Update Tab
    const tab1 = document.getElementById('tab-step1');
    if (tab1) tab1.textContent = '最終学歴';

    // Toggle Sections
    const sectionGuardian = document.getElementById('section-guardian');
    const sectionFinalEdu = document.getElementById('section-final-edu');
    
    if (sectionGuardian) {
        sectionGuardian.style.display = 'none';
        sectionGuardian.classList.add('hidden'); // Optional if used in CSS
    }
    if (sectionFinalEdu) {
        // If Grad school is active, Grad Final Edu has priority over Adult version
        const isGrad = urlParams.get('is_graduate_school') === 'true';
        if (!isGrad) {
            sectionFinalEdu.style.display = 'block';
            sectionFinalEdu.classList.remove('hidden');
        }
    }
}

// --- Initialize on page load ---
document.addEventListener('DOMContentLoaded', function () {
    // If landing on an exit page and registration was active, clear all data
    if (isRegistrationExitPage()) {
        var wasActive = readStorage(sessionStorage, 'registrationFlowActive');
        if (wasActive) {
            clearRegistrationData();
        }
    }

    // Mark flow as active on registration pages
    if (isRegistrationFlowPage()) {
        markRegistrationFlowActive();
    }

    // Hook exit links
    setupClearRegistrationLinks();
    // Privacy Consent checkbox
    setupCheckboxToggle('agree-checkbox', 'agree-next-btn');

    // Exam Selection radios
    setupRadioToggle('exam-category', 'exam-next-btn');
    setupGuardianStepControls();
    setupGenderRestriction();
    setupDepartmentTransferRestriction();
    setupAdultRestriction();
    setupForeignerRestriction();
    setupJpueRestriction();
    setupGraduateSchoolRestriction();
    setupNursingGraduateRestriction();

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
    setupRegisterConfirmLink('registerConfirmLink');
    renderGuardianSameHouseholdConfirm();
    renderStoredUploadedPhoto('confirmPhotoThumb', 'confirmPhotoFallback', {
        alt: '顔写真',
        borderRadius: '4px'
    });
    renderStoredUploadedPhoto('mypageAvatar', 'mypageAvatarFallback', {
        alt: 'プロフィール写真',
        borderRadius: '9999px'
    });

    // Initialize first tab as active or parse via URL params
    if (tabs.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = parseInt(urlParams.get('step'), 10);
        if (!isNaN(stepParam) && stepParam >= 0 && stepParam < tabs.length) {
            switchSubStep(stepParam);
        } else {
            switchSubStep(currentSubStep);
        }
    }
});
