document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. CUSTOM MAGNETIC CURSOR (OPTIMIZED)
       ========================================= */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const magnetics = document.querySelectorAll('.magnetic');

    if (cursorDot && cursorRing) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateRing);
        }
        animateRing();

        magnetics.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            elem.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* =========================================
       2. THEME TOGGLE (CREAM / INK)
       ========================================= */
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    function updateThemeButtonText(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'ink' ? 'Vibe Ink' : 'Vibe Cream';
        }
    }

    // Initialize button text on page load based on current theme
    const initialTheme = htmlElement.getAttribute('data-theme') || 'ink';
    updateThemeButtonText(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'ink' ? 'cream' : 'ink';
            htmlElement.setAttribute('data-theme', newTheme);
            updateThemeButtonText(newTheme);
        });
    }

    /* =========================================
       3. SCROLL PROGRESS BAR, REVEAL & NAV SYNC
       ========================================= */
    const progressBar = document.getElementById('progressBar');
    const reveals = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        if (progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        }

        // Scroll Reveal Animations
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });

        // Active Nav Link Highlighting on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    window.dispatchEvent(new Event('scroll'));

    /* =========================================
       4. PROJECT FILTERING
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* =========================================
       5. PROJECT CARDS: MODAL & 3D HOVER TILT
       ========================================= */
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTag = document.getElementById('modalTag');
    const modalSwatches = document.getElementById('modalSwatches');
    const modalImage = document.getElementById('modalImage');
    const modalLink = document.getElementById('modalLink'); 
    const modalContent = document.querySelector('.modal-content');
    const scrollIndicator = document.getElementById('modalScrollIndicator');

    // Smart function to check if the card actually needs scrolling and if user reached bottom
    function updateScrollIndicator() {
        if (!modalContent || !scrollIndicator) return;

        const isScrollable = modalContent.scrollHeight > modalContent.clientHeight;
        const isAtBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight - 20;

        if (!isScrollable || isAtBottom) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }

    if (modalContent && scrollIndicator) {
        modalContent.addEventListener('scroll', updateScrollIndicator);

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                modalContent.scrollTop = 0; 
                setTimeout(updateScrollIndicator, 50); 
            });
        });

        window.addEventListener('resize', updateScrollIndicator);
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!modal) return;

            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-desc') || '';
            const tag = card.getAttribute('data-tag') || '';
            const linkUrl = card.getAttribute('data-link');
            const rawColors = card.getAttribute('data-colors');
            const colors = rawColors ? rawColors.split(',') : [];

            const dataImageSrc = card.getAttribute('data-image');
            const cardimg = card.querySelector('.project-image');
            const fallbackSrc = cardimg ? cardimg.src : '';
            const imageSrc = dataImageSrc ? dataImageSrc : fallbackSrc;

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalTag) modalTag.textContent = tag;
            if (modalImage && imageSrc) modalImage.src = imageSrc; 

            if (modalLink) {
                if (linkUrl && linkUrl.trim() !== '') {
                    modalLink.href = linkUrl;
                    modalLink.style.display = 'inline-block';
                } else {
                    modalLink.style.display = 'none';
                }
            }

            if (modalSwatches) {
                modalSwatches.innerHTML = '';
                colors.forEach(color => {
                    const swatch = document.createElement('div');
                    swatch.classList.add('swatch');
                    swatch.style.backgroundColor = color.trim();
                    modalSwatches.appendChild(swatch);
                });
            }

            modal.classList.add('active');
        });

        // 3D Hover Tilt (Perspective removed from JS to prevent grid glitches)
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease'; 
        });
    });

    if (modal) {
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    /* =========================================
       6. ACCORDION LOGIC
       ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            currentItem.classList.toggle('active');

            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });
        });
    });

    /* =========================================
       7. TOOL TICKER HOVER INFO
       ========================================= */
    const tickerItems = document.querySelectorAll('.ticker-item');
    const toolTipInfo = document.getElementById('toolTipInfo');
    
    if (toolTipInfo) {
        const originalTooltipText = toolTipInfo.textContent;

        tickerItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const info = item.getAttribute('data-info');
                if (info) {
                    toolTipInfo.textContent = info;
                    toolTipInfo.style.color = 'var(--orange)';
                }
            });

            item.addEventListener('mouseleave', () => {
                toolTipInfo.textContent = originalTooltipText;
                toolTipInfo.style.color = 'var(--text-muted)';
            });
        });
    }

    /* =========================================
       8. COPY EMAIL & TOAST NOTIFICATION
       ========================================= */
    const copyBtns = [document.getElementById('copyEmailBtn'), document.getElementById('copyEmailContact')];
    const toast = document.getElementById('toast');
    const myEmail = "chhorchonghaing@gmail.com"; 

    copyBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(myEmail).then(() => {
                        showToast('Email copied to clipboard!');
                    }).catch(() => {
                        fallbackCopyText(myEmail);
                    });
                } else {
                    fallbackCopyText(myEmail);
                }
            });
        }
    });

    function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast('Email copied to clipboard!');
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /* =========================================
       9. CONTACT FORM SUBMISSION
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            if (formFeedback) {
                formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                formFeedback.style.display = "block";
            }
            contactForm.reset();

            setTimeout(() => {
                if (formFeedback) formFeedback.style.display = "none";
            }, 5000);
        });
    }

    /* =========================================
       10. 3D IMAGE STACK CYCLING
       ========================================= */
    const imageStack = document.getElementById('imageStack');
    let isHoveringStack = false;
    
    function updateStack() {
        const glassCards = document.querySelectorAll('.glass-card');
        const totalCards = glassCards.length;
        if (totalCards === 0) return;

        const centerIndex = (totalCards - 1) / 2; 
        
        glassCards.forEach((card, index) => {
            const baseRotate = index === 0 ? 0 : (index % 2 === 0 ? 1 : -1) * (index * 5);
            const baseTranslateX = index * 4; 
            const baseTranslateY = index * 4;
            const baseScale = 1 - (index * 0.04);

            const offset = index - centerIndex; 
            const hoverTranslateX = offset * 110; 
            const hoverTranslateY = Math.abs(offset) * 15; 
            const hoverRotate = offset * 8; 
            const hoverScale = 1; 

            // Add translateZ(0) to the end of these two lines!
            card.dataset.baseTransform = `translate(${baseTranslateX}px, ${baseTranslateY}px) scale(${baseScale}) rotate(${baseRotate}deg) translateZ(0)`;
            card.dataset.hoverTransform = `translate(${hoverTranslateX}px, ${hoverTranslateY}px) scale(${hoverScale}) rotate(${hoverRotate}deg) translateZ(0)`;
            
            card.style.zIndex = totalCards - index;
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0s';
            card.style.transform = isHoveringStack ? card.dataset.hoverTransform : card.dataset.baseTransform;
        });
    }

    if (imageStack) {
        updateStack();

        imageStack.addEventListener('mouseenter', () => {
            isHoveringStack = true;
            updateStack();
        });

        imageStack.addEventListener('mouseleave', () => {
            isHoveringStack = false;
            updateStack();
        });

        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
            if (isHoveringStack) {
                // Add translateZ(0) to the end of this line too!
                card.style.transform = `${card.dataset.hoverTransform} translateY(-15px) scale(1.05) translateZ(0)`;
            }
            });
            card.addEventListener('mouseleave', () => {
                if (isHoveringStack) {
                    card.style.transform = card.dataset.hoverTransform;
                }
            });

            card.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                const cardsToMove = [];
                let current = imageStack.firstElementChild;
                while (current !== card && current !== null) {
                    cardsToMove.push(current);
                    current = current.nextElementSibling;
                }
                
                cardsToMove.forEach(c => imageStack.appendChild(c));
                updateStack();
            });
        });
    }

    // Select your draggable items and your drop slots
const draggables = document.querySelectorAll('.draggable');
const slots = document.querySelectorAll('.slot');

let activeItem = null;

draggables.forEach(draggable => {
  // Add touch event listeners. 
  // {passive: false} is required so we can use e.preventDefault() to stop screen scrolling
  draggable.addEventListener('touchstart', handleTouchStart, { passive: false });
  draggable.addEventListener('touchmove', handleTouchMove, { passive: false });
  draggable.addEventListener('touchend', handleTouchEnd);
});

function handleTouchStart(e) {
  activeItem = e.target;
  activeItem.classList.add('dragging'); // Optional: for styling
  
  // Prevent the screen from scrolling while the user is dragging
  document.body.style.overflow = 'hidden'; 
}

function handleTouchMove(e) {
  if (!activeItem) return;
  e.preventDefault(); // Stop default touch behaviors
  
  const touch = e.touches[0];
  
  // Detach the item and move it with the user's finger
  activeItem.style.position = 'fixed';
  activeItem.style.left = touch.clientX - (activeItem.offsetWidth / 2) + 'px';
  activeItem.style.top = touch.clientY - (activeItem.offsetHeight / 2) + 'px';
  activeItem.style.zIndex = '1000'; // Ensure it floats above other elements
}

function handleTouchEnd(e) {
  if (!activeItem) return;

  const touch = e.changedTouches[0];

  // 1. Temporarily hide the dragged item so we can "see" what is underneath it
  activeItem.style.display = 'none';
  
  // 2. Find out which element the finger is hovering over
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  
  // 3. Unhide the dragged item
  activeItem.style.display = 'block'; 

  // 4. Check if the element below is one of our slots
  const dropSlot = elementBelow ? elementBelow.closest('.slot') : null;

  if (dropSlot) {
    // Success: Append the item to the new slot
    dropSlot.appendChild(activeItem);
  }

  // Clean up styles to lock it into its new (or old) grid position
  activeItem.style.position = '';
  activeItem.style.left = '';
  activeItem.style.top = '';
  activeItem.style.zIndex = '';
  activeItem.classList.remove('dragging');
  
  activeItem = null;
  document.body.style.overflow = ''; // Re-enable screen scrolling
}
});