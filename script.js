// ==========================================
// QR HUB v4.0
// Dashboard JavaScript
// Developed by SR Infinity
// ==========================================


// ==========================================
// WELCOME SCREEN
// ==========================================

window.addEventListener("load", function () {

    const welcome = document.getElementById("welcomeScreen");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (!welcome || !progressBar || !progressText) {
        return;
    }

    welcome.style.display = "flex";
    welcome.style.opacity = "1";

    let progress = 0;

    const loadingTimer = setInterval(function () {

        progress++;

        progressBar.style.width = progress + "%";

        let status = "";

        if (progress <= 25) {
            status = "Initializing QR Hub...";
        }
        else if (progress <= 50) {
            status = "Preparing Workspace...";
        }
        else if (progress <= 75) {
            status = "Loading Resources...";
        }
        else if (progress < 100) {
            status = "Almost Ready...";
        }
        else {
            status = "QR Hub Ready!";
        }

        const dots = ".".repeat((progress % 3) + 1);

        progressText.innerHTML = `
            <div class="loading-status">
                ${status}
            </div>

            <div class="loading-percent">
                Loading${dots} ${progress}%
            </div>
        `;

        if (progress >= 100) {

            clearInterval(loadingTimer);

            setTimeout(function () {

                welcome.classList.add("hideWelcome");

                setTimeout(function () {

                    welcome.style.display = "none";
                    welcome.classList.remove("hideWelcome");

                }, 300);

            }, 150);
        }

    }, 10);

});




// ==========================================
// QR HUB v4.0
// UNIFIED QR WORKSPACE
// Category Card → Same Workspace
// PC + MOBILE
// Auto Scroll
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const categoryCards =
        document.querySelectorAll(".category-card");

    const uploadPanel =
        document.querySelector(".upload-panel");


    // ------------------------------------------
    // Required elements check
    // ------------------------------------------

    if (!categoryCards.length || !uploadPanel) {
        console.warn("QR Hub: Category cards or upload panel not found.");
        return;
    }


    // ==========================================
    // WORKSPACE HEADER
    // ==========================================

    function workspaceHeader(title, description) {

        return `
            <div class="section-header">

                <div>

                    <h2>${title}</h2>

                    <p>${description}</p>

                </div>

            </div>
        `;
    }


    // ==========================================
    // PREVIEW BOX
    // ==========================================

    function previewBox() {

        return `

            <div class="preview-panel">

                <h3>Preview</h3>

                <div class="preview-box">

                    <div class="preview-placeholder">

                        <i class="fa-solid fa-qrcode"></i>

                        <p>
                            Your QR code will appear here
                        </p>

                    </div>

                </div>

                <div class="preview-actions">

                    <button
                        type="button"
                        class="secondary-btn">

                        Download

                    </button>

                    <button
                        type="button"
                        class="primary-btn">

                        Share

                    </button>

                </div>

            </div>

        `;
    }


    // ==========================================
    // IMAGE QR
    // ==========================================

    function showImageQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Image QR",
                "Upload an image to generate your QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-solid fa-cloud-arrow-up"></i>

                    </div>

                    <h3>Upload Image</h3>

                    <p>
                        Drag & Drop your image here
                    </p>

                    <span>or</span>

                    <button
                        type="button"
                        class="primary-btn choose-image-btn">

                        Choose File

                    </button>

                    <input
                        type="file"
                        class="image-file-input"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                    >

                    <small>
                        JPG, PNG or WEBP • Max 10MB
                    </small>

                </div>

                ${previewBox()}

            </div>
        `;


        const button =
            uploadPanel.querySelector(".choose-image-btn");

        const input =
            uploadPanel.querySelector(".image-file-input");


        if (button && input) {

            button.addEventListener("click", function () {

                input.click();

            });


            input.addEventListener("change", function () {

                if (!this.files.length) {
                    return;
                }


                const file = this.files[0];


                if (file.size > 10 * 1024 * 1024) {

                    alert("Maximum file size is 10MB.");

                    this.value = "";

                    return;
                }


                button.innerHTML = `

                    <i class="fa-solid fa-check"></i>

                    ${file.name}

                `;

            });

        }

    }


    // ==========================================
    // TEXT QR
    // ==========================================

    function showTextQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Text QR",
                "Enter your text and generate your QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-solid fa-font"></i>

                    </div>

                    <h3>Enter Your Text</h3>

                    <textarea
                        class="qr-text-input"
                        placeholder="Write your text here..."
                        rows="6"
                    ></textarea>

                    <button
                        type="button"
                        class="primary-btn generate-qr-btn">

                        Generate QR

                    </button>

                </div>

                ${previewBox()}

            </div>
        `;
    }


    // ==========================================
    // URL QR
    // ==========================================

    function showURLQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create URL QR",
                "Enter a website URL to generate your QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-solid fa-link"></i>

                    </div>

                    <h3>Website URL</h3>

                    <input
                        type="url"
                        class="qr-input"
                        placeholder="https://example.com"
                    >

                    <button
                        type="button"
                        class="primary-btn generate-qr-btn">

                        Generate QR

                    </button>

                </div>

                ${previewBox()}

            </div>
        `;
    }


    // ==========================================
    // WIFI QR
    // ==========================================

    function showWiFiQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create WiFi QR",
                "Share your WiFi network instantly"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-solid fa-wifi"></i>

                    </div>

                    <h3>WiFi Network</h3>

                    <input
                        type="text"
                        class="qr-input"
                        placeholder="WiFi Network Name"
                    >

                    <input
                        type="password"
                        class="qr-input"
                        placeholder="WiFi Password"
                    >

                    <select class="qr-input">

                        <option value="WPA">
                            WPA / WPA2
                        </option>

                        <option value="WEP">
                            WEP
                        </option>

                        <option value="nopass">
                            No Password
                        </option>

                    </select>

                    <button
                        type="button"
                        class="primary-btn generate-qr-btn">

                        Generate QR

                    </button>

                </div>

                ${previewBox()}

            </div>
        `;
    }


    // ==========================================
    // CONTACT QR
    // ==========================================

    function showContactQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Contact QR",
                "Share your contact information"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-regular fa-address-card"></i>

                    </div>

                    <h3>Contact Information</h3>

                    <input
                        type="text"
                        class="qr-input"
                        placeholder="Full Name"
                    >

                    <input
                        type="tel"
                        class="qr-input"
                        placeholder="Phone Number"
                    >

                    <input
                        type="email"
                        class="qr-input"
                        placeholder="Email Address"
                    >

                    <button
                        type="button"
                        class="primary-btn generate-qr-btn">

                        Generate QR

                    </button>

                </div>

                ${previewBox()}

            </div>
        `;
    }


    // ==========================================
    // LOCATION QR
    // ==========================================

    function showLocationQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Location QR",
                "Share a location using Google Maps"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <div class="upload-icon">

                        <i class="fa-solid fa-location-dot"></i>

                    </div>

                    <h3>Google Maps Location</h3>

                    <input
                        type="url"
                        class="qr-input"
                        placeholder="Google Maps URL"
                    >

                    <button
                        type="button"
                        class="primary-btn generate-qr-btn">

                        Generate QR

                    </button>

                </div>

                ${previewBox()}

            </div>
        `;
    }


    
  // ==========================================
// AUTO SCROLL + ATTENTION GLOW
// ==========================================

function scrollToWorkspace() {

    // আগের attention effect থাকলে remove
    uploadPanel.classList.remove("workspace-attention");

    // Animation আবার চালানোর জন্য reflow
    void uploadPanel.offsetWidth;

    // নতুন attention effect
    uploadPanel.classList.add("workspace-attention");


    setTimeout(function () {

        const rect =
            uploadPanel.getBoundingClientRect();

        const absoluteTop =
            window.pageYOffset + rect.top;

        const offset = 85;


        window.scrollTo({

            top: Math.max(
                0,
                absoluteTop - offset
            ),

            behavior: "smooth"

        });


    }, 80);


    // Glow শেষ হওয়ার পর class remove
    setTimeout(function () {

        uploadPanel.classList.remove(
            "workspace-attention"
        );

    }, 3200);

}


    

    // ==========================================
    // CATEGORY CLICK
    // ==========================================

    categoryCards.forEach(function (card) {

        card.addEventListener("click", function () {


            // ----------------------------------
            // Get title
            // ----------------------------------

            const titleElement =
                card.querySelector("h3");


            if (!titleElement) {
                return;
            }


            const optionName =
                titleElement.textContent.trim();


            // ----------------------------------
            // Active card
            // ----------------------------------

            categoryCards.forEach(function (item) {

                item.classList.remove("active");

            });


            card.classList.add("active");


            // ----------------------------------
            // Change workspace
            // ----------------------------------

            switch (optionName) {

                case "Image QR":

                    showImageQR();

                    break;


                case "Text QR":

                    showTextQR();

                    break;


                case "URL QR":

                    showURLQR();

                    break;


                case "WiFi QR":

                    showWiFiQR();

                    break;


                case "Contact QR":

                    showContactQR();

                    break;


                case "More":

                    /*
                     * More এখন Location QR দেখাবে।
                     * পরে এখানে আরও QR option যোগ করা যাবে।
                     */

                    showLocationQR();

                    break;


                default:

                    return;

            }


            // ----------------------------------
            // Auto Scroll
            // ----------------------------------

            scrollToWorkspace();

        });

    });


});






// ==========================================
// HERO → QR CATEGORIES ATTENTION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const createQRButton =
        document.querySelector(".hero-buttons .primary-btn");

    const qrCategories =
        document.querySelector(".qr-categories");


    if (!createQRButton || !qrCategories) {
        return;
    }


    createQRButton.addEventListener("click", function () {

        // Remove previous animation
        qrCategories.classList.remove(
            "categories-attention"
        );

        // Restart animation
        void qrCategories.offsetWidth;

        // Add attention effect
        qrCategories.classList.add(
            "categories-attention"
        );


        // ------------------------------
        // Smooth scroll
        // ------------------------------

        setTimeout(function () {

            const rect =
                qrCategories.getBoundingClientRect();

            const absoluteTop =
                window.pageYOffset + rect.top;

            const offset = 75;


            window.scrollTo({

                top: Math.max(
                    0,
                    absoluteTop - offset
                ),

                behavior: "smooth"

            });

        }, 80);


        // ------------------------------
        // Remove effect
        // ------------------------------

        setTimeout(function () {

            qrCategories.classList.remove(
                "categories-attention"
            );

        }, 3200);

    });

});




// ==========================================
// QR HUB v4.0
// SIDEBAR QR NAVIGATION
// FIXED VERSION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.querySelector(".sidebar");

    const uploadPanel =
        document.querySelector(".upload-panel");

    if (!sidebar || !uploadPanel) {
        return;
    }


    // ==========================================
    // SIDEBAR QR NAMES
    // ==========================================

    const qrTypes = [
        "Image QR",
        "Text QR",
        "URL QR",
        "WiFi QR",
        "Contact QR"
    ];


    // ==========================================
    // SIDEBAR LINKS
    // ==========================================

    const sidebarLinks =
        sidebar.querySelectorAll("nav a");


    // ==========================================
    // MAIN CATEGORY CARDS
    // ==========================================

    const categoryCards =
        document.querySelectorAll(".category-card");


    // ==========================================
    // SIDEBAR CLICK
    // ==========================================

    sidebarLinks.forEach(function (link) {

        const name =
            link.textContent.trim();


        // QR menu না হলে বাদ

        if (!qrTypes.includes(name)) {
            return;
        }


        link.addEventListener("click", function (event) {

            event.preventDefault();


            // ==================================
            // SIDEBAR ACTIVE
            // ==================================

            sidebarLinks.forEach(function (item) {

                if (
                    qrTypes.includes(
                        item.textContent.trim()
                    )
                ) {

                    item.classList.remove(
                        "qr-sidebar-active"
                    );

                }

            });


            link.classList.add(
                "qr-sidebar-active"
            );


            // ==================================
            // FIND MATCHING CATEGORY CARD
            // ==================================

            let targetCard = null;


            categoryCards.forEach(function (card) {

                const title =
                    card.querySelector("h3");


                if (!title) {
                    return;
                }


                if (
                    title.textContent.trim() ===
                    name
                ) {

                    targetCard = card;

                }

            });


            // ==================================
            // CARD FOUND
            // ==================================

            if (!targetCard) {

                console.warn(
                    "Category card not found:",
                    name
                );

                return;

            }


            // ==================================
            // CLICK CATEGORY CARD
            // ==================================

            targetCard.click();


            // ==================================
            // SCROLL TO WORKSPACE
            // ==================================

            setTimeout(function () {

                const rect =
                    uploadPanel.getBoundingClientRect();


                const absoluteTop =
                    window.pageYOffset +
                    rect.top;


                const offset = 85;


                window.scrollTo({

                    top:
                        Math.max(
                            0,
                            absoluteTop - offset
                        ),

                    behavior: "smooth"

                });


            }, 250);


            // ==================================
            // RGB ATTENTION
            // ==================================

            setTimeout(function () {

                uploadPanel.classList.remove(
                    "workspace-attention"
                );


                void uploadPanel.offsetWidth;


                uploadPanel.classList.add(
                    "workspace-attention"
                );


            }, 500);

        });

    });

});





// ==========================================
// MOBILE SIDEBAR
// QR HUB v4.0
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (!menuBtn || !sidebar) {
        return;
    }


    // ==========================================
    // CREATE MOBILE OVERLAY
    // ==========================================

    let sidebarOverlay =
        document.querySelector(".sidebar-overlay");


    if (!sidebarOverlay) {

        sidebarOverlay =
            document.createElement("div");

        sidebarOverlay.className =
            "sidebar-overlay";

        document.body.appendChild(
            sidebarOverlay
        );

    }


    // ==========================================
    // OPEN SIDEBAR
    // ==========================================

    function openSidebar() {

        sidebar.classList.add(
            "mobile-sidebar-open"
        );

        sidebarOverlay.classList.add(
            "sidebar-overlay-show"
        );

        document.body.classList.add(
            "sidebar-open"
        );

    }


    // ==========================================
    // CLOSE SIDEBAR
    // ==========================================

    function closeSidebar() {

        sidebar.classList.remove(
            "mobile-sidebar-open"
        );

        sidebarOverlay.classList.remove(
            "sidebar-overlay-show"
        );

        document.body.classList.remove(
            "sidebar-open"
        );

    }


    // ==========================================
    // MENU BUTTON
    // ==========================================

    menuBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (
                sidebar.classList.contains(
                    "mobile-sidebar-open"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );


    // ==========================================
    // CLICK OUTSIDE SIDEBAR
    // ==========================================

    sidebarOverlay.addEventListener(
        "click",
        function () {

            closeSidebar();

        }
    );


    // ==========================================
    // SIDEBAR LINKS
    // ==========================================

    sidebar.addEventListener(
        "click",
        function (event) {

            const link =
                event.target.closest("a");

            if (!link) {
                return;
            }


            // QR option click হওয়ার পর
            // Sidebar বন্ধ হবে

            setTimeout(function () {

                if (
                    window.innerWidth <= 768
                ) {

                    closeSidebar();

                }

            }, 300);

        }
    );


    // ==========================================
    // RESIZE
    // ==========================================

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768
            ) {

                closeSidebar();

            }

        }
    );

});




// ==========================================
// QR HUB PREMIUM DARK MODE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const darkModeSwitch =
        document.querySelector(".dark-mode input[type='checkbox']");

    if (!darkModeSwitch) {
        return;
    }


    // ------------------------------------------
    // Load saved mode
    // ------------------------------------------

    const savedMode =
        localStorage.getItem("qrHubDarkMode");


    if (savedMode === "enabled") {

        document.body.classList.add("qr-dark-mode");

        darkModeSwitch.checked = true;

    } else {

        document.body.classList.remove("qr-dark-mode");

        darkModeSwitch.checked = false;

    }


    // ------------------------------------------
    // Toggle Dark Mode
    // ------------------------------------------

    darkModeSwitch.addEventListener("change", function () {

        if (this.checked) {

            document.body.classList.add("qr-dark-mode");

            localStorage.setItem(
                "qrHubDarkMode",
                "enabled"
            );

        } else {

            document.body.classList.remove("qr-dark-mode");

            localStorage.setItem(
                "qrHubDarkMode",
                "disabled"
            );

        }

    });

});
