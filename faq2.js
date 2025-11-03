document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, building FAQ...');
  await loadMarkdown();

  setTimeout(() => {
    initSearch();
    initScrollSpy();
    initSmoothScroll();
  }, 300);
});

async function loadMarkdown() {
  try {
    const res = await fetch('faq.md');
    if (!res.ok) throw new Error('Markdown file not found');
    const md = await res.text();
    const content = document.getElementById('faq-content');
    content.innerHTML = marked.parse(md);

    content.querySelectorAll('h1, h2').forEach(h => h.id = slugify(h.textContent));

    organizeSections(content);
    buildSidebar();
  } catch (err) {
    document.getElementById('faq-content').innerHTML = '<p>Error loading FAQ content.</p>';
    console.error(err);
  }
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

function organizeSections(content) {
  const nodes = Array.from(content.children);
  const organized = [];
  let currentSection = null;
  let currentSub = null;

  nodes.forEach(node => {
    if (node.tagName === 'H1') {
      currentSection = document.createElement('section');
      currentSection.id = slugify(node.textContent);
      currentSection.appendChild(node);
      organized.push(currentSection);
      currentSub = null;
    } else if (node.tagName === 'H2' && currentSection) {
      currentSub = document.createElement('div');
      currentSub.className = 'subsection';
      currentSub.id = slugify(node.textContent);
      currentSub.appendChild(node);
      currentSection.appendChild(currentSub);
    } else {
      if (currentSub) currentSub.appendChild(node);
      else if (currentSection) currentSection.appendChild(node);
      else organized.push(node);
    }
  });

  content.innerHTML = '';
  organized.forEach(el => content.appendChild(el));
}

function buildSidebar() {
  const sidebar = document.getElementById('menu');
  const headings = document.querySelectorAll('#faq-content h1, #faq-content h2');
  sidebar.innerHTML = '';

  let currentGroup = null;
  let list = null;

  headings.forEach(h => {
    const text = h.textContent;
    const id = slugify(text);
    h.id = id;

    if (h.tagName === 'H1') {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'menu-section';
      const h2title = document.createElement('h2');
      h2title.textContent = text;
      list = document.createElement('ul');
      list.className = 'active';
      sectionDiv.appendChild(h2title);
      sectionDiv.appendChild(list);
      sidebar.appendChild(sectionDiv);
      currentGroup = sectionDiv;
    } else if (h.tagName === 'H2' && currentGroup) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = text;
      li.appendChild(a);
      list.appendChild(li);
    }
  });

  document.querySelectorAll('#menu > .menu-section > h2').forEach(header => {
    header.addEventListener('click', () => {
      const ul = header.nextElementSibling;
      ul.classList.toggle('active');
    });
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('#menu a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const headerOffset = document.querySelector('#header-container')?.offsetHeight || 50;
        const elementTop = target.getBoundingClientRect().top + window.scrollY;
        const scrollTarget = elementTop - headerOffset;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        history.replaceState(null, '', '#' + targetId);
      }
    });
  });
}

function initScrollSpy() {
  const subsections = document.querySelectorAll('.subsection');
  const navLinks = document.querySelectorAll('.sidebar a');
  const sidebar = document.querySelector('.sidebar');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matchingLink = document.querySelector(`.sidebar a[href="#${id}"]`);
        if (matchingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');

          const parentUl = matchingLink.closest('ul');
          if (parentUl && !parentUl.classList.contains('active')) {
            parentUl.classList.add('active');
          }

          const sidebarRect = sidebar.getBoundingClientRect();
          const linkRect = matchingLink.getBoundingClientRect();
          const offset = linkRect.top - sidebarRect.top;
          if (offset < 50 || offset > sidebarRect.height - 50) {
            sidebar.scrollTo({
              top: sidebar.scrollTop + offset - sidebarRect.height / 2,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  }, { rootMargin: '-50px 0px -70% 0px', threshold: 0 });

  subsections.forEach(section => observer.observe(section));
}

function initSearch() {
  const search = document.getElementById('search');
  const links = document.querySelectorAll('.sidebar a');
  const sectionHeaders = document.querySelectorAll('.sidebar h2');
  const sections = document.querySelectorAll('main section');

  if (!search) return;

  search.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();

    links.forEach(link => {
      const match = link.textContent.toLowerCase().includes(term);
      link.parentElement.classList.toggle('hidden', term && !match);
    });

    sections.forEach(section => {
      const matchesInSection = [...section.querySelectorAll('h2')]
        .some(h => h.textContent.toLowerCase().includes(term));
      section.classList.toggle('hidden', term && !matchesInSection);
    });

    sectionHeaders.forEach(header => {
      const ul = header.nextElementSibling;
      const anyVisible = [...ul.querySelectorAll('li')].some(li => !li.classList.contains('hidden'));
      ul.classList.toggle('active', anyVisible || !term);
    });
  });
}
