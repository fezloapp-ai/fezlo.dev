(function () {
  document.querySelectorAll('[data-fezlo-gate]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var returnUrl = window.location.href.split('?')[0];
      window.location.href = 'https://fezlo-app.netlify.app/verify-widget?return_url=' + encodeURIComponent(returnUrl);
    });
  });
  var params = new URLSearchParams(window.location.search);
  var verifId = params.get('fezlo_verification_id');
  if (verifId) {
    document.querySelectorAll('[data-fezlo-gate]').forEach(function (btn) {
      var hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'fezlo_verification_id';
      hidden.value = verifId;
      var form = btn.closest('form');
      if (form) form.appendChild(hidden);
      btn.textContent = '✓ Vérifié';
      btn.setAttribute('disabled', 'true');
    });
  }
})();
