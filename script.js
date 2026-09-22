const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
const header = document.querySelector('[data-header]');
const dialogue = document.querySelector('[data-dialogue]');
const dialogueButton = document.querySelector('.dialogue-next');

const dialogueLines = [
  '数学像一片过分辽阔的天空。现在的我，正试着辨认其中最想追随的那条轨迹。',
  '从环与理想，到模与范畴——抽象并不是远离具体，而是在寻找事物共同的形状。',
  '这一页只是序章。答案还很远，但值得认真走过的问题，已经开始出现。',
];

let dialogueIndex = 0;
const savedScene = localStorage.getItem('xz-scene');
const legacyTheme = localStorage.getItem('xz-theme');

if (savedScene === 'night' || legacyTheme === 'dark') {
  root.dataset.theme = 'night';
}

const syncThemeButton = () => {
  const isNight = root.dataset.theme === 'night';
  if (themeButton) {
    themeButton.querySelector('span').textContent = isNight ? '☼' : '☾';
    themeButton.setAttribute('aria-label', isNight ? '切换到日间场景' : '切换到夜间场景');
    themeButton.title = isNight ? '切换到日间场景' : '切换到夜间场景';
  }
};

syncThemeButton();

themeButton?.addEventListener('click', () => {
  const nextScene = root.dataset.theme === 'night' ? 'day' : 'night';
  if (nextScene === 'night') {
    root.dataset.theme = 'night';
  } else {
    delete root.dataset.theme;
  }
  localStorage.setItem('xz-scene', nextScene);
  syncThemeButton();
});

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  navigation?.classList.toggle('open', willOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
});

window.addEventListener(
  'scroll',
  () => header?.classList.toggle('scrolled', window.scrollY > 32),
  { passive: true },
);

dialogueButton?.addEventListener('click', () => {
  dialogueIndex = (dialogueIndex + 1) % dialogueLines.length;
  dialogue.classList.add('changing');
  window.setTimeout(() => {
    dialogue.textContent = dialogueLines[dialogueIndex];
    dialogue.classList.remove('changing');
  }, 140);
});

const year = new Date().getFullYear();
document.querySelector('[data-year]').textContent = String(year);
document.querySelector('[data-year-short]').textContent = String(year).slice(-2);

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('visible'));
}

const sections = document.querySelectorAll('.chapter[id]');
const navLinks = navigation?.querySelectorAll('a') ?? [];
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px' },
  );
  sections.forEach((section) => sectionObserver.observe(section));
}
