document.addEventListener("DOMContentLoaded", () => {
    
    /* ================= 1. GESTION DU THÈME ================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ================= 2. MENU BURGER ================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }));
    }

    /* ================= 3. ANIMATION AU DÉFILEMENT ================= */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ================= 4. BOUTON RETOUR EN HAUT ================= */
    const backToTopBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ================= 5. LOGIQUE DES CAROUSELS ================= */
    function initCarousel(trackId, prevBtnClass, nextBtnClass) {
        const track = document.getElementById(trackId);
        if (!track) return; 

        const slides = Array.from(track.children);
        const nextButton = document.querySelector(nextBtnClass);
        const prevButton = document.querySelector(prevBtnClass);
        
        let currentIndex = 0;
        let slideWidth;
        let autoPlayInterval;

        function updateCarouselSize() {
            slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
            setTimeout(() => { track.style.transition = 'transform 0.5s ease-in-out'; }, 50);
        }

        function getVisibleSlidesCount() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function moveToSlide(index) {
            const maxIndex = slides.length - getVisibleSlidesCount();
            
            if (index < 0) currentIndex = maxIndex > 0 ? maxIndex : 0;
            else if (index > maxIndex) currentIndex = 0;
            else currentIndex = index;

            track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
        }

        nextButton.addEventListener('click', () => {
            moveToSlide(currentIndex + 1);
            resetAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            moveToSlide(currentIndex - 1);
            resetAutoPlay();
        });

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 4000); 
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', startAutoPlay);

        window.addEventListener('resize', updateCarouselSize);
        setTimeout(() => {
            updateCarouselSize();
            startAutoPlay();
        }, 100);
    }

    initCarousel('portfolio-track', '.prev-btn', '.next-btn');
    initCarousel('poulet-track', '.prev-btn-p', '.next-btn-p');

    /* ================= 6. LIGHTBOX (GALERIE PLEIN ÉCRAN) ================= */
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtnLb = document.querySelector(".prev-btn-lb");
    const nextBtnLb = document.querySelector(".next-btn-lb");
    
    if (lightbox) {
        let currentImages = [];
        let currentIndexLb = 0;

        // Fonction pour extraire l'URL propre (gère <img> et background-image)
        const getImageUrl = (el) => {
            if (el.tagName === 'IMG') return el.src;
            const bgImage = window.getComputedStyle(el).backgroundImage;
            // Extrait l'URL entre les guillemets de url("...")
            return bgImage.slice(4, -1).replace(/["']/g, ""); 
        };

        // Sélectionner toutes les images avec la classe .gallery-trigger
        const galleryItems = document.querySelectorAll('.gallery-trigger');
        
        galleryItems.forEach((item, index) => {
            // Remplir le tableau avec les URLs des images
            currentImages.push(getImageUrl(item));

            item.addEventListener('click', (e) => {
                currentIndexLb = index;
                showImage(currentIndexLb);
                lightbox.classList.add('show');
            });
        });

        function showImage(index) {
            // Logique de boucle infini (retour au début ou à la fin)
            if (index < 0) currentIndexLb = currentImages.length - 1;
            else if (index >= currentImages.length) currentIndexLb = 0;
            else currentIndexLb = index;
            
            lightboxImg.src = currentImages[currentIndexLb];
        }

        // Fermer la lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('show');
        });

        // Fermer si on clique dans le vide
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });

        // Navigation au clic
        prevBtnLb.addEventListener('click', () => showImage(currentIndexLb - 1));
        nextBtnLb.addEventListener('click', () => showImage(currentIndexLb + 1));

        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') lightbox.classList.remove('show');
            if (e.key === 'ArrowLeft') showImage(currentIndexLb - 1);
            if (e.key === 'ArrowRight') showImage(currentIndexLb + 1);
        });
    }
});