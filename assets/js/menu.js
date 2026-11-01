const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarPanel = document.getElementById('sidebar-panel');
const mobileBackdrop = document.getElementById('mobile-backdrop');

const openBtn = document.getElementById('mobile-menu-open');
const closeBtn = document.getElementById('mobile-menu-close');


// ==============================
// Open Sidebar
// ==============================
function openMenu() {
    mobileSidebar.classList.remove('invisible');

    setTimeout(() => {
        sidebarPanel.classList.remove('-translate-x-full');

        mobileBackdrop.classList.remove('opacity-0');
        mobileBackdrop.classList.add('opacity-100');
    }, 20);
}


// ==============================
// Close Sidebar
// ==============================
function closeMenu() {
    sidebarPanel.classList.add('-translate-x-full');

    mobileBackdrop.classList.remove('opacity-100');
    mobileBackdrop.classList.add('opacity-0');

    setTimeout(() => {
        mobileSidebar.classList.add('invisible');
    }, 300);
}


// ==============================
// Mobile Accordion
// ==============================
const megaToggles = document.querySelectorAll('.mobile-mega-toggle');

megaToggles.forEach(function (toggle) {

    toggle.addEventListener('click', function () {

        const currentContent = this.nextElementSibling;
        const currentArrow = this.querySelector('.accordion-arrow');

        const isOpen =
            currentContent.style.maxHeight &&
            currentContent.style.maxHeight !== '0px';


        // Close all other accordions
        megaToggles.forEach(function (otherToggle) {

            if (otherToggle !== toggle) {

                const otherContent =
                    otherToggle.nextElementSibling;

                const otherArrow =
                    otherToggle.querySelector('.accordion-arrow');


                otherContent.style.maxHeight = '0px';
                otherContent.style.marginTop = '0px';

                if (otherArrow) {
                    otherArrow.classList.remove('rotate-180');
                }
            }

        });


        // If current accordion is already open â†’ close it
        if (isOpen) {

            currentContent.style.maxHeight = '0px';
            currentContent.style.marginTop = '0px';

            currentArrow.classList.remove('rotate-180');

        }

        // Otherwise â†’ open it
        else {

            const marginTop = 16;

            currentContent.style.marginTop =
                marginTop + 'px';

            currentContent.style.maxHeight =
                (currentContent.scrollHeight + marginTop) + 'px';

            currentArrow.classList.add('rotate-180');
        }

    });

});


// ==============================
// Event Listeners
// ==============================
if (openBtn) {
    openBtn.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMenu);
}