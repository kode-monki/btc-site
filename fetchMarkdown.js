  // Fetch the markdown file
fetch(markdownFile)
  .then(response => {
    if (!response.ok) throw new Error('Failed to load markdown');
    return response.text();
  })
  .then(markdown => {
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = marked.parse(markdown);

    // Assign IDs + anchor links
    const headers = contentEl.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const id = header.textContent.trim().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      header.id = id;

      const anchor = document.createElement('a');
      anchor.href = `#${id}`;
      anchor.className = 'header-anchor';
      anchor.textContent = '🔗';
      anchor.style.marginLeft = '0.5rem';
      anchor.style.textDecoration = 'none';
      anchor.style.opacity = '0.4';
      anchor.style.fontSize = '0.8em';
      header.appendChild(anchor);
    });

    // Wait for DOM paint before sidebar & scroll setup
    setTimeout(() => {
      const sidebar = document.getElementById('sidebar');
      sidebar.innerHTML = '';
      const headers = contentEl.querySelectorAll('h1, h2, h3, h4');

      headers.forEach(header => {
        const id = header.id;
        const link = document.createElement('a');
        if (header.tagName === 'H1') link.style.fontWeight = 'bold';
        link.href = `#${id}`;
        link.textContent = header.textContent.replace('🔗', '').trim();
        link.style.display = 'block';
        link.style.paddingLeft = `${(parseInt(header.tagName[1]) - 1) * 10}px`;
        sidebar.appendChild(link);
      });

      // Smooth scroll on click
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const id = link.getAttribute('href').substring(1);
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${id}`);
          }
        });
      });

      // ✅ Handle direct hash load AFTER markdown + headers are ready
      if (window.location.hash) {
        const id = decodeURIComponent(window.location.hash.substring(1));
        const target = document.getElementById(id);
        if (target) {
          // Delay slightly to ensure layout is stable
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
          }, 100);
        }
      }
    }, 300);
  })
  .catch(err => {
    document.getElementById('content').innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  });