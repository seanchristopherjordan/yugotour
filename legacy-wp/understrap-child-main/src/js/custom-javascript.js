document.addEventListener('DOMContentLoaded', function() {

    // 1. SELECTORS
    const header = document.querySelector('.yugotour-header');
    const modal = document.querySelector('#yugo-modal');
    const triggers = document.querySelectorAll('.menu-trigger');
    const mainLinks = document.querySelectorAll('.main-links a');

    // 2. MASTER TOGGLE FUNCTION
    function toggleYugoMenu() {
        const isCurrentlyOpen = modal.classList.contains('is-open');
        const themePath = yugoData.theme_url + '/images/';

        if (!isCurrentlyOpen) {
            modal.classList.add('is-open');
            document.documentElement.classList.add('modal-active');
            document.body.classList.add('modal-active');
            triggers.forEach(t => t.classList.add('is-active'));

            mainLinks.forEach(link => {
                const imgName = link.getAttribute('data-img');
                if (imgName) {
                    const img = new Image();
                    img.src = themePath + imgName;
                }
            });
        } else {
            modal.classList.remove('is-open');
            document.documentElement.classList.remove('modal-active');
            document.body.classList.remove('modal-active');
            triggers.forEach(t => t.classList.remove('is-active'));
        }
    }

    // 3. ATTACH CLICK EVENTS TO HAMBURGER TRIGGERS
	// Explicitly excludes the booking modal close button
	triggers.forEach(trigger => {
		// Skip if this trigger is inside the booking modal close button
		if (trigger.closest('#bookingModalClose')) return;
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			toggleYugoMenu();
		});
	});

    // 4. UNIFIED SCROLL HANDLER
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavScroll();
                handleHeroLogoParallax();
                handleTourHeaderParallax();
                handleSpomentikParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // 5. NAV SCROLL REVEAL
    let lastScrollY = window.scrollY;
    const scrollThreshold = 10;

    function handleNavScroll() {
        if (document.body.classList.contains('modal-active')) return;

        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) return;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    }

    // 6. DESKTOP HOVER LOGIC — image crossfade on megamenu links
    // This is the original proven version — do not modify
    const layerA = document.getElementById('hover-a');
    const layerB = document.getElementById('hover-b');
    const themePath = yugoData.theme_url + '/images/';

    let activeLayer = null;
    let revertTimeout = null;

    if (layerA && layerB) {
        mainLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                clearTimeout(revertTimeout);
                const fileName = link.getAttribute('data-img');
                if (!fileName) return;

                const nextLayer = (activeLayer === layerA) ? layerB : layerA;
                nextLayer.style.backgroundImage = `url('${themePath}${fileName}')`;
                nextLayer.classList.add('is-active');

                if (activeLayer) activeLayer.classList.remove('is-active');
                activeLayer = nextLayer;
            });

            link.addEventListener('mouseleave', () => {
                revertTimeout = setTimeout(() => {
                    if (activeLayer) {
                        activeLayer.classList.remove('is-active');
                        activeLayer = null;
                    }
                }, 50);
            });
        });
    }

    // 7. HERO LOGO PARALLAX
    const logo = document.querySelector('.hero-logo-overlay');

    function handleHeroLogoParallax() {
        if (!logo) return;
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        logo.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
    }

    // 8. CITY LIST PAGE PARALLAX (Header Stack)
    const tourHeader = document.querySelector('.tour-header');
    const tourTitle = document.querySelector('.tour-title');
    const l2img = document.querySelector('.layer-2 img');
    const l3img = document.querySelector('.layer-3 img');
    const l4img = document.querySelector('.layer-4 img');

    function handleTourHeaderParallax() {
        if (!tourHeader) return;

        const y = window.scrollY;
        const isMobile = window.innerWidth < 992;

        if (y < 1200) {
            if (isMobile) {
                if (l2img)     l2img.style.transform    = `translate3d(0, ${y * 0.3}px, 0)`;
                if (tourTitle) tourTitle.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
                if (l3img)     l3img.style.transform    = `translate3d(0, ${y * 0.5}px, 0)`;
                if (l4img)     l4img.style.transform    = `translate3d(0, ${y * 0.7}px, 0)`;
            } else {
                if (tourTitle) tourTitle.style.transform = `translate3d(0, ${y * 0.31}px, 0)`;
                if (l2img)     l2img.style.transform    = `translate3d(0, ${y * 0.39}px, 0)`;
                if (l3img)     l3img.style.transform    = `translate3d(0, ${y * 0.6}px, 0)`;
            }
        }
    }

    // 9. TOUR LIST INTRO BACKGROUND PARALLAX
    // -----------------------------------------------------------------------
    // SCROLL SPEED SETTINGS — tweak these two values to adjust parallax rate
    // -----------------------------------------------------------------------
    const PARALLAX_SPEED_DESKTOP = -0.7;
    const PARALLAX_SPEED_MOBILE  = -0.9;
    // -----------------------------------------------------------------------

    const tourListSection = document.querySelector('#tour-list-intro');
    const tourListImage = document.querySelector('.tour-list-bg img');

    function applyTourListParallax() {
        if (!tourListSection || !tourListImage) return;

        const sectionRect = tourListSection.getBoundingClientRect();
        if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
            const isMobile = window.innerWidth < 992;
            const speed = isMobile ? PARALLAX_SPEED_MOBILE : PARALLAX_SPEED_DESKTOP;
            const moveAmount = sectionRect.top * speed;
            tourListImage.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
        }
    }

    // 10. SPOMENIK PARALLAX
    const spomenikSection = document.querySelector('#intro-section');
    const spomenikImage = document.querySelector('.spomenik-bg img');

    function handleSpomentikParallax() {
        if (!spomenikSection || !spomenikImage) return;

        const distance = window.scrollY - spomenikSection.offsetTop;
        const sectionHeight = spomenikSection.offsetHeight;
        const windowHeight = window.innerHeight;

        if (distance + windowHeight > 0 && distance < sectionHeight) {
            const scrollPercent = (distance + windowHeight) / (sectionHeight + windowHeight);
            const moveAmount = scrollPercent * 33;
            spomenikImage.style.transform = `translate3d(0, -${moveAmount}%, 0)`;
        }
    }

    // 11. TILE GRADIENT HEIGHT SYNC
    function syncTileGradients() {
        document.querySelectorAll('.tour-tile').forEach(tile => {
            const title = tile.querySelector('.tile-title');
            const gradient = tile.querySelector('.tile-gradient');
            if (!title || !gradient) return;

            const titleHeight = title.getBoundingClientRect().height;
            const titleTop = title.offsetTop;
            gradient.style.height = (titleTop + titleHeight * 1.3) + 'px';
        });
    }

    syncTileGradients();
    window.addEventListener('resize', syncTileGradients);

    // 12. YUGOTOUR SIMULATOR
    (function() {
        const steeringWrap = document.getElementById('simSteeringWrap');
        const soundBtn     = document.getElementById('simSoundBtn');
        const radio        = document.getElementById('simRadio');
        const horn         = document.getElementById('simHorn');

        if (!steeringWrap || !soundBtn || !radio || !horn) return;

        const themePath = yugoData.theme_url;
        let radioPlaying = false;

        steeringWrap.addEventListener('click', function() {
            horn.currentTime = 0;
            horn.play();
        });

        soundBtn.addEventListener('click', function() {
            if (!radioPlaying) {
                soundBtn.src = themePath + '/images/sound-on.webp';
                radio.play();
                radioPlaying = true;
            } else {
                soundBtn.src = themePath + '/images/sound-off.webp';
                radio.pause();
                radio.currentTime = 0;
                radioPlaying = false;
            }
        });
    })();

    // 13. BOOKING MODAL — iframe approach
    // iframe src is empty on load — set only on first open
    // This keeps Formidable JS off the page until the modal is opened
    (function() {
        const bookingModal  = document.getElementById('yugo-booking-modal');
        const bookingIframe = document.getElementById('yugo-booking-iframe');
        const closeBtn      = document.getElementById('bookingModalClose');
        const navModal      = document.getElementById('yugo-modal');
        const navTriggers   = document.querySelectorAll('.menu-trigger');

        if (!bookingModal) return;

        let iframeLoaded = false;

        // --- OPEN ---
        function openBookingModal() {
			// Close nav menu if open
			if (navModal && navModal.classList.contains('is-open')) {
				navModal.classList.remove('is-open');
				document.documentElement.classList.remove('modal-active');
				document.body.classList.remove('modal-active');
				navTriggers.forEach(t => t.classList.remove('is-active'));
			}

			// Lock scroll on both html and body before modal opens
			// This forces Chrome to remove the scrollbar gutter immediately
			document.documentElement.style.overflowY = 'hidden';
			document.body.style.overflowY = 'hidden';

			// Load iframe on first open only
			if (!iframeLoaded && bookingIframe) {
				bookingIframe.src = bookingIframe.getAttribute('data-src');
				iframeLoaded = true;
			}

    bookingModal.classList.add('is-open');
    document.body.classList.add('booking-modal-active');
    document.documentElement.classList.add('booking-modal-active');
}

        // --- CLOSE ---
        function closeBookingModal() {
			bookingModal.classList.remove('is-open');
			document.body.classList.remove('booking-modal-active');
			document.documentElement.classList.remove('booking-modal-active');

			// Restore scroll after modal closes
			document.documentElement.style.overflowY = '';
			document.body.style.overflowY = '';
		}

        // --- TRIGGER: Header desktop Book Now ---
        const headerBookNow = document.getElementById('headerBookNow');
        if (headerBookNow) {
            headerBookNow.addEventListener('click', function(e) {
                e.preventDefault();
                openBookingModal();
            });
        }

        // --- TRIGGER: Footer Book Now ---
        const footerBookNow = document.querySelector('.footer-book-now');
        if (footerBookNow) {
            footerBookNow.addEventListener('click', function(e) {
                e.preventDefault();
                openBookingModal();
            });
        }

        // --- TRIGGER: Megamenu Book Now ---
        const menuBookNow = document.getElementById('menuBookNow');
        if (menuBookNow) {
            menuBookNow.addEventListener('click', function(e) {
                e.preventDefault();
                openBookingModal();
            });
        }

		// --- TRIGGER: Book This Tour button on single tour pages ---
		// Button carries data-tour-id attribute from ACF field
		// Sets iframe src with tourID parameter before opening modal
		const bookThisTour = document.querySelector('.book-this-tour');
		if (bookThisTour) {
			bookThisTour.addEventListener('click', function(e) {
				e.preventDefault();
				const tourId = this.getAttribute('data-tour-id');
				const baseSrc = bookingIframe.getAttribute('data-src');
				// Always reload iframe with correct tour ID
				// even if iframe was previously loaded without one
				bookingIframe.src = baseSrc + '?tourID=' + tourId;
				iframeLoaded = true;
				openBookingModal();
    });
}


        // --- CLOSE BUTTON ---
        // The close button wrapper div is #bookingModalClose
        // The inner button has class .menu-trigger which section 3 also
        // listens to — so we target the inner button directly and use
        // stopPropagation to prevent section 3 from firing toggleYugoMenu()
        if (closeBtn) {
            // Listener on wrapper div
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeBookingModal();
            });

            // Listener on inner button — stopPropagation prevents
            // .menu-trigger handler in section 3 from intercepting
            const closeBtnInner = closeBtn.querySelector('button');
            if (closeBtnInner) {
                closeBtnInner.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeBookingModal();
                });
            }
        }

        // --- ESCAPE KEY ---
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bookingModal.classList.contains('is-open')) {
                closeBookingModal();
            }
        });

    })();

}); // End DOMContentLoaded