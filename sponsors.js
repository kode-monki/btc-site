function displaySponsors(sponsors) {
    const container = document.getElementById('sponsor-list');
    console.log('in displaySponsors '+sponsors);

    sponsors.forEach(([year, name, logoUrl, sponsorUrl]) => {
      console.log(year);
      const sponsor = document.createElement('div');
      sponsor.className = 'sponsor-logos';
      sponsor.innerHTML = `
        <a href="${sponsorUrl}" target="_blank"><img src="${logoUrl}" alt="${name}"></a>
        `;
      container.appendChild(sponsor);
    });
  }