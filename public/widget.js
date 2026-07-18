(function () {
  var scripts = document.querySelectorAll('script[data-fezlo-handle]');
  scripts.forEach(function (script) {
    var handle = script.getAttribute('data-fezlo-handle');
    var container = document.createElement('span');
    container.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-family:system-ui,sans-serif;font-size:13px;padding:4px 10px;border-radius:999px;background:#f3f4f6;color:#4b5563;';
    container.textContent = 'Chargement...';
    script.parentNode.insertBefore(container, script);

    fetch('https://fezlo-app.netlify.app/api/badge/' + encodeURIComponent(handle))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.verified) {
          var link = document.createElement('a');
          link.href = 'https://fezlo-app.netlify.app';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-family:system-ui,sans-serif;font-size:13px;padding:4px 10px;border-radius:999px;background:#ecfdf5;color:#059669;text-decoration:none;border:1px solid #a7f3d0;';
          link.innerHTML = '✓ Vérifié par Fezlo';
          container.replaceWith(link);
        } else {
          container.remove();
        }
      })
      .catch(function () { container.remove(); });
  });
})();
