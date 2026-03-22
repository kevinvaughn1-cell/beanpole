/* ============================================================
   BEANPOLE — autoplay + toggle
============================================================ */
(function () {
  const audio     = document.getElementById('audio');
  const btn       = document.getElementById('toggleBtn');
  const bgImg     = document.getElementById('bgImg');

  if (!audio || !btn) return;

  function setLabel(playing) {
    btn.textContent = playing ? 'pause' : 'play';
  }

  /* Try autoplay after 2s */
  setTimeout(function () {
    audio.play().then(function () {
      setLabel(true);
      btn.classList.remove('needs-interaction');
    }).catch(function () {
      /* Browser blocked autoplay — prompt user */
      setLabel(false);
      btn.classList.add('needs-interaction');
    });
  }, 2000);

  function toggle() {
    if (audio.paused) {
      audio.play();
      setLabel(true);
      btn.classList.remove('needs-interaction');
    } else {
      audio.pause();
      setLabel(false);
    }
  }

  /* Toggle on button or logo click */
  btn.addEventListener('click', toggle);
  if (bgImg) bgImg.addEventListener('click', toggle);

  audio.addEventListener('ended', function () {
    setLabel(false);
  });
})();
