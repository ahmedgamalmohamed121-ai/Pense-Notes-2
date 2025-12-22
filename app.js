// ==================== App State ====================
let notes = [];
let currentCategory = 'all';
let currentNoteId = null;
let notificationPermission = false;
let currentLang = localStorage.getItem('pense_lang') || 'ar';
let nickname = localStorage.getItem('pense_nickname') || '';
let gender = localStorage.getItem('pense_gender') || 'male';
let apiKey = '';

// Capacitor Support
const isCapacitor = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
const CapacitorPlugins = isCapacitor ? Capacitor.Plugins : null;


const translations = {
    ar: {
        appTitle: 'Pensè',
        searchPlaceholder: 'ابحث في ملاحظاتك...',
        categories: 'الفئات',
        allNotes: 'الكل',
        personal: 'شخصي',
        work: 'عمل',
        study: 'دراسة',
        health: 'صحة',
        shopping: 'تسوق',
        other: 'أخرى',
        islamicCorner: 'الركن الإسلامي',
        backup: 'نسخ احتياطي',
        sortNewest: 'الأحدث أولاً',
        sortOldest: 'الأقدم أولاً',
        sortTitle: 'حسب العنوان',
        sortReminder: 'حسب التذكير',
        emptyTitle: 'لا توجد ملاحظات بعد',
        emptySub: 'ابدأ بإنشاء ملاحظتك الأولى!',
        tasbihTab: 'السبحة',
        adhkarTab: 'الأذكار',
        prayerTab: 'مواقيت الصلاة',
        tasbihTarget: 'الهدف: 33',
        tasbihBtn: 'سبّح',
        resetBtn: 'إعادة ضبط',
        adhanToggle: 'تفعيل التنبيهات الصوتية',
        settingsTitle: 'الإعدادات',
        notifications: 'الإشعارات',
        autoBackup: 'النسخ الاحتياطي التلقائي',
        sound: 'الصوت',
        clearAll: 'حذف جميع الملاحظات',
        export: 'تصدير البيانات',
        import: 'استيراد البيانات',
        deleteConfirm: 'هل أنت متأكد من حذف هذه الملاحظة؟',
        clearAllConfirm: 'هل أنت متأكد من حذف جميع الملاحظات؟ لا يمكن التراجع عن هذا الإجراء!',
        clearAllFinal: 'تأكيد نهائي: سيتم حذف جميع ملاحظاتك!',
        deleteToast: 'تم حذف الملاحظة',
        clearAllToast: 'تم حذف جميع الملاحظات'
    },
    en: {
        appTitle: 'Pensè',
        searchPlaceholder: 'Search your notes...',
        categories: 'Categories',
        allNotes: 'All',
        personal: 'Personal',
        work: 'Work',
        study: 'Study',
        health: 'Health',
        shopping: 'Shopping',
        other: 'Other',
        islamicCorner: 'Islamic Corner',
        backup: 'Backup',
        sortNewest: 'Newest First',
        sortOldest: 'Oldest First',
        sortTitle: 'By Title',
        sortReminder: 'By Reminder',
        emptyTitle: 'No notes yet',
        emptySub: 'Start by creating your first note!',
        tasbihTab: 'Tasbih',
        adhkarTab: 'Adhkar',
        prayerTab: 'Prayer Times',
        tasbihTarget: 'Target: 33',
        tasbihBtn: 'Praise',
        resetBtn: 'Reset',
        adhanToggle: 'Voice Notifications',
        settingsTitle: 'Settings',
        notifications: 'Notifications',
        autoBackup: 'Auto Backup',
        sound: 'Sound',
        clearAll: 'Clear All Notes',
        export: 'Export Data',
        import: 'Import Data',
        deleteConfirm: 'Are you sure you want to delete this note?',
        clearAllConfirm: 'Are you sure you want to delete all notes? This action cannot be undone!',
        clearAllFinal: 'Final confirmation: All your notes will be deleted!',
        deleteToast: 'Note deleted',
        clearAllToast: 'All notes deleted'
    }
};

// ==================== DOM Elements ====================
const elements = {
    // Header
    appTitle: document.querySelector('.app-title'),
    langToggle: document.getElementById('langToggle'),
    langLabel: document.getElementById('langLabel'),
    searchToggle: document.getElementById('searchToggle'),
    searchContainer: document.getElementById('searchContainer'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    themeToggle: document.getElementById('themeToggle'),
    settingsBtn: document.getElementById('settingsBtn'),

    // Sidebar
    sidebarTitle: document.querySelector('.sidebar-header h2'),
    categoryButtons: document.querySelectorAll('.category-btn'),
    backupBtn: document.getElementById('backupBtn'),

    // Notes Area
    notesArea: document.querySelector('.notes-area'),
    categoryTitle: document.getElementById('categoryTitle'),
    sortSelect: document.getElementById('sortSelect'),
    emptyState: document.getElementById('emptyState'),
    emptyTitle: document.querySelector('.empty-state h3'),
    emptySub: document.querySelector('.empty-state p'),
    notesGrid: document.getElementById('notesGrid'),

    // FAB
    addNoteBtn: document.getElementById('addNoteBtn'),

    // Note Modal
    noteModal: document.getElementById('noteModal'),
    modalTitle: document.getElementById('modalTitle'),
    closeModal: document.getElementById('closeModal'),
    noteForm: document.getElementById('noteForm'),
    noteTitle: document.getElementById('noteTitle'),
    noteContent: document.getElementById('noteContent'),
    noteCategory: document.getElementById('noteCategory'),
    hasReminder: document.getElementById('hasReminder'),
    reminderSection: document.getElementById('reminderSection'),
    reminderDate: document.getElementById('reminderDate'),
    reminderTime: document.getElementById('reminderTime'),
    cancelBtn: document.getElementById('cancelBtn'),
    saveBtn: document.getElementById('saveBtn'),

    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    settingsTitle: document.querySelector('.modal-small h2'),
    closeSettings: document.getElementById('closeSettings'),
    notificationsToggle: document.getElementById('notificationsToggle'),
    autoBackupToggle: document.getElementById('autoBackupToggle'),
    soundToggle: document.getElementById('soundToggle'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFile: document.getElementById('importFile'),
    nicknameInput: document.getElementById('nicknameInput'),
    saveNicknameBtn: document.getElementById('saveNicknameBtn'),
    resetNicknameBtn: document.getElementById('resetNicknameBtn'),
    testNotificationBtn: document.getElementById('testNotificationBtn'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),

    // Religious Hub
    religiousHub: document.getElementById('religiousHub'),
    backToMainBtn: document.getElementById('backToMainBtn'),
    hubTabs: document.querySelectorAll('.hub-tab'),
    hubContents: document.querySelectorAll('.hub-content'),
    tasbihCounter: document.getElementById('tasbihCounter'),

    // Tasbih
    tasbihTarget: document.getElementById('tasbihTarget'),
    tasbihBtn: document.getElementById('tasbihBtn'),
    resetTasbih: document.getElementById('resetTasbih'),
    adhanLabel: document.querySelector('#prayer-times-section .control-label'),

    // Adhkar
    adhkarCats: document.querySelectorAll('.adhkar-cat'),
    adhkarList: document.getElementById('adhkarList'),
    adhkarListContainer: document.getElementById('adhkarListContainer'),
    focusedAdkar: document.getElementById('focusedAdkar'),
    focusedText: document.getElementById('focusedText'),
    focusedCounterBtn: document.getElementById('focusedCounterBtn'),
    focusedInfo: document.getElementById('focusedInfo'),
    backToAdhkarList: document.getElementById('backToAdhkarList'),

    // Prayer Times
    prayerTimesGrid: document.getElementById('prayerTimesGrid'),
    currentHijriDate: document.getElementById('currentHijriDate'),
    nextPrayerMessage: document.getElementById('nextPrayerMessage'),
    prayerAdhanToggle: document.getElementById('prayerAdhanToggle')
};

// ==================== Religious Data ====================
let tasbihCount = 0;
let prayerTimes = {};
let lastNotifiedPrayer = '';
let lastPreNotifiedPrayer = '';

// ==================== Initialization ====================
async function init() {
    try {
        console.log('Pensè Initializing...');
        loadNotes();
        loadSettings();

        // Start UI tasks
        applyLanguage();
        setupEventListeners();
        renderNotes();
        updateCategoryCounts();

        // Android specific setup
        if (isCapacitor) {
            await initNativeFeatures();
        } else {
            requestNotificationPermission();
        }

        // Start Core Services
        updatePrayerTimes();

        // Precision Syncing
        setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 0) { // Check every minute on the dot
                checkReminders();
                checkPrayerTimeNotification();
            }
        }, 1000);

        console.log('Pensè Ready! 🚀');
    } catch (err) {
        console.error('Critical Init Error:', err);
    }
}


async function initNativeFeatures() {
    try {
        const ln = Capacitor.Plugins.LocalNotifications;
        if (!ln) return;

        // 1. Request Permission (Supports Android 13+)
        const permStatus = await ln.requestPermissions();
        notificationPermission = (permStatus.display === 'granted');

        if (notificationPermission) {
            // 2. Create Channel for Note Reminders
            await ln.createChannel({
                id: 'pense_reminders',
                name: 'تذكير الملاحظات',
                importance: 5,
                description: 'إشعارات الملاحظات والمواعيد',
                vibration: true,
                visibility: 1
            });

            // 3. Create Channel for Prayer Times (Azan)
            await ln.createChannel({
                id: 'pense_prayers',
                name: 'مواقيت الصلاة',
                importance: 5,
                description: 'تنبيهات الأذان ومواقيت الصلاة',
                vibration: true,
                visibility: 1
            });

            console.log('Notification channels created successfully');
        }

        // 4. Setup Notification Listeners
        ln.addListener('localNotificationActionPerformed', (notification) => {
            console.log('Notification action:', notification);
            // In the future: redirect to specific note
        });

    } catch (e) {
        console.error('Native init error:', e);
    }
}

// ==================== Language System ====================
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('pense_lang', currentLang);
    applyLanguage();
    renderNotes();
    updateCategoryCounts();
    if (currentCategory === 'religious') initReligiousHub();
}

function applyLanguage() {
    const t = translations[currentLang];
    const isAr = currentLang === 'ar';

    // Body Class
    document.body.classList.toggle('ltr', !isAr);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    // UI Texts
    elements.appTitle.textContent = t.appTitle;
    elements.langLabel.textContent = isAr ? 'EN' : 'عربي';
    elements.searchInput.placeholder = t.searchPlaceholder;
    elements.sidebarTitle.textContent = t.categories;
    elements.backupBtn.querySelector('span').textContent = t.backup;

    // Categories
    const catKeys = ['allNotes', 'personal', 'work', 'study', 'health', 'shopping', 'other'];
    elements.categoryButtons.forEach((btn, i) => {
        if (i < catKeys.length) {
            btn.querySelector('.category-name').textContent = t[catKeys[i]];
        }
        if (btn.dataset.category === 'religious') {
            btn.querySelector('.category-name').textContent = t.islamicCorner;
        }
    });

    // Empty State
    elements.emptyTitle.textContent = t.emptyTitle;
    elements.emptySub.textContent = t.emptySub;

    // Religious
    elements.hubTabs[0].textContent = t.tasbihTab;
    elements.hubTabs[1].textContent = t.adhkarTab;
    elements.hubTabs[2].textContent = t.prayerTab;
    elements.tasbihTarget.textContent = t.tasbihTarget;
    elements.tasbihBtn.textContent = t.tasbihBtn;
    elements.resetTasbih.textContent = t.resetBtn;
    elements.adhanLabel.textContent = t.adhanToggle;

    // Settings
    elements.settingsTitle.textContent = t.settingsTitle;
    elements.clearAllBtn.textContent = t.clearAll;
    elements.exportBtn.textContent = t.export;
    elements.importBtn.textContent = t.import;

    updateCategoryTitle();
}

function updateCategoryTitle() {
    if (currentCategory === 'religious') {
        elements.categoryTitle.textContent = translations[currentLang].islamicCorner;
    } else {
        const t = translations[currentLang];
        const categoryNames = {
            all: t.allNotes,
            personal: t.personal,
            work: t.work,
            study: t.study,
            health: t.health,
            shopping: t.shopping,
            other: t.other
        };
        elements.categoryTitle.textContent = categoryNames[currentCategory] || t.allNotes;
    }
}

// ==================== Local Storage ====================
function loadNotes() {
    try {
        let savedNotes = localStorage.getItem('pense_notes');

        if (!savedNotes) {
            const oldNotes = localStorage.getItem('notely_notes');
            if (oldNotes) {
                savedNotes = oldNotes;
                localStorage.setItem('pense_notes', oldNotes);
            }
        }

        if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            notes = Array.isArray(parsed) ? parsed : [];
        } else {
            notes = [];
        }
    } catch (err) {
        console.error('Failed to load notes', err);
        notes = [];
    }
}

function saveNotes() {
    localStorage.setItem('pense_notes', JSON.stringify(notes));
}

function loadSettings() {
    const theme = localStorage.getItem('pense_theme') || localStorage.getItem('notely_theme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleThemeIcons(true);
    }

    const notifications = localStorage.getItem('pense_notifications') || localStorage.getItem('notely_notifications');
    if (notifications !== null) {
        elements.notificationsToggle.checked = notifications === 'true';
    }

    const autoBackup = localStorage.getItem('pense_autoBackup') || localStorage.getItem('notely_autoBackup');
    if (autoBackup !== null) {
        elements.autoBackupToggle.checked = autoBackup === 'true';
    }

    const sound = localStorage.getItem('pense_sound') || localStorage.getItem('notely_sound');
    if (sound !== null) {
        elements.soundToggle.checked = sound === 'true';
    }

    if (elements.nicknameInput) {
        elements.nicknameInput.value = nickname;
    }


    // Load Gender
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        if (input.value === gender) input.checked = true;
    });
}

function saveSettings() {
    localStorage.setItem('pense_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    localStorage.setItem('pense_notifications', elements.notificationsToggle.checked);
    localStorage.setItem('pense_autoBackup', elements.autoBackupToggle.checked);
    localStorage.setItem('pense_sound', elements.soundToggle.checked);

    // Nickname and gender are saved via their own button now
}

function saveNickname() {
    nickname = elements.nicknameInput.value.trim();
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    gender = selectedGender ? selectedGender.value : 'male';

    localStorage.setItem('pense_nickname', nickname);
    localStorage.setItem('pense_gender', gender);
    showToast('تم حفظ الإعدادات');
    playSound();
}

function resetNickname() {
    nickname = '';
    gender = 'male';
    elements.nicknameInput.value = '';

    const maleInput = document.querySelector('input[name="gender"][value="male"]');
    if (maleInput) maleInput.checked = true;

    localStorage.setItem('pense_nickname', nickname);
    localStorage.setItem('pense_gender', gender);
    showToast('تم استعادة الوضع الافتراضي');
    playSound();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Header
    elements.langToggle.addEventListener('click', toggleLanguage);
    elements.searchToggle.addEventListener('click', toggleSearch);
    elements.clearSearch.addEventListener('click', clearSearch);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.settingsBtn.addEventListener('click', openSettings);

    // Sidebar
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => selectCategory(btn.dataset.category));
    });
    elements.backupBtn.addEventListener('click', downloadBackup);

    // Sort
    elements.sortSelect.addEventListener('change', renderNotes);

    // FAB
    elements.addNoteBtn.addEventListener('click', () => openNoteModal());

    // Note Modal
    elements.closeModal.addEventListener('click', closeNoteModal);
    elements.cancelBtn.addEventListener('click', closeNoteModal);
    elements.noteForm.addEventListener('submit', saveNote);
    elements.hasReminder.addEventListener('change', toggleReminderSection);

    // Settings Modal
    elements.closeSettings.addEventListener('click', closeSettingsModal);
    elements.clearAllBtn.addEventListener('click', clearAllNotes);
    elements.exportBtn.addEventListener('click', exportData);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', importData);

    // Nickname Controls
    if (elements.saveNicknameBtn) {
        elements.saveNicknameBtn.addEventListener('click', saveNickname);
    }
    if (elements.resetNicknameBtn) {
        elements.resetNicknameBtn.addEventListener('click', resetNickname);
    }

    if (elements.testNotificationBtn) {
        elements.testNotificationBtn.addEventListener('click', sendTestNotification);
    }


    // Religious Hub Tabs
    elements.hubTabs.forEach(tab => {
        tab.addEventListener('click', () => switchHubTab(tab.dataset.tab));
    });

    elements.backToMainBtn.addEventListener('click', () => selectCategory('all'));

    // Tasbih
    elements.tasbihBtn.addEventListener('click', incrementTasbih);
    elements.resetTasbih.addEventListener('click', resetTasbihCounter);

    // Adhkar
    elements.adhkarCats.forEach(cat => {
        cat.addEventListener('click', () => loadAdhkar(cat.dataset.cat));
    });

    elements.backToAdhkarList.addEventListener('click', closeFocusedAdkar);
    elements.focusedCounterBtn.addEventListener('click', decrementFocusedDhikr);

    // Prayer Sound Select (Preview Always)
    const soundSelect = document.getElementById('prayerSoundSelect');
    if (soundSelect) {
        soundSelect.addEventListener('change', () => {
            playPrayerSound(soundSelect.value);
        });
    }

    // Close modals on overlay click
    elements.noteModal.addEventListener('click', (e) => {
        if (e.target === elements.noteModal) closeNoteModal();
    });
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) closeSettingsModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Initial Delegations
    setupNoteDelegation();
}

// ==================== Search Functionality ====================
function toggleSearch() {
    elements.searchContainer.classList.toggle('hidden');
    if (!elements.searchContainer.classList.contains('hidden')) {
        elements.searchInput.focus();
    } else {
        elements.searchInput.value = '';
        renderNotes();
    }
}

function clearSearch() {
    elements.searchInput.value = '';
    renderNotes();
}

function handleSearch() {
    renderNotes();
}

// ==================== Theme Toggle ====================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggleThemeIcons(isDark);
    saveSettings();
    playSound();
}

function toggleThemeIcons(isDark) {
    const sunIcon = elements.themeToggle.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle.querySelector('.moon-icon');

    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// ==================== Category Management ====================
function selectCategory(category) {
    currentCategory = category;

    // Update active button
    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    const isReligious = category === 'religious';

    // 1. Reset all views first
    elements.religiousHub.classList.add('hidden');
    elements.notesGrid.classList.add('hidden');
    elements.emptyState && elements.emptyState.classList.add('hidden');
    const headerTitle = document.querySelector('.notes-header');
    if (headerTitle) headerTitle.classList.remove('hidden');

    document.body.classList.remove('religious-active');

    // 2. Activate Specific View
    if (isReligious) {
        document.body.classList.add('religious-active');
        if (headerTitle) headerTitle.classList.add('hidden');
        elements.religiousHub.classList.remove('hidden');
        elements.categoryTitle.textContent = 'الركن الإسلامي';
        initReligiousHub();
    } else {
        // Normal Note Categories
        elements.notesGrid.classList.remove('hidden');

        const categoryNames = {
            all: 'جميع الملاحظات',
            personal: 'الملاحظات الشخصية',
            work: 'ملاحظات العمل',
            study: 'ملاحظات الدراسة',
            health: 'ملاحظات الصحة',
            shopping: 'قوائم التسوق',
            other: 'ملاحظات أخرى'
        };
        elements.categoryTitle.textContent = categoryNames[category] || 'الملاحظات';
        renderNotes();
    }

    // Mobile Sidebar Close
    if (window.innerWidth <= 768) {
        elements.sidebar.classList.remove('active');
        const overlay = document.querySelector('.overlay'); // Ensure overlay is selected safely
        if (overlay) overlay.classList.remove('active');
    }
}


const adhkarData = {
    morning: [
        { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ (آية الكرسي)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ هُوَ ٱللَّهُ أَحَدٌ، ٱللَّهُ ٱلصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ. (سورة الإخلاص)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ. (سورة الفلق)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ، مَلِكِ ٱلنَّاسِ، إِلَٰهِ ٱلنَّاسِ، مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ، ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ، مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ. (سورة الناس)", count: 3 },
        { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ", count: 1 },
        { text: "اللَّهُمَّ بّكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ (سيد الاستغفار)", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4 },
        { text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي", count: 1 },
        { text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ", count: 1 },
        { text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
        { text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
        { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
        { text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَدِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَمِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", count: 3 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", count: 1 },
        { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 }
    ],
    evening: [
        { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ (آية الكرسي)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَآ أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ (خواتيم سورة البقرة)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ هُوَ ٱللَّهُ أَحَدٌ، ٱللَّهُ ٱلصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ. (سورة الإخلاص)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ. (سورة الفلق)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ، مَلِكِ ٱلنَّاسِ، إِلَٰهِ ٱلنَّاسِ، مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ، ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ، مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ. (سورة الناس)", count: 3 },
        { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ (سيد الاستغفار)", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4 },
        { text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي", count: 1 },
        { text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ", count: 1 },
        { text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
        { text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
        { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
        { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
        { text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَدِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَمِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", count: 3 },
        { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 }
    ],
    sleep: [
        { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ (آية الكرسي)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَآ أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ (خواتيم سورة البقرة)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ هُوَ ٱللَّهُ أَحَدٌ، ٱللَّهُ ٱلصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ. (سورة الإخلاص - تجمع الكفين وتنفث فيهما وتقرأ وتمسح ما استطعت من الجسد)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ. (سورة الفلق - نفس الطريقة)", count: 3 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ، مَلِكِ ٱلنَّاسِ، إِلَٰهِ ٱلنَّاسِ، مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ، ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ، مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ. (سورة الناس - نفس الطريقة)", count: 3 },
        { text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", count: 1 },
        { text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ", count: 1 },
        { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
        { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
        { text: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (34)", count: 1 },
        { text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ", count: 1 },
        { text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ", count: 1 },
        { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 3 },
        { text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ", count: 1 }
    ],
    "after-prayer": [
        { text: "أَسْتَغْفِرُ اللَّهَ (3)", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", count: 1 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ", count: 1 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ", count: 33 },
        { text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { text: "اللَّهُ أَكْبَرُ", count: 33 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (تمام المائة)", count: 1 },
        { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ (آية الكرسي)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ هُوَ ٱللَّهُ أَحَدٌ، ٱللَّهُ ٱلصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ. (سورة الإخلاص)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ. (سورة الفلق)", count: 1 },
        { text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيم: قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ، مَلِكِ ٱلنَّاسِ، إِلَٰهِ ٱلنَّاسِ، مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ، ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ، مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ. (سورة الناس)", count: 1 },
        { text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ", count: 1 }
    ]
};

// ... existing code ...

// Religious Hub Tabs
elements.hubTabs.forEach(tab => {
    tab.addEventListener('click', () => switchHubTab(tab.dataset.tab));
});

// Tasbih
elements.tasbihBtn.addEventListener('click', incrementTasbih);
elements.resetTasbih.addEventListener('click', resetTasbihCounter);

// Adhkar
elements.adhkarCats.forEach(cat => {
    cat.addEventListener('click', () => loadAdhkar(cat.dataset.cat));
});

// Close modals on overlay click
// ... existing code ...

// ==================== Religious Hub Logic ====================
function initReligiousHub() {
    loadAdhkar('morning');
    updatePrayerTimes();
}

function switchHubTab(tabId) {
    elements.hubTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
    elements.hubContents.forEach(content => content.classList.toggle('hidden', content.id !== `${tabId}-section`));
}

// Tasbih Functions
function incrementTasbih() {
    tasbihCount++;
    if (elements.tasbihCounter) elements.tasbihCounter.textContent = tasbihCount;
    playSound();

    // Simple feedback at 33
    if (tasbihCount % 33 === 0) {
        showToast('ما شاء الله! اكتملت الدورة');
        if (navigator.vibrate) navigator.vibrate(200);
    }
}

function resetTasbihCounter() {
    tasbihCount = 0;
    elements.tasbihCounter.textContent = 0;
}

// Adhkar Functions
function loadAdhkar(cat) {
    elements.adhkarCats.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === cat));
    const dhikrs = adhkarData[cat] || [];

    elements.adhkarList.innerHTML = dhikrs.map((dhikr, index) => `
        <div class="dhikr-card" id="dhikr-${index}" onclick="openFocusedAdkar(${index}, '${cat}')">
            <p class="dhikr-text">${dhikr.text}</p>
            <div class="dhikr-footer">
                <span class="dhikr-info">${translations[currentLang].tasbihTarget.replace('33', dhikr.count)}</span>
                <span class="dhikr-tap-hint">اضغط للفتح</span>
            </div>
        </div>
    `).join('');

    closeFocusedAdkar();
}

function openFocusedAdkar(index, cat) {
    const dhikr = adhkarData[cat][index];
    elements.focusedText.textContent = dhikr.text;
    elements.focusedCounterBtn.textContent = dhikr.count;
    elements.focusedCounterBtn.classList.remove('done');
    elements.focusedInfo.textContent = `${translations[currentLang].tasbihTarget.replace('33', dhikr.count)}`;

    elements.adhkarListContainer.classList.add('hidden');
    elements.focusedAdkar.classList.remove('hidden');
}

function closeFocusedAdkar() {
    elements.adhkarListContainer.classList.remove('hidden');
    elements.focusedAdkar.classList.add('hidden');
}

function decrementFocusedDhikr() {
    let currentCount = parseInt(elements.focusedCounterBtn.textContent);

    if (currentCount > 0) {
        currentCount--;
        elements.focusedCounterBtn.textContent = currentCount;
        playSound();

        if (currentCount === 0) {
            elements.focusedCounterBtn.classList.add('done');
            elements.focusedCounterBtn.innerHTML = '✓';
            if (navigator.vibrate) navigator.vibrate(100);

            setTimeout(() => {
                showToast(currentLang === 'ar' ? 'تم الانتهاء من الذكر' : 'Dhikr completed');
            }, 300);
        }
    }
}

// Prayer Times Functions
async function updatePrayerTimes() {
    try {
        // Cairo, Egypt (City=Cairo, Country=Egypt, Method=5 - Egyptian General Authority of Survey)
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await response.json();

        if (data.code === 200) {
            prayerTimes = data.data.timings;
            elements.currentHijriDate.textContent = `${data.data.date.hijri.day} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year} هـ`;
            renderPrayerTimes();
            if (isCapacitor) schedulePrayerNotifications(prayerTimes);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
}

function renderPrayerTimes() {
    const prayers = [
        { id: 'fajr', key: 'Fajr', name: 'الفجر' },
        { id: 'sunrise', key: 'Sunrise', name: 'الشروق' },
        { id: 'dhuhr', key: 'Dhuhr', name: 'الظهر' },
        { id: 'asr', key: 'Asr', name: 'العصر' },
        { id: 'maghrib', key: 'Maghrib', name: 'المغرب' },
        { id: 'isha', key: 'Isha', name: 'العشاء' }
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    let nextPrayer = null;

    prayers.forEach(p => {
        const timeEl = document.getElementById(`${p.id}-time`);
        const cardEl = document.getElementById(`${p.id}-card`);
        const timeStr = prayerTimes[p.key];

        if (timeEl) timeEl.textContent = timeStr;

        // Calculate minutes from midnight
        const [h, m] = timeStr.split(':').map(Number);
        const prayerMinutes = h * 60 + m;

        if (cardEl) {
            cardEl.classList.remove('current');
            if (!nextPrayer && prayerMinutes > currentTime) {
                nextPrayer = { ...p, minutes: prayerMinutes };
                cardEl.classList.add('current');
            }
        }
    });

    // Handle case where next prayer is Fajr tomorrow
    if (!nextPrayer) {
        nextPrayer = { ...prayers[0], name: 'فجر الغد' };
        document.getElementById('fajr-card').classList.add('current');
    }

    elements.nextPrayerMessage.textContent = `الصلاة القادمة: ${nextPrayer.name} الساعة ${prayerTimes[nextPrayer.key] || '--:--'}`;
}


// Spiritual & Religious Sounds
const prayerNotifySounds = {
    minshawi: 'https://server7.mp3quran.net/minsh/001.mp3', // Note: Using a short verse or Adhan clip
    spiritual: 'https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3', // Spiritual Gong for pre-alert
    adhan: 'https://www.islamcan.com/audio/adhan/adhan-by-sheikh-mohammad-siddiq-al-minshawi.mp3'
};

function checkPrayerTimeNotification() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayersToNotify = {
        'Fajr': 'الفجر',
        'Dhuhr': 'الظهر',
        'Asr': 'العصر',
        'Maghrib': 'المغرب',
        'Isha': 'العشاء'
    };

    for (const [key, name] of Object.entries(prayersToNotify)) {
        const timeStr = prayerTimes[key];
        if (!timeStr) continue;

        const [h, m] = timeStr.split(':').map(Number);
        const prayerMinutes = h * 60 + m;

        // 1. Check for exact time
        if (prayerMinutes === currentMinutes && lastNotifiedPrayer !== key) {
            notifyPrayer(name, 'onTime');
            lastNotifiedPrayer = key;
        }

        // 2. Check for 5 minutes before
        if (prayerMinutes - 5 === currentMinutes && lastPreNotifiedPrayer !== key) {
            notifyPrayer(name, 'preAlert');
            lastPreNotifiedPrayer = key;
        }
    }
}

function notifyPrayer(prayerName, type) {
    let message = '';
    const isAr = currentLang === 'ar';

    if (type === 'onTime') {
        const t = translations[currentLang];
        message = isAr ? `حان الآن موعد أذان صلاة ${prayerName}` : `It is time for ${prayerName} prayer`;
    } else {
        message = isAr ? `متبقي على صلاة ${prayerName} ٥ دقائق` : `5 minutes left until ${prayerName} prayer`;
    }

    // 1. Native Notification
    if (isCapacitor) {
        try {
            const ln = Capacitor.Plugins.LocalNotifications;
            if (ln) {
                ln.schedule({
                    notifications: [{
                        title: 'Pensè - أذان',
                        body: message,
                        id: stringToHash('prayer_immediate_' + prayerName),
                        schedule: { at: new Date() },
                        channelId: 'pense_prayers',
                        smallIcon: 'res://ic_launcher',
                        largeIcon: 'res://ic_launcher'
                    }]
                });
            }
        } catch (e) { console.error('Immediate native prayer notification failed', e); }
    }
    // 2. Browser Notification
    else if (notificationPermission) {
        new Notification('Pensè - أذان', {
            body: message,
            icon: '📝'
        });
    }

    // 3. UI Toast
    showToast(message);

    // 4. Voice/Sound feedback if enabled
    if (elements.prayerAdhanToggle.checked) {
        if (type === 'preAlert') {
            playPrayerSound('spiritual');
        } else {
            playPrayerSound('adhan');
        }
    }
}

function playPrayerSound(soundKey) {
    return new Promise((resolve) => {
        // Fallback for audio URLs
        const audio = new Audio(prayerNotifySounds[soundKey]);
        audio.volume = 0.7;
        audio.play().then(resolve).catch(e => {
            console.error('Sound play error:', e);
            resolve();
        });
    });
}

function sendTestNotification() {
    const greeting = getGreeting();
    const msg = `شغال تمام ${greeting}! الإشعارات وصلت بنجاح ✨`;

    if (isCapacitor) {
        try {
            const ln = Capacitor.Plugins.LocalNotifications;
            if (ln) {
                ln.schedule({
                    notifications: [{
                        title: 'Pensè - فحص الإشعارات',
                        body: msg,
                        id: 999,
                        schedule: { at: new Date() },
                        channelId: 'pense_reminders',
                        smallIcon: 'res://ic_launcher',
                        largeIcon: 'res://ic_launcher'
                    }]
                });
            }
        } catch (e) { console.error('Test native alert failed', e); }
    } else if (notificationPermission) {
        new Notification('Pensè - فحص', {
            body: msg,
            icon: '📝'
        });
    }

    showToast(msg);
    playSound();
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

function updateCategoryCounts() {
    const counts = {
        all: notes.length,
        personal: 0,
        work: 0,
        study: 0,
        health: 0,
        shopping: 0,
        other: 0
    };

    notes.forEach(note => {
        if (note.category && counts.hasOwnProperty(note.category)) {
            counts[note.category]++;
        } else if (note.category !== 'religious') {
            counts.other++;
        }
    });

    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
}

// ==================== Notes Rendering ====================
function renderNotes() {
    try {
        let filteredNotes = filterNotes();
        filteredNotes = sortNotes(filteredNotes);

        if (filteredNotes.length === 0) {
            elements.emptyState.classList.remove('hidden');
            elements.notesGrid.classList.add('hidden');
        } else {
            elements.emptyState.classList.add('hidden');
            elements.notesGrid.classList.remove('hidden');
            elements.notesGrid.innerHTML = filteredNotes.map(note => createNoteCard(note)).join('');

            // Event listeners are now handled via delegation on the notesGrid
        }
    } catch (err) {
        console.error('Render notes error:', err);
    }
}

// ==================== Note Actions (Delegation) ====================
function setupNoteDelegation() {
    elements.notesGrid.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.note-action-btn.delete');
        const editBtn = e.target.closest('.note-action-btn.edit');
        const noteCard = e.target.closest('.note-card');

        if (deleteBtn) {
            e.stopPropagation();
            const noteId = deleteBtn.dataset.noteId;
            if (noteId) deleteNote(noteId);
        } else if (editBtn) {
            e.stopPropagation();
            const noteId = editBtn.dataset.noteId;
            if (noteId) editNote(noteId);
        } else if (noteCard) {
            const noteId = noteCard.dataset.noteId;
            if (noteId) editNote(noteId);
        }
    });
}

function filterNotes() {
    let filtered = notes;

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(note => note.category === currentCategory);
    }

    // Filter by search
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    }

    return filtered;
}

function sortNotes(notesToSort) {
    const sortBy = elements.sortSelect.value;

    return [...notesToSort].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'title':
                return a.title.localeCompare(b.title, 'ar');
            case 'reminder':
                if (!a.reminder && !b.reminder) return 0;
                if (!a.reminder) return 1;
                if (!b.reminder) return -1;
                return new Date(a.reminder.datetime) - new Date(b.reminder.datetime);
            default:
                return 0;
        }
    });
}

function createNoteCard(note) {
    const categoryIcons = {
        personal: '👤',
        work: '💼',
        study: '📚',
        health: '❤️',
        shopping: '🛒',
        other: '📌'
    };

    const t = translations[currentLang];
    const categoryNames = {
        personal: t.personal,
        work: t.work,
        study: t.study,
        health: t.health,
        shopping: t.shopping,
        other: t.other
    };

    const date = new Date(note.createdAt);
    const formattedDate = date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    let reminderHTML = '';
    if (note.reminder) {
        const reminderDate = new Date(note.reminder.datetime);
        const formattedReminder = reminderDate.toLocaleDateString('ar-EG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        reminderHTML = `
            <div class="note-reminder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                ${formattedReminder}
            </div>
        `;
    }

    return `
        <div class="note-card" data-note-id="${note.id}" style="border-color: ${note.color}; color: ${note.color};">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="note-action-btn edit" data-note-id="${note.id}" title="تعديل">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="note-action-btn delete" data-note-id="${note.id}" title="حذف">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <p class="note-content">${escapeHtml(note.content)}</p>
            ${reminderHTML}
            <div class="note-footer">
                <span class="note-category">
                    <span>${categoryIcons[note.category]}</span>
                    <span>${categoryNames[note.category]}</span>
                </span>
                <span class="note-date">${formattedDate}</span>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Note Modal ====================
function openNoteModal(noteId = null) {
    // Safety check: Ensure noteId is a string/valid ID, not an Event object
    if (noteId && (typeof noteId !== 'string' && typeof noteId !== 'number')) {
        noteId = null;
    }
    currentNoteId = noteId;

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            elements.modalTitle.textContent = 'تعديل الملاحظة';
            elements.noteTitle.value = note.title;
            elements.noteContent.value = note.content;
            elements.noteCategory.value = note.category;

            // Set color
            const colorInput = document.querySelector(`input[name="color"][value="${note.color}"]`);
            if (colorInput) colorInput.checked = true;

            // Set reminder
            if (note.reminder) {
                elements.hasReminder.checked = true;
                elements.reminderSection.classList.remove('hidden');

                const datetime = new Date(note.reminder.datetime);
                elements.reminderDate.value = datetime.toISOString().split('T')[0];
                elements.reminderTime.value = datetime.toTimeString().slice(0, 5);
            } else {
                elements.hasReminder.checked = false;
                elements.reminderSection.classList.add('hidden');
            }
        }
    } else {
        elements.modalTitle.textContent = 'ملاحظة جديدة';
        elements.noteForm.reset();
        elements.reminderSection.classList.add('hidden');
    }

    elements.noteModal.classList.remove('hidden');
    elements.noteTitle.focus();
}

function closeNoteModal() {
    elements.noteModal.classList.add('hidden');
    elements.noteForm.reset();
    currentNoteId = null;
}

function toggleReminderSection() {
    if (elements.hasReminder.checked) {
        elements.reminderSection.classList.remove('hidden');

        // Set default date and time
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        elements.reminderDate.value = tomorrow.toISOString().split('T')[0];
        elements.reminderTime.value = '09:00';
    } else {
        elements.reminderSection.classList.add('hidden');
    }
}

function saveNote(e) {
    if (e) e.preventDefault();

    try {
        const title = elements.noteTitle.value.trim();
        const content = elements.noteContent.value.trim();

        if (!title) {
            showToast(currentLang === 'ar' ? 'يرجى إدخال عنوان للملاحظة' : 'Please enter a note title');
            elements.noteTitle.focus();
            return;
        }

        if (!content) {
            showToast(currentLang === 'ar' ? 'يرجى كتابة محتوى الملاحظة' : 'Please enter note content');
            elements.noteContent.focus();
            return;
        }

        const colorInput = document.querySelector('input[name="color"]:checked');
        const selectedColor = colorInput ? colorInput.value : '#FF6B6B';

        const noteData = {
            title: title,
            content: content,
            category: elements.noteCategory.value || 'other',
            color: selectedColor,
            reminder: null
        };

        if (elements.hasReminder.checked && elements.reminderDate.value && elements.reminderTime.value) {
            try {
                const datetimeStr = `${elements.reminderDate.value}T${elements.reminderTime.value}`;
                const datetime = new Date(datetimeStr);
                if (!isNaN(datetime.getTime())) {
                    noteData.reminder = {
                        datetime: datetime.toISOString(),
                        notified: false,
                        preNotified: false
                    };
                }
            } catch (err) {
                console.error('Invalid date format', err);
            }
        }

        if (currentNoteId && typeof currentNoteId === 'string' && currentNoteId.length > 5) {
            const index = notes.findIndex(n => String(n.id) === String(currentNoteId));
            if (index !== -1) {
                notes[index] = {
                    ...notes[index],
                    ...noteData,
                    updatedAt: new Date().toISOString()
                };
                if (isCapacitor) scheduleNoteNotification(notes[index]);
                showToast(currentLang === 'ar' ? 'تم تحديث الملاحظة بنجاح' : 'Note updated successfully');
            } else {
                createNewNote(noteData);
            }
        } else {
            createNewNote(noteData);
        }

        saveNotes();

        if (currentCategory === 'religious' || (currentCategory !== 'all' && currentCategory !== noteData.category)) {
            selectCategory('all');
        } else {
            renderNotes();
            updateCategoryCounts();
        }

        closeNoteModal();
        playSound();
    } catch (err) {
        console.error('Save note failed', err);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء حفظ الملاحظة' : 'Failed to save note');
    }
}

function createNewNote(noteData) {
    const newNote = {
        id: generateId(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    if (isCapacitor) scheduleNoteNotification(newNote);
    showToast(currentLang === 'ar' ? 'تم إضافة الملاحظة بنجاح' : 'Note added successfully');
}

function editNote(noteId) {
    openNoteModal(noteId);
}

function deleteNote(noteId) {
    try {
        console.log('Attempting to delete note:', noteId);
        const initialCount = notes.length;

        // Match using strings to be safe against type mismatches
        notes = notes.filter(n => String(n.id) !== String(noteId));

        if (notes.length < initialCount) {
            if (isCapacitor) cancelNoteNotification(noteId);
            saveNotes();
            renderNotes();
            updateCategoryCounts();

            const lang = currentLang || 'ar';
            const t = translations[lang] || translations.ar;
            showToast(t.deleteToast || (lang === 'ar' ? 'تم حذف الملاحظة' : 'Note deleted'));

            if (elements.soundToggle.checked) playSound();
        } else {
            // Fallback splice
            const index = notes.findIndex(n => String(n.id) === String(noteId));
            if (index !== -1) {
                if (isCapacitor) cancelNoteNotification(noteId);
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
                updateCategoryCounts();
                showToast(currentLang === 'ar' ? 'تم حذف الملاحظة' : 'Note deleted');
            }
        }
    } catch (err) {
        console.error('Delete note failed', err);
        showToast(currentLang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Deletion failed');
    }
}

// ==================== Settings ====================
function openSettings() {
    elements.settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
    elements.settingsModal.classList.add('hidden');
    saveSettings();
}

function clearAllNotes() {
    const t = translations[currentLang];
    if (confirm(t.clearAllConfirm)) {
        if (confirm(t.clearAllFinal)) {
            notes = [];
            saveNotes();
            renderNotes();
            updateCategoryCounts();
            showToast(t.clearAllToast);
            closeSettingsModal();
        }
    }
}

// ==================== Backup & Export ====================
function downloadBackup() {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notely-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تنزيل النسخة الاحتياطية');
    playSound();
}

function autoBackup() {
    localStorage.setItem('notely_auto_backup', JSON.stringify({
        notes: notes,
        timestamp: new Date().toISOString()
    }));
}

function exportData() {
    downloadBackup();
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedNotes = JSON.parse(event.target.result);
            if (Array.isArray(importedNotes)) {
                if (confirm(`سيتم استيراد ${importedNotes.length} ملاحظة. هل تريد المتابعة؟`)) {
                    notes = importedNotes;
                    saveNotes();
                    renderNotes();
                    updateCategoryCounts();
                    showToast('تم استيراد البيانات بنجاح');
                    closeSettingsModal();
                }
            } else {
                alert('ملف غير صالح');
            }
        } catch (error) {
            alert('خطأ في قراءة الملف');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ==================== Notifications ====================
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        notificationPermission = permission === 'granted';
    }
}

function checkReminders() {
    if (!elements.notificationsToggle.checked) return;

    const now = new Date();

    notes.forEach(note => {
        if (note.reminder) {
            const reminderTime = new Date(note.reminder.datetime);
            const timeDiff = reminderTime - now;

            // 1. One day before notification (approx 24 hours before)
            // Range: between 24h and 23h 50m before
            const oneDayInMs = 24 * 60 * 60 * 1000;
            if (timeDiff > 0 && timeDiff <= oneDayInMs && timeDiff > (oneDayInMs - 10 * 60 * 1000) && !note.reminder.preNotified) {
                const timeStr = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const greeting = getGreeting();
                const msg = `متنساش ${greeting} ان عليك بكرا "${note.title}" الساعة ${timeStr}`;
                showNotification(note, msg);
                note.reminder.preNotified = true;
                saveNotes();
            }

            // 2. Final notification (5 minutes before)
            if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000 && !note.reminder.notified) {
                const greeting = getGreeting();
                const msg = `متنساش ${greeting} ان عليك انهاردة "${note.title}"`;
                showNotification(note, msg);
                note.reminder.notified = true;
                saveNotes();
            }
        }
    });
}

function showNotification(note, customMessage) {
    const title = 'Pensè - تذكير';
    const body = customMessage || `${note.title}\n${note.content.substring(0, 100)}`;

    if (isCapacitor) {
        // Native immediate notification
        try {
            const ln = Capacitor.Plugins.LocalNotifications;
            if (ln) {
                ln.schedule({
                    notifications: [{
                        title: title,
                        body: body,
                        id: stringToHash(note.id + '_immediate'),
                        schedule: { at: new Date() },
                        channelId: 'pense_reminders',
                        smallIcon: 'res://ic_launcher',
                        largeIcon: 'res://ic_launcher'
                    }]
                });
            }
        } catch (e) { console.error('Immediate native alert failed', e); }
    } else if (notificationPermission && 'Notification' in window) {
        // Browser notification
        new Notification(title, {
            body: body,
            icon: '📝',
            tag: note.id
        });
    }

    showToast(body);
    playSound();
}

// ==================== Utilities ====================
function getGreeting() {
    if (!nickname) return 'ي صحبي';

    if (gender === 'male') {
        return `ي ${nickname} 🦇`;
    } else {
        return `ي ${nickname} 🐥`;
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');

    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

function playSound() {
    if (!elements.soundToggle.checked) return;

    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: New note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openNoteModal();
    }

    // Ctrl/Cmd + F: Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        toggleSearch();
    }

    // Escape: Close modals
    if (e.key === 'Escape') {
        if (!elements.noteModal.classList.contains('hidden')) {
            closeNoteModal();
        }
        if (!elements.settingsModal.classList.contains('hidden')) {
            closeSettingsModal();
        }
        if (!elements.searchContainer.classList.contains('hidden')) {
            toggleSearch();
        }
    }
}

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', init);

// ==================== Capacitor Integration Utilities ====================
// Capacitor Permissions already handled in initNativeFeatures
async function requestCapacitorPermissions() {
    return initNativeFeatures();
}

async function scheduleNoteNotification(note) {
    if (!isCapacitor || !note.reminder) return;
    try {
        const ln = Capacitor.Plugins.LocalNotifications;
        if (!ln) return;

        const reminderDate = new Date(note.reminder.datetime);
        const now = new Date();
        const notifications = [];

        // 1. Exact time notification
        if (reminderDate > now) {
            const greeting = getGreeting();
            notifications.push({
                title: 'Pensè - حان الموعد!',
                body: `متنساش ${greeting}: "${note.title}"`,
                id: stringToHash(note.id + '_exact'),
                schedule: { at: reminderDate },
                channelId: 'pense_reminders',
                smallIcon: 'res://ic_launcher',
                largeIcon: 'res://ic_launcher',
                actionTypeId: 'OPEN_APP'
            });
        }

        // 2. 5 mins before
        const fiveMinsBefore = new Date(reminderDate.getTime() - 5 * 60 * 1000);
        if (fiveMinsBefore > now) {
            notifications.push({
                title: 'Pensè - تنبيه سريع',
                body: `متبقي ٥ دقائق على: "${note.title}"`,
                id: stringToHash(note.id + '_5min'),
                schedule: { at: fiveMinsBefore },
                channelId: 'pense_reminders',
                smallIcon: 'res://ic_launcher',
                largeIcon: 'res://ic_launcher'
            });
        }

        // 3. One day before
        const oneDayBefore = new Date(reminderDate.getTime() - 24 * 60 * 60 * 1000);
        if (oneDayBefore > now) {
            const greeting = getGreeting();
            notifications.push({
                title: 'Pensè - تذكير مبكر',
                body: `متنساش ${greeting} ان عليك بكرا "${note.title}" الساعة ${reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                id: stringToHash(note.id + '_daybefore'),
                schedule: { at: oneDayBefore },
                channelId: 'pense_reminders',
                smallIcon: 'res://ic_launcher',
                largeIcon: 'res://ic_launcher'
            });
        }

        if (notifications.length > 0) {
            // Cancel old ones first to avoid duplicates
            await cancelNoteNotification(note.id);
            await ln.schedule({ notifications });
            console.log(`Scheduled ${notifications.length} native notifications for: ${note.title}`);
        }
    } catch (e) {
        console.error('Capacitor schedule error:', e);
    }
}

async function cancelNoteNotification(noteId) {
    if (!isCapacitor) return;
    try {
        const ln = Capacitor.Plugins.LocalNotifications;
        if (!ln) return;

        await ln.cancel({
            notifications: [
                { id: stringToHash(noteId + '_exact') },
                { id: stringToHash(noteId + '_5min') },
                { id: stringToHash(noteId + '_daybefore') }
            ]
        });
    } catch (e) {
        console.error('Capacitor cancel error:', e);
    }
}

async function schedulePrayerNotifications(times) {
    if (!isCapacitor || !times) return;
    try {
        const ln = Capacitor.Plugins.LocalNotifications;
        if (!ln) return;

        const now = new Date();
        const notifications = [];
        const prayers = { 'Fajr': 'الفجر', 'Dhuhr': 'الظهر', 'Asr': 'العصر', 'Maghrib': 'المغرب', 'Isha': 'العشاء' };

        // Schedule for today and tomorrow to ensure continuity
        for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
            for (const [key, name] of Object.entries(prayers)) {
                const timeStr = times[key];
                if (!timeStr) continue;
                const [h, m] = timeStr.split(':').map(Number);

                let prayerDate = new Date();
                prayerDate.setDate(now.getDate() + dayOffset);
                prayerDate.setHours(h, m, 0, 0);

                // If prayer is in the future
                if (prayerDate > now) {
                    notifications.push({
                        title: 'Pensè - أذان',
                        body: `حان الآن موعد أذان صلاة ${name}`,
                        id: stringToHash('prayer_' + key + '_' + dayOffset),
                        schedule: { at: prayerDate },
                        channelId: 'pense_prayers',
                        smallIcon: 'res://ic_launcher',
                        largeIcon: 'res://ic_launcher'
                    });
                }
            }
        }

        if (notifications.length > 0) {
            // Cancel old prayer notifications to avoid duplicates before scheduling new ones
            const oldIds = [];
            for (let i = 0; i <= 1; i++) {
                for (const key of Object.keys(prayers)) {
                    oldIds.push({ id: stringToHash('prayer_' + key + '_' + i) });
                }
            }
            try { await ln.cancel({ notifications: oldIds }); } catch (e) { }

            await ln.schedule({ notifications });
            console.log(`Scheduled ${notifications.length} native prayer notifications (Today & Tomorrow)`);
        }
    } catch (e) {
        console.error('Capacitor prayer schedule error:', e);
    }
}

function stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
