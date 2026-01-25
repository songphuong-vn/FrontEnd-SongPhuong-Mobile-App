(function () {
    function unlockScroll() {
        // console.log('🔓 Unlocking scroll interaction...');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Fix for Ionic/App Shell
        const ionApp = document.querySelector('.ion-app');
        if (ionApp) ionApp.style.overflow = '';

        const views = document.querySelectorAll('.view');
        views.forEach(v => v.style.overflow = '');

        // Fix wrappers
        const wrappers = document.querySelectorAll('.page-content-wrapper');
        wrappers.forEach(w => w.style.overflowY = 'auto');
    }

    // Run immediately
    unlockScroll();

    // Run on interactive
    document.addEventListener('DOMContentLoaded', unlockScroll);

    // Run on fully loaded
    window.addEventListener('load', () => {
        setTimeout(unlockScroll, 200);
        setTimeout(unlockScroll, 1000);
    });

    // Run periodically for next 5 seconds to fight race conditions
    let checks = 0;
    const interval = setInterval(() => {
        unlockScroll();
        checks++;
        if (checks > 25) clearInterval(interval); // 5 seconds
    }, 200);

    // Unlock on any first interaction (touch/click)
    ['touchstart', 'click', 'scroll', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, () => {
            if (document.body.style.overflow === 'hidden') unlockScroll();
        }, { once: true, passive: true });
    });
})();
