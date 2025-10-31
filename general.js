    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        })
        .catch(err => console.error('Failed to load header:', err));

    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
        document.getElementById('footer-container').innerHTML = html;
        console.log('loading footer');
        })
        .catch(err => console.error('Failed to load footer:', err));
