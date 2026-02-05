    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        })
        .catch(err => console.error('Failed to load header:', err));

   fetch('footer.html')
  .then(response => response.text())
  .then(html => {
    console.log('footer fetched, waiting 1s...');
    setTimeout(() => {
      document.getElementById('footer-container').innerHTML = html;
      console.log('footer injected');
    }, 1000); // 1000 ms = 1 second delay
  })
  .catch(err => console.error('Failed to load footer:', err));