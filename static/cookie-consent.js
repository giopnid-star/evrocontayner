(function(){
  const KEY = 'cookieConsentGiven';
  const SETTINGS_KEY = 'cookieSettings';
  
  // Default cookie settings
  const defaultSettings = {
    necessary: true,    // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  };

  function setConsent(val){
    try{ localStorage.setItem(KEY, val ? '1' : '0'); }catch(e){}
  }
  
  function getConsent(){
    try{ return localStorage.getItem(KEY) === '1'; }catch(e){ return false; }
  }

  function saveSettings(settings){
    try{ 
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); 
      setConsent(true);
    }catch(e){}
  }

  function getSettings(){
    try{ 
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : defaultSettings;
    }catch(e){ 
      return defaultSettings; 
    }
  }

  function showBanner(){
    const el = document.getElementById('cookie-consent');
    if(!el) return;
    el.style.display = 'block';
    el.style.pointerEvents = 'auto';
    requestAnimationFrame(()=> el.classList.add('visible'));
  }
  
  function hideBanner(){
    const el = document.getElementById('cookie-consent');
    if(!el) return;
    el.classList.remove('visible');
    setTimeout(()=> { 
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
    }, 300);
  }

  function showModal(){
    const modal = document.getElementById('cookie-settings-modal');
    if(!modal) {
      console.warn('Cookie modal not found');
      return;
    }
    
    // Load current settings
    const settings = getSettings();
    const funcCheckbox = document.getElementById('cookie-functional');
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const marketingCheckbox = document.getElementById('cookie-marketing');
    
    if(funcCheckbox) funcCheckbox.checked = settings.functional;
    if(analyticsCheckbox) analyticsCheckbox.checked = settings.analytics;
    if(marketingCheckbox) marketingCheckbox.checked = settings.marketing;
    
    modal.style.display = 'flex';
    modal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'auto';
    
    // Force reflow
    modal.offsetHeight;
    requestAnimationFrame(()=> modal.classList.add('visible'));
  }

  function hideModal(){
    const modal = document.getElementById('cookie-settings-modal');
    if(!modal) return;
    modal.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(()=> { 
      modal.style.display = 'none';
      modal.style.pointerEvents = 'none';
    }, 300);
  }

  function acceptAll(){
    const allSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    saveSettings(allSettings);
    hideBanner();
    hideModal();
  }

  function saveCustomSettings(){
    const funcCheckbox = document.getElementById('cookie-functional');
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const marketingCheckbox = document.getElementById('cookie-marketing');
    
    const settings = {
      necessary: true,
      functional: funcCheckbox ? funcCheckbox.checked : false,
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false
    };
    saveSettings(settings);
    hideBanner();
    hideModal();
  }

  function attachEventListeners(){
    // Banner buttons - using event delegation
    document.addEventListener('click', function(e){
      const target = e.target;
      
      // Accept all button
      if(target.id === 'cookie-accept'){
        e.preventDefault();
        e.stopPropagation();
        acceptAll();
        return false;
      }
      
      // Settings button - opens modal without closing banner first
      if(target.id === 'cookie-settings' || target.classList.contains('cookie-settings-inline')){
        e.preventDefault();
        e.stopPropagation();
        hideBanner();
        showModal();
        return false;
      }
      
      // Close button
      if(target.classList.contains('cookie-modal-close')){
        e.preventDefault();
        e.stopPropagation();
        hideModal();
        return false;
      }
      
      // Save settings button
      if(target.id === 'cookie-save-settings'){
        e.preventDefault();
        e.stopPropagation();
        saveCustomSettings();
        return false;
      }
      
      // Accept all button in modal
      if(target.id === 'cookie-accept-all'){
        e.preventDefault();
        e.stopPropagation();
        acceptAll();
        return false;
      }
      
      // Overlay click
      if(target.classList.contains('cookie-modal-overlay')){
        e.preventDefault();
        e.stopPropagation();
        hideModal();
        return false;
      }
    }, true); // Use capture phase to ensure we catch events
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        hideModal();
      }
    });
  }

  function init(){
    // Always attach event listeners regardless of consent status
    attachEventListeners();
    
    // Only show banner if consent not yet given
    if(getConsent()) return; 
    
    // Show banner after small delay
    setTimeout(showBanner, 400);
  }

  // Allow opening settings from other controls
  window.showCookieSettings = function(){ 
    showModal(); 
  };

  // Initialize when DOM is ready
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();