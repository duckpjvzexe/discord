  (function () {
      const card = document.getElementById('profileCard');

      const supportsHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (supportsHover && !prefersReducedMotion) {
        const handleMove = e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;

          const dx = x - r.width / 2;
          const dy = y - r.height / 2;

          const rotateX = (dy / r.height) * 55;
          const rotateY = -(dx / r.width) * 55;

          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
          card.style.boxShadow = `0 16px 40px rgba(123,97,255,0.18)`;

          const percentX = (x / r.width) * 100;
          const percentY = (y / r.height) * 100;
          card.style.setProperty('--light-x', `${percentX}%`);
          card.style.setProperty('--light-y', `${percentY}%`);
        };

        const handleLeave = () => {
          card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
          card.style.boxShadow = '0 0 25px rgba(0,0,0,0.5)';
          card.style.setProperty('--light-x', `50%`);
          card.style.setProperty('--light-y', `50%`);
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
      } else {
        card.style.transform = 'none';
        card.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
        card.style.setProperty('--light-x', `50%`);
        card.style.setProperty('--light-y', `50%`);
      }

      document.addEventListener('contextmenu', event => event.preventDefault());
      document.addEventListener('keydown', function(event) {
          if (event.keyCode === 123) {
              event.preventDefault();
              return false;
          }
          if ((event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74))) {
              event.preventDefault();
              return false;
          }
          if (event.ctrlKey && event.keyCode === 85) {
              event.preventDefault();
              return false;
          }
      });

      const popup = document.getElementById('delayedPopup');
      const delayCountEl = document.getElementById('delayCount');
      const progressEl = document.getElementById('delayProgress');
      const cancelBtn = document.getElementById('cancelBtn');

      let countdownTimer = null;
      let progressTimer = null;
      let remaining = 0;
      let totalDelay = 5000;
      let startTime = 0;
      let pendingHref = null;
      let pendingTarget = null;
      let pendingRel = null;
      let pendingTitle = null;

      const linkSelector = '#profileCard a[href]';
      const links = document.querySelectorAll(linkSelector);

      function showPopup(href, target, rel, title) {
        if (!popup) return;
        pendingHref = href;
        pendingTarget = target || '_self';
        pendingRel = rel || '';
        pendingTitle = title || href;

        popup.removeAttribute('hidden');
        popup.classList.add('show');
        remaining = Math.ceil(totalDelay / 1000);
        delayCountEl.textContent = remaining.toString();

        progressEl.style.width = '0%';
        startTime = Date.now();

        function updateProgress() {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, (elapsed / totalDelay) * 100);
          progressEl.style.width = pct + '%';
          if (elapsed < totalDelay) {
            progressTimer = requestAnimationFrame(updateProgress);
          }
        }
        progressTimer = requestAnimationFrame(updateProgress);

        countdownTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const secsLeft = Math.max(0, Math.ceil((totalDelay - elapsed) / 1000));
          delayCountEl.textContent = secsLeft.toString();
        }, 150);

        setTimeout(() => {
          clearTimeoutsAndHide();
          navigateToPending();
        }, totalDelay);
      }

      function clearTimeoutsAndHide() {
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
        if (progressTimer) {
          cancelAnimationFrame(progressTimer);
          progressTimer = null;
        }
        if (popup) {
          popup.classList.remove('show');
          setTimeout(() => {
            popup.setAttribute('hidden', 'true');
          }, 220);
        }
      }

      function navigateToPending() {
        if (!pendingHref) return;
        try {
          if (pendingTarget === '_blank') {
            const features = '';
            window.open(pendingHref, '_blank', features);
          } else {
            window.location.href = pendingHref;
          }
        } catch (e) {
          window.location.href = pendingHref;
        } finally {
          pendingHref = null;
          pendingTarget = null;
          pendingRel = null;
          pendingTitle = null;
        }
      }

      function cancelPendingNavigation() {
        pendingHref = null;
        pendingTarget = null;
        pendingRel = null;
        pendingTitle = null;
        clearTimeoutsAndHide();
      }

      links.forEach(a => {
        a.addEventListener('click', function (ev) {
          if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          const href = a.getAttribute('href');
          const target = a.getAttribute('target') || '_self';
          const rel = a.getAttribute('rel') || '';
          const title = a.getAttribute('title') || a.textContent || href;
          showPopup(href, target, rel, title);
        });
      });

      cancelBtn.addEventListener('click', function () {
        cancelPendingNavigation();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          if (pendingHref) {
            cancelPendingNavigation();
          }
        }
      });

      window.addEventListener('beforeunload', function () {
        cancelPendingNavigation();
      });

      const observer = new MutationObserver(() => {
        if (popup && popup.classList.contains('show')) {
          cancelBtn.focus({ preventScroll: true });
        }
      });
      if (popup) observer.observe(popup, { attributes: true, attributeFilter: ['class'] });

    })();

// Floating dropdown
const dropdown = document.querySelector('.dropdown');
const dropdownBtn = document.querySelector('.dropdown-btn');

dropdownBtn.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

// Click ngoài để đóng
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});
