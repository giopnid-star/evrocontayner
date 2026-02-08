(function(){
  const KEY = 'cookieConsentGiven';
  function setConsent(val){
    try{ localStorage.setItem(KEY, val ? '1' : '0'); }catch(e){}
  }
  function getConsent(){
    try{ return localStorage.getItem(KEY) === '1'; }catch(e){ return false; }
  }
  function showBanner(){
    const el = document.getElementById('cookie-consent');
    if(!el) return;
    el.style.display = 'block';
    requestAnimationFrame(()=> el.classList.add('visible'));
  }
  function hideBanner(){
    const el = document.getElementById('cookie-consent');
    if(!el) return;
    el.classList.remove('visible');
    setTimeout(()=> el.style.display = 'none', 300);
  }
  function init(){
    if(getConsent()) return; // already accepted
    // show after small delay
    setTimeout(showBanner, 400);
    const accept = document.getElementById('cookie-accept');
    const settings = document.getElementById('cookie-settings');
    if(accept) accept.addEventListener('click', ()=>{ setConsent(true); hideBanner(); });
    if(settings) settings.addEventListener('click', ()=>{ alert('Здесь можно реализовать выбор типов cookies.'); });
  }
  // allow opening the banner from other controls
  function openSettings(){ showBanner(); }
  window.showCookieSettings = openSettings;

  // delegate clicks on any inline settings button
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t && t.classList && t.classList.contains('cookie-settings-inline')){
      openSettings();
    }
  });

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();