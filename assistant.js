// ==================== App Assistant (Local Smart Helper) ====================

async function generateAppAssistantReply(input) {
    const text = input.trim().toLowerCase();
    const greeting = getGreeting();

    // ==================== App Navigation Commands ====================

    // Show all notes
    if (text.match(/وريني الملاحظات|افتح الملاحظات|show notes|my notes|كل الملاحظات/)) {
        setTimeout(() => selectCategory('all'), 500);
        return `حاضر ${greeting}! 📂\nهفتحلك كل الملاحظات دلوقتي...`;
    }

    // Show specific category
    if (text.match(/ملاحظات الشغل|شغل|work notes/)) {
        setTimeout(() => selectCategory('work'), 500);
        return `تمام! هفتحلك ملاحظات الشغل 💼`;
    }

    if (text.match(/ملاحظات شخصي|شخصي|personal/)) {
        setTimeout(() => selectCategory('personal'), 500);
        return `حاضر! ملاحظاتك الشخصية 👤`;
    }

    if (text.match(/ملاحظات الدراسة|دراسة|study/)) {
        setTimeout(() => selectCategory('study'), 500);
        return `تمام! ملاحظات الدراسة 📚`;
    }

    if (text.match(/ملاحظات الصحة|صحة|health/)) {
        setTimeout(() => selectCategory('health'), 500);
        return `حاضر! ملاحظات الصحة ❤️`;
    }

    if (text.match(/قائمة التسوق|تسوق|shopping/)) {
        setTimeout(() => selectCategory('shopping'), 500);
        return `تمام! قائمة التسوق 🛒`;
    }

    // Religious Hub
    if (text.match(/ركن اسلامي|اذكار|صلاة|islamic|prayers|تسبيح/)) {
        setTimeout(() => selectCategory('religious'), 500);
        return `بإذن الله ${greeting} 🕌\nهفتحلك الركن الإسلامي...`;
    }

    // Open settings
    if (text.match(/افتح الاعدادات|settings|إعدادات/)) {
        setTimeout(() => openSettings(), 500);
        return `حاضر! هفتحلك الإعدادات ⚙️`;
    }

    // ==================== Note Management Commands ====================

    // Count notes
    if (text.match(/كام ملاحظة|عدد الملاحظات|how many notes|count/)) {
        const total = notes.length;
        const categories = {
            personal: notes.filter(n => n.category === 'personal').length,
            work: notes.filter(n => n.category === 'work').length,
            study: notes.filter(n => n.category === 'study').length,
            health: notes.filter(n => n.category === 'health').length,
            shopping: notes.filter(n => n.category === 'shopping').length,
            other: notes.filter(n => n.category === 'other').length
        };

        return `عندك ${total} ملاحظة في المجموع 📊\n\n` +
            `👤 شخصي: ${categories.personal}\n` +
            `💼 شغل: ${categories.work}\n` +
            `📚 دراسة: ${categories.study}\n` +
            `❤️ صحة: ${categories.health}\n` +
            `🛒 تسوق: ${categories.shopping}\n` +
            `📌 أخرى: ${categories.other}`;
    }

    // Create new note
    if (text.match(/اكتب ملاحظة|سجل|new note|add note|اضف ملاحظة/)) {
        const content = text.replace(/اكتب ملاحظة|سجل|new note|add note|اضف ملاحظة/i, '').trim();
        if (content) {
            const newNote = {
                id: generateId(),
                title: 'ملاحظة سريعة',
                content: content,
                category: 'personal',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                color: '#FF6B6B',
                reminder: null
            };
            notes.unshift(newNote);
            saveNotes();
            renderNotes();
            updateCategoryCounts();
            return `تم ${greeting}! ✅\nسجلتلك: "${content}"`;
        } else {
            setTimeout(() => openNoteModal(), 500);
            return `حاضر! هفتحلك نافذة إضافة ملاحظة جديدة 📝`;
        }
    }

    // Search notes
    if (text.match(/ابحث عن|دور على|search for|find/)) {
        const searchTerm = text.replace(/ابحث عن|دور على|search for|find/i, '').trim();
        if (searchTerm) {
            elements.searchInput.value = searchTerm;
            if (elements.searchContainer.classList.contains('hidden')) {
                toggleSearch();
            }
            renderNotes();
            return `تمام! بدور على "${searchTerm}" في ملاحظاتك... 🔍`;
        } else {
            toggleSearch();
            return `حاضر! فتحتلك البحث 🔍\nاكتب اللي عايز تدور عليه...`;
        }
    }

    // Show latest notes
    if (text.match(/آخر ملاحظة|اخر ملاحظة|latest note|recent/)) {
        if (notes.length === 0) {
            return `معندكش ملاحظات لسه ${greeting} 📭\nتحب تضيف واحدة؟`;
        }
        const latest = notes[0];
        return `آخر ملاحظة عندك:\n\n📝 "${latest.title}"\n${latest.content.substring(0, 100)}${latest.content.length > 100 ? '...' : ''}`;
    }

    // Export/Backup
    if (text.match(/نسخة احتياطية|backup|export|تصدير/)) {
        setTimeout(() => downloadBackup(), 500);
        return `حاضر! هنزلك نسخة احتياطية من كل ملاحظاتك 💾`;
    }

    // ==================== Utility Commands ====================

    // Math Calculator
    const mathMatch = text.match(/^([\d\.]+)\s*([\+\-\*\/])\s*([\d\.]+)$/);
    if (mathMatch) {
        try {
            const n1 = parseFloat(mathMatch[1]);
            const op = mathMatch[2];
            const n2 = parseFloat(mathMatch[3]);
            let res;
            switch (op) {
                case '+': res = n1 + n2; break;
                case '-': res = n1 - n2; break;
                case '*': res = n1 * n2; break;
                case '/': res = n1 / n2; break;
            }
            return `الناتج: ${res} 🔢`;
        } catch (e) {
            return `حاولت أحسبها بس فيه مشكلة 😅`;
        }
    }

    // Time
    if (text.match(/الساعة كام|وقت|time|hour/)) {
        return `الساعة دلوقتي: ${new Date().toLocaleTimeString('ar-EG')} ⌚`;
    }

    // Date
    if (text.match(/تاريخ|يوم ايه|النهاردة|date|today/)) {
        return `النهاردة: ${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 📅`;
    }

    // ==================== Conversational Responses ====================

    // Greetings
    if (text.match(/السلام عليكم|عامل ايه|ازيك|كيفك|مرحبا|اهلا|سلام|هاي|hello|hi/)) {
        return `وعليكم السلام ${greeting}! 🌹\nأنا مساعدك الشخصي في Pensè.\n\nأقدر أساعدك في:\n📝 إدارة ملاحظاتك\n🔍 البحث والتنظيم\n🕌 الركن الإسلامي\n⌚ الوقت والحسابات\n\nقولي محتاج إيه؟`;
    }

    // Identity
    if (text.match(/اسمك|مين انت|انت مين|وظيفتك|بتعمل ايه/)) {
        return `أنا مساعدك الشخصي في Pensè 🤖\n\nأقدر أساعدك في:\n• فتح أقسام التطبيق\n• إنشاء وإدارة الملاحظات\n• البحث عن ملاحظات معينة\n• معرفة عدد ملاحظاتك\n• الحسابات والوقت\n\nجرب تقولي: "وريني ملاحظاتي" أو "كام ملاحظة عندي"`;
    }

    // Help
    if (text.match(/مساعدة|ساعدني|help|commands|أوامر/)) {
        return `طبعاً ${greeting}! 💪\n\nأوامر مفيدة:\n\n📂 "وريني الملاحظات"\n📝 "سجل اشتري لبن"\n🔍 "ابحث عن كلمة"\n📊 "كام ملاحظة عندي"\n💼 "افتح ملاحظات الشغل"\n🕌 "افتح الركن الإسلامي"\n⌚ "الساعة كام"\n🔢 "5 + 3"\n💾 "نسخة احتياطية"\n\nجرب أي أمر! 😊`;
    }

    // Emotions - Sad
    if (text.match(/حزين|مخنوق|تعبان|زعلان|مضايق|sad|depressed/)) {
        return `سلامتك ${greeting} 😔\nالدنيا مش مستاهلة الزعل.\n\nممكن تكتب اللي في بالك في ملاحظة؟ ده بيساعد كتير.\nأو تروح الركن الإسلامي تقرأ أذكار 🌙`;
    }

    // Emotions - Anxious
    if (text.match(/قلقان|خايف|متوتر|قلق|stress|anxious/)) {
        return `هدي أعصابك ${greeting} 🧘‍♂️\nخذ نفس عميق...\n\nممكن تكتب اللي قلقك في ملاحظة وتنظم أفكارك.\nأو تروح الركن الإسلامي للسكينة 🌙`;
    }

    // Thanks
    if (text.match(/شكرا|تسلم|thanks|thank you/)) {
        return `العفو ${greeting}! 💖\nأنا موجود دايماً لخدمتك.`;
    }

    // Jokes
    if (text.match(/نكتة|ضحكني|joke/)) {
        const jokes = [
            `مرة واحد خلف 7 عيال سمى نفسه سفن أب 😂`,
            `مرة مدرس رياضيات خلف ولدين واستنتج الثالث 😂`,
            `ليه الكمبيوتر راح للدكتور؟\nعشان عنده فيروس! 😂`
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // ==================== Default Responses ====================

    const responses = [
        `مش فاهم قصدك ${greeting} 🤔\nممكن توضح أكتر؟ أو قول "مساعدة" عشان أوريك الأوامر المتاحة.`,
        `معلش، مش متأكد إيه المطلوب 😅\nجرب تقول "مساعدة" عشان تشوف الأوامر اللي أقدر أساعدك بيها.`,
        `عايز تعمل إيه بالظبط ${greeting}؟\nقول "مساعدة" عشان أوريك الأوامر المتاحة 📝`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}
