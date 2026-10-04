(() => {
  'use strict';
  const catalog = window.PORTFOLIO_CATALOG;
  if (!catalog) return;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const preferred = ['superclasico', 'colo-colo', 'motor', 'marcas', 'lucha-libre', 'bodas', 'retratos-de-cancha', 'cheerleading', 'gastronomia', 'futbol-local'];
  const projects = [...catalog.projects].sort((a,b) => preferred.indexOf(a.id) - preferred.indexOf(b.id));
  const videoOrder = [115,54,73,93,125,114];
  const videos = [...catalog.videos].sort((a,b) => videoOrder.indexOf(Number(a.id)) - videoOrder.indexOf(Number(b.id)));
  const group = (project) => project.category.includes('producto') ? 'brand' : project.category.includes('eventos') ? 'event' : 'sport';
  let currentFilter = 'all', showAllProjects = false, showAllVideos = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) document.documentElement.classList.add('js-motion');
  const observer = !reducedMotion && 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold:0.09}) : null;
  function observe(scope = document) {
    scope.querySelectorAll('.reveal').forEach((el) => observer ? observer.observe(el) : el.classList.add('is-visible'));
  }
  function renderProjects() {
    const filtered = projects.filter((p) => currentFilter === 'all' || group(p) === currentFilter);
    const shown = showAllProjects || currentFilter !== 'all' ? filtered : filtered.slice(0,6);
    $('#project-grid').innerHTML = shown.map((p) => {
      const cover = p.images.find((image) => image.src === p.cover) || p.images[0];
      return `<article class="project reveal"><button type="button" class="project-button" data-project="${escape(p.id)}" aria-label="Abrir galería: ${escape(p.title)}"><div class="project-image"><img src="${escape(p.cover)}" alt="${escape(cover.alt || p.title)}" width="${cover.width}" height="${cover.height}" loading="lazy"><span class="project-open">Ver galería <span>${p.images.length} fotografías</span></span></div><div class="project-meta"><h3>${escape(p.title)}</h3><span>${escape(p.category)}</span></div></button></article>`;
    }).join('');
    $('#project-count').textContent = `${shown.length} de ${filtered.length} trabajos`;
    $('#show-projects').hidden = shown.length === filtered.length;
    observe($('#project-grid'));
  }
  function duration(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${Math.floor(seconds % 60).toString().padStart(2,'0')}`; }
  function renderVideos() {
    $('#video-grid').innerHTML = (showAllVideos ? videos : videos.slice(0,3)).map((v) => `<article class="video-card reveal"><button type="button" data-video="${v.id}" aria-label="Reproducir ${escape(v.title)}"><div class="video-poster"><img src="${escape(v.poster)}" alt="${escape(v.title)}" width="720" height="1280" loading="lazy"><span class="play-icon" aria-hidden="true"></span><span class="video-duration">${duration(v.duration)}</span><span class="video-label">VER VIDEO</span></div><h3>${escape(v.title)}</h3></button></article>`).join('');
    $('#show-videos').hidden = showAllVideos;
    observe($('#video-grid'));
  }
  $('.filters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    currentFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    renderProjects();
  });
  $('#show-projects').addEventListener('click', () => { showAllProjects = true; renderProjects(); });
  $('#show-videos').addEventListener('click', () => { showAllVideos = true; renderVideos(); });
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Abrir menú'); nav.classList.remove('is-open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href')));
  let navFramePending = false;
  function updateCurrentSection() {
    const threshold = Math.min(window.innerHeight * .35, 240);
    const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= threshold) || sections[0];
    sectionLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    navFramePending = false;
  }
  window.addEventListener('scroll', () => {
    if (!navFramePending) { navFramePending = true; requestAnimationFrame(updateCurrentSection); }
  }, {passive:true});
  window.addEventListener('resize', updateCurrentSection);
  updateCurrentSection();

  const dialog = $('#portfolio-dialog'), body = $('#dialog-body');
  let activeProject = null, activeIndex = 0, mode = '', opener = null;
  function showDialog(title, category, from) {
    $('#dialog-title').textContent = title; $('#dialog-category').textContent = category;
    if (!dialog.open) { opener = from; dialog.showModal(); document.body.classList.add('modal-open'); }
  }
  function showAlbum(project, from) {
    activeProject = project; mode = 'album';
    showDialog(project.title, `${project.category} · ${project.images.length} fotografías`, from);
    body.innerHTML = `<div class="album-grid">${project.images.map((image,index) => `<button class="album-image" type="button" data-photo="${index}" aria-label="Ampliar fotografía ${index+1} de ${project.images.length}"><img src="${escape(image.src)}" alt="${escape(image.alt || `${project.title}, fotografía ${index+1}`)}" width="${image.width}" height="${image.height}" loading="lazy"></button>`).join('')}</div>`;
    dialog.scrollTop = 0;
  }
  function showPhoto(index) {
    mode = 'photo'; activeIndex = (index + activeProject.images.length) % activeProject.images.length;
    const image = activeProject.images[activeIndex];
    body.innerHTML = `<div class="photo-viewer"><div class="viewer-tools"><button type="button" data-album>Volver a la galería</button><span aria-live="polite">${activeIndex+1} / ${activeProject.images.length}</span></div><figure><img src="${escape(image.src)}" alt="${escape(image.alt || activeProject.title)}" width="${image.width}" height="${image.height}"><figcaption>${escape(image.alt || activeProject.title)}</figcaption></figure><div class="viewer-navigation"><button type="button" data-prev>Anterior</button><button type="button" data-next>Siguiente</button></div></div>`;
    dialog.scrollTop = 0;
  }
  function showVideo(video, from) {
    activeProject = null; mode = 'video';
    showDialog(video.title, `AUDIOVISUAL · ${duration(video.duration)}`, from);
    body.innerHTML = `<div class="video-viewer"><video controls playsinline preload="metadata" poster="${escape(video.poster)}"><source src="${escape(video.src)}" type="video/mp4">Tu navegador no puede reproducir este video.</video><p>${escape(video.description || '')}</p></div>`;
    const player = body.querySelector('video'); player.play().catch(() => {});
  }
  $('#project-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-project]');
    if (button) showAlbum(projects.find((p) => p.id === button.dataset.project), button);
  });
  $('#video-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-video]');
    if (button) showVideo(videos.find((v) => String(v.id) === button.dataset.video), button);
  });
  body.addEventListener('click', (event) => {
    const photo = event.target.closest('[data-photo]');
    if (photo) { showPhoto(Number(photo.dataset.photo)); body.querySelector('[data-album]').focus(); }
    else if (event.target.closest('[data-prev]')) { showPhoto(activeIndex-1); body.querySelector('[data-prev]').focus(); }
    else if (event.target.closest('[data-next]')) { showPhoto(activeIndex+1); body.querySelector('[data-next]').focus(); }
    else if (event.target.closest('[data-album]')) { showAlbum(activeProject); body.querySelector('[data-photo]').focus(); }
  });
  dialog.addEventListener('keydown', (event) => {
    if (mode !== 'photo') return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1)); body.querySelector('[data-album]').focus(); }
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { body.querySelector('video')?.pause(); body.innerHTML = ''; activeProject = null; mode = ''; document.body.classList.remove('modal-open'); opener?.focus(); });
  renderProjects(); renderVideos(); observe();
})();
