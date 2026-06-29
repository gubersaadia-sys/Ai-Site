// פונקציית עזר ליצירת קישור לווטסאפ
function getWhatsappLink() {
    const number = window.SITE_CONFIG.whatsappNumber;
    const message = encodeURIComponent(window.SITE_CONFIG.whatsappMessage);
    return `https://wa.me/${number}?text=${message}`;
}

// פונקציה לעדכון ערכים בדף מתוך קובץ ההגדרות
function injectConfig() {
    if (!window.SITE_CONFIG) return;

    // עדכון טקסטים רגילים
    document.querySelectorAll('[data-config]').forEach(el => {
        const key = el.getAttribute('data-config');
        if (window.SITE_CONFIG[key] !== undefined) {
            el.textContent = window.SITE_CONFIG[key];
        }
    });

    // עדכון סטטוס מלאי
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
        const status = window.SITE_CONFIG.availability;
        statusBadge.textContent = window.SITE_CONFIG.availabilityText[status];
        statusBadge.className = `status-badge ${status}`;
    }

    // עדכון קישורי ווטסאפ
    document.querySelectorAll('.whatsapp-link').forEach(link => {
        link.href = getWhatsappLink();
    });
    
    // עדכון כותרת הדף
    if (document.title.includes('AI Pro Link')) {
        document.title = document.title.replace('AI Pro Link', window.SITE_CONFIG.siteName);
    }
}

// פונקציה לרינדור שאלות ותשובות (FAQ)
function renderFAQ() {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer || !window.FAQ_DATA) return;

    window.FAQ_DATA.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <div class="faq-question">
                <span>${item.question}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;

        const questionElement = faqItem.querySelector('.faq-question');
        const answerElement = faqItem.querySelector('.faq-answer');

        questionElement.addEventListener('click', () => {
            const isOpen = faqItem.classList.contains('open');
            
            // סגירת כל השאלות האחרות (אופציונלי - כרגע נאפשר פתיחה של כמה במקביל)
            /*
            document.querySelectorAll('.faq-item.open').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-answer').style.maxHeight = null;
            });
            */

            if (!isOpen) {
                faqItem.classList.add('open');
                answerElement.style.maxHeight = answerElement.scrollHeight + "px";
            } else {
                faqItem.classList.remove('open');
                answerElement.style.maxHeight = null;
            }
        });

        faqContainer.appendChild(faqItem);
    });
}

// הפעלה כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    injectConfig();
    renderFAQ();
});
