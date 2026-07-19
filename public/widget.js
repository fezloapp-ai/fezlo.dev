(function () {
  var scripts = document.querySelectorAll('script[data-fezlo-token]');
  scripts.forEach(function (script) {
    var token = script.getAttribute('data-fezlo-token');
    var container = document.createElement('span');
    container.style.cssText = 'display:inline-flex;align-items:center;gap:6px;font-family:system-ui,sans-serif;font-size:13px;padding:4px 10px;border-radius:999px;background:#f3f4f6;color:#4b5563;';
    container.textContent = 'Chargement...';
    script.parentNode.insertBefore(container, script);

    var logoSvg = '<svg width="14" height="14" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#fg)"/><path d="M9 16.5l4.5 4.5L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

    fetch('https://fezlo-app.netlify.app/api/verify/' + encodeURIComponent(token))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.verified) {
          var link = document.createElement('a');
          link.href = 'https://fezlo-app.netlify.app';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.cssText = 'display:inline-flex;align-items:center;gap:6px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;padding:4px 10px 4px 8px;border-radius:999px;background:#ecfdf5;color:#059669;text-decoration:none;border:1px solid #a7f3d0;';
          link.innerHTML = logoSvg + '<span>Vérifié par Fezlo</span>';
          container.replaceWith(link);
        } else {
          container.remove();
        }
      })
      .catch(function () { container.remove(); });
  });
})();
