/* ============================================================
   BEANPOLE — playlist + autoplay + controls
============================================================ */
(function () {
  const tracks = [
    'assets/audio/Fall%20Over%20Me.mp3',
    'assets/audio/Changed.mp3',
    'assets/audio/Rain.mp3',
    'assets/audio/Lackluster.mp3',
    'assets/audio/Breakdown.mp3',
    'assets/audio/Burn%20Out.mp3',
    'assets/audio/Bruce%20Lee.mp3',
    'assets/audio/She_s%20Gone%20to%20Dallas.mp3',
    'assets/audio/Exit%20303.mp3',
    'assets/audio/Shacked%20Up%20in%20Durango.mp3',
    'assets/audio/Ask%20Him.mp3',
    'assets/audio/Kalifornia.mp3',
    'assets/audio/Shoes.mp3',
    'assets/audio/Bobby.mp3'
  ];

  const audio   = document.getElementById('audio');
  const btnPlay = document.getElementById('toggleBtn');
  const btnPrev = document.getElementById('prevBtn');
  const btnNext = document.getElementById('nextBtn');
  const bgImg   = document.getElementById('bgImg');
  const drawer       = document.getElementById('infoDrawer');
  const drawerHandle = document.getElementById('drawerHandle');
  const drawerClose  = document.getElementById('drawerClose');
  const drawerX      = document.getElementById('drawerX');
  const handleLabel  = document.getElementById('drawerHandleLabel');

  if (!audio || !btnPlay) return;

  /* Shuffle playlist */
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }
  let current = 0;

  function loadTrack(index, andPlay) {
    audio.src = tracks[index];
    audio.load();
    if (andPlay) {
      audio.play().then(function () {
        setLabel(true);
        btnPlay.classList.remove('needs-interaction');
      }).catch(function () {
        setLabel(false);
        btnPlay.classList.add('needs-interaction');
      });
    } else {
      setLabel(false);
    }
  }

  const iconPlay  = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');

  function setLabel(playing) {
    iconPlay.style.display  = playing ? 'none'  : '';
    iconPause.style.display = playing ? ''      : 'none';
  }

  function prev() {
    current = (current - 1 + tracks.length) % tracks.length;
    loadTrack(current, true);
  }

  function next() {
    current = (current + 1) % tracks.length;
    loadTrack(current, true);
  }

  /* Load random track, autoplay after 2s */
  loadTrack(current, false);
  setTimeout(function () {
    audio.play().then(function () {
      setLabel(true);
      btnPlay.classList.remove('needs-interaction');
    }).catch(function () {
      setLabel(false);
      btnPlay.classList.add('needs-interaction');
    });
  }, 2000);

  /* Auto-advance to next track when one finishes */
  audio.addEventListener('ended', function () {
    next();
  });

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerHandle.setAttribute('aria-expanded', 'true');
    handleLabel.textContent = '▼ BEANPOLE';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerHandle.setAttribute('aria-expanded', 'false');
    handleLabel.textContent = '▲ BEANPOLE';
  }

  function toggle() {
    if (audio.paused) {
      audio.play();
      setLabel(true);
      btnPlay.classList.remove('needs-interaction');
    } else {
      audio.pause();
      setLabel(false);
    }
  }

  btnPlay.addEventListener('click', toggle);
  if (btnPrev) btnPrev.addEventListener('click', prev);
  if (btnNext) btnNext.addEventListener('click', next);

  if (drawerHandle) drawerHandle.addEventListener('click', openDrawer);
  if (drawerClose)  drawerClose.addEventListener('click', closeDrawer);
  if (drawerX)      drawerX.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
  if (bgImg) bgImg.addEventListener('click', function () {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      toggle();
    }
  });
})();
