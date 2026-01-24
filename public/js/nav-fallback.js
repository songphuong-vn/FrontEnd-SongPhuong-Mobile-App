(function(){
  // Provide safe global functions if app.js failed to define them
  
  // Fallback toggleSidebar
  if (typeof window.toggleSidebar !== 'function') {
    window.toggleSidebar = function() {
      try {
        var sidebar = document.getElementById('sidebarContainer');
        var overlay = document.getElementById('sidebarOverlay');
        if (!sidebar || !overlay) {
          console.error('Sidebar elements not found');
          return;
        }
        var isOpen = sidebar.classList.contains('active');
        if (isOpen) {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        } else {
          sidebar.classList.add('active');
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      } catch(err) {
        console.error('Fallback toggleSidebar error:', err);
      }
    };
    console.log('⚠️ Loaded fallback toggleSidebar');
  }

  // Fallback closeSidebar
  if (typeof window.closeSidebar !== 'function') {
    window.closeSidebar = function() {
      try {
        var sidebar = document.getElementById('sidebarContainer');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      } catch(err) {
        console.error('Fallback closeSidebar error:', err);
      }
    };
    console.log('⚠️ Loaded fallback closeSidebar');
  }

  // Fallback switchNav
  if (typeof window.switchNav !== 'function') {
    window.switchNav = function(tab, evt) {
      try {
        if (evt && evt.preventDefault) evt.preventDefault();
        // Close sidebar if open
        var sidebar = document.getElementById('sidebarContainer');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
        // Active state for bottom nav
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function(item){ item.classList.remove('active'); });
        navItems.forEach(function(item){
          var onclickAttr = item.getAttribute('onclick') || '';
          if (onclickAttr.indexOf("'"+tab+"'") !== -1) item.classList.add('active');
          if (tab === 'category' && onclickAttr.indexOf('toggleSidebar') !== -1) item.classList.add('active');
        });
        // Show selected view
        var views = document.querySelectorAll('.app-view');
        views.forEach(function(view){ view.classList.remove('active'); });
        var activeView = document.getElementById(tab+'-view');
        if (activeView) {
          activeView.classList.add('active');
          var scrollContent = document.querySelector('.scroll-content');
          if (scrollContent) scrollContent.scrollTop = 0;
        }
        // Toggle search bar visibility
        var searchBar = document.querySelector('.header-search-fixed');
        if (searchBar) searchBar.style.display = (tab === 'home') ? 'flex' : 'none';
        // Render home products on first load if needed
        if (tab === 'home' && window.renderHomeProducts) {
          renderHomeProducts({ reset: true, reason: 'fallback-nav' });
        }
      } catch(err) {
        console.error('Fallback switchNav error:', err);
      }
    };
    console.log('⚠️ Loaded fallback switchNav');
  }
})();
