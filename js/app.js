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
        link.addEventListener('click', (e) => {
            const checkbox = document.getElementById('terms-checkbox');
            if (checkbox && !checkbox.checked) {
                e.preventDefault();
                alert('יש לסמן V בתיבה המאשרת שקראת את תנאי השירות לפני ההמשך.');
                
                // UX Fix: Scroll to the checkbox and highlight it
                checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const container = checkbox.closest('div');
                if (container) {
                    const originalBg = container.style.backgroundColor;
                    container.style.transition = 'background-color 0.3s ease';
                    container.style.backgroundColor = '#fef08a'; // Light yellow flash
                    setTimeout(() => {
                        container.style.backgroundColor = originalBg || '#f8fafc';
                    }, 800);
                }
            }
        });
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
        const faqItem = document.createElement('details');
        faqItem.className = 'premium-accordion';
        
        faqItem.innerHTML = `
            <summary>${item.question}</summary>
            <div class="details-content">
                <p>${item.answer}</p>
            </div>
        `;

        // אופציונלי: סגירת אקורדיונים אחרים כשפותחים אחד
        faqItem.addEventListener('toggle', (e) => {
            if (faqItem.open) {
                document.querySelectorAll('#faq-container .premium-accordion').forEach(otherItem => {
                    if (otherItem !== faqItem) {
                        otherItem.removeAttribute('open');
                    }
                });
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
