(function () {
    function unlockScroll() {
        console.log('🔓 Unlocking scroll interaction...');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Fix for Ionic/App Shell
        const ionApp = document.querySelector('.ion-app');
        if (ionApp) ionApp.style.overflow = '';

        const views = document.querySelectorAll('.view');
        views.forEach(v => v.style.overflow = '');
    }

    // Run immediately
    unlockScroll();

    // Run on interactive
    document.addEventListener('DOMContentLoaded', unlockScroll);

    // Run on fully loaded
    window.addEventListener('load', () => {
        setTimeout(unlockScroll, 200);
        setTimeout(unlockScroll, 1000); // Retry later logic overrides
    });

    // Run when clicking body (fallback for stuck state)
    document.body.addEventListener('click', () => {
        if (document.body.style.overflow === 'hidden') {
            unlockScroll();
        }
    }, { once: true });
})();
