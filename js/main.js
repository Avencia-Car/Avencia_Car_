// Sélection des éléments DOM
const mainContent = document.getElementById('mainContent');
const homeLink = document.getElementById('homeLink');
const floatBtn = document.getElementById('floatBtn');
const socialMenu = document.getElementById('socialMenu');

// État du menu social
let isSocialMenuOpen = false;

// Fonction pour rediriger vers la page de détails
function goToDetails(category, index) {
  const vehicle = vehiclesData[category][index];
  sessionStorage.setItem('selectedVehicle', JSON.stringify({
    model: vehicle.model,
    sub: vehicle.sub,
    make: vehicle.make,
    price: vehicle.price,
    image: vehicle.image,
    category: category
  }));
  window.location.href = 'detail.html';
}

// Fonction pour générer les cartes de véhicules
function generateVehicleCards(vehicles, category) {
  if (!vehicles || vehicles.length === 0) {
    return `<div class="no-vehicles">Aucun véhicule disponible dans cette catégorie.</div>`;
  }
  
  return `
    <div class="vehicle-grid">
      ${vehicles.map((vehicle, index) => `
        <div class="vehicle-card">
          <div class="card-img">
            <img src="${vehicle.image}" alt="${vehicle.model}" loading="lazy">
          </div>
          <div class="card-info">
            <div class="car-model">${vehicle.model}</div>
            <div class="car-sub">${vehicle.sub}</div>
            <div class="car-make">${vehicle.make}</div>
            <div class="price">
              ${vehicle.price} DH/ jour
              <span>Assurance incluse</span>
            </div>
            <button class="details-btn" onclick="goToDetails('${category}', ${index})">Détails</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Fonction pour afficher toutes les catégories
function displayAllCategories() {
  let html = '';
  
  for (const [category, vehicles] of Object.entries(vehiclesData)) {
    if (vehicles && vehicles.length > 0) {
      html += `
        <section id="category-${category}" class="category-section">
          <h2 class="category-title">
            <i class="fas fa-car"></i>
            ${category}
          </h2>
          ${generateVehicleCards(vehicles, category)}
        </section>
      `;
    }
  }
  
  if (html === '') {
    html = '<div class="loading">Aucun véhicule disponible pour le moment.</div>';
  }
  
  mainContent.innerHTML = html;
}

// Fonction pour afficher une catégorie spécifique
function displayCategory(categoryName) {
  const vehicles = vehiclesData[categoryName];
  
  if (!vehicles || vehicles.length === 0) {
    mainContent.innerHTML = `
      <div class="category-section">
        <h2 class="category-title">
          <i class="fas fa-car"></i>
          ${categoryName}
        </h2>
        <div class="no-vehicles">Aucun véhicule disponible dans cette catégorie.</div>
      </div>
    `;
    return;
  }
  
  mainContent.innerHTML = `
    <div class="category-section">
      <h2 class="category-title">
        <i class="fas fa-car"></i>
        ${categoryName}
      </h2>
      ${generateVehicleCards(vehicles, categoryName)}
    </div>
  `;
}

// Gestion du clic sur les liens de navigation
document.querySelectorAll('.nav-link[data-category]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = link.getAttribute('data-category');
    displayCategory(category);
    
    // Scroll en haut de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mise à jour de l'URL sans rechargement
    history.pushState({ category }, '', `#category-${category}`);
  });
});

// Gestion du bouton Accueil
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  displayAllCategories();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({ home: true }, '', '#');
});

// Gestion du menu social flottant
floatBtn.addEventListener('click', () => {
  isSocialMenuOpen = !isSocialMenuOpen;
  
  if (isSocialMenuOpen) {
    socialMenu.classList.add('active');
    floatBtn.classList.add('active');
  } else {
    socialMenu.classList.remove('active');
    floatBtn.classList.remove('active');
  }
});

// Fermer le menu social en cliquant ailleurs
document.addEventListener('click', (e) => {
  if (!floatBtn.contains(e.target) && !socialMenu.contains(e.target) && isSocialMenuOpen) {
    isSocialMenuOpen = false;
    socialMenu.classList.remove('active');
    floatBtn.classList.remove('active');
  }
});

// Gestion de la navigation avec les touches du navigateur
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.category) {
    displayCategory(event.state.category);
  } else {
    displayAllCategories();
  }
});

// Gestion du scroll pour l'activation des liens de navigation actifs
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.category-section');
  const navLinks = document.querySelectorAll('.nav-link[data-category]');
  
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 150) {
      currentSection = section.getAttribute('id')?.replace('category-', '');
    }
  });
  
  navLinks.forEach(link => {
    const category = link.getAttribute('data-category');
    if (currentSection === category) {
      link.style.background = 'rgba(255, 255, 255, 0.25)';
      link.style.color = 'white';
    } else {
      link.style.background = 'rgba(255, 255, 255, 0.05)';
      link.style.color = '#e0e0e0';
    }
  });
}

// Écouteur d'événement pour le scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateActiveNavLink, 100);
});

// Gestion des ancres au chargement
function handleInitialHash() {
  const hash = window.location.hash;
  if (hash && hash.includes('category-')) {
    const category = hash.replace('#category-', '');
    if (vehiclesData[category]) {
      displayCategory(category);
      return;
    }
  }
  displayAllCategories();
}

// Initialisation
handleInitialHash();

// Animation de chargement
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
      loadingDiv.style.opacity = '0';
      setTimeout(() => {
        if (loadingDiv.parentNode === mainContent) {
          // Déjà remplacé par le contenu
        }
      }, 300);
    }
  }, 500);
});


// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mainNav.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
      if (mainNav.classList.contains('active') && 
          !mainNav.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
});