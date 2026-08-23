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

                }, 600);

            }, 500);
        }

    }, 25);

});


// ==========================================
// QR WORKSPACE
// Same Box Content Switching
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const categoryCards = document.querySelectorAll(".category-card");

    const uploadPanel = document.querySelector(".upload-panel");

    if (!categoryCards.length || !uploadPanel) {
        return;
    }


    // ------------------------------------------
    // Original Workspace
    // ------------------------------------------

    const originalWorkspace = uploadPanel.innerHTML;


    // ------------------------------------------
    // Workspace Header
    // ------------------------------------------

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


    // ------------------------------------------
    // Image QR
    // ------------------------------------------

    function imageQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Image QR",
                "Upload an image to generate your QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-solid fa-cloud-arrow-up"></i>

                    <p>Drag & Drop an image here</p>

                    <span>or</span>

                    <button class="primary-btn" type="button">
                        Choose File
                    </button>

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                    >

                    <div class="supported-files">
                        JPG • PNG • WEBP
                    </div>

                    <small>
                        Max. 10MB
                    </small>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                    <div class="preview-actions">

                        <button
                            class="secondary-btn"
                            type="button">
                            Download
                        </button>

                        <button
                            class="primary-btn"
                            type="button">
                            Share
                        </button>

                    </div>

                </div>

            </div>
        `;


        const chooseButton =
            uploadPanel.querySelector(".upload-box button");

        const fileInput =
            uploadPanel.querySelector("input[type='file']");


        chooseButton.addEventListener("click", function () {
            fileInput.click();
        });


        fileInput.addEventListener("change", function () {

            if (this.files.length > 0) {

                const file = this.files[0];

                if (file.size > 10 * 1024 * 1024) {

                    alert("Maximum file size is 10MB.");

                    this.value = "";

                    return;
                }

                chooseButton.textContent = file.name;
            }

        });

    }


    // ------------------------------------------
    // Text QR
    // ------------------------------------------

    function textQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Text QR",
                "Enter your text and generate a QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-solid fa-font"></i>

                    <textarea
                        class="qr-text-input"
                        placeholder="Write your text here..."
                        rows="6"
                    ></textarea>

                    <button
                        class="primary-btn generate-text-btn"
                        type="button">

                        Generate QR

                    </button>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                    <div class="preview-actions">

                        <button
                            class="secondary-btn"
                            type="button">
                            Download
                        </button>

                        <button
                            class="primary-btn"
                            type="button">
                            Share
                        </button>

                    </div>

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // URL QR
    // ------------------------------------------

    function urlQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create URL QR",
                "Enter a website address to generate a QR code"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-solid fa-link"></i>

                    <input
                        type="url"
                        class="qr-input"
                        placeholder="https://example.com"
                    >

                    <button
                        class="primary-btn"
                        type="button">

                        Generate QR

                    </button>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // WiFi QR
    // ------------------------------------------

    function wifiQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create WiFi QR",
                "Share your WiFi network easily"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-solid fa-wifi"></i>

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
                        class="primary-btn"
                        type="button">

                        Generate QR

                    </button>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // Contact QR
    // ------------------------------------------

    function contactQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Contact QR",
                "Share your contact information"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-regular fa-address-card"></i>

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
                        class="primary-btn"
                        type="button">

                        Generate QR

                    </button>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // Location QR
    // ------------------------------------------

    function locationQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Location QR",
                "Share a location or Google Maps link"
            )}

            <div class="upload-layout">

                <div class="upload-box">

                    <i class="fa-solid fa-location-dot"></i>

                    <input
                        type="text"
                        class="qr-input"
                        placeholder="Google Maps URL"
                    >

                    <button
                        class="primary-btn"
                        type="button">

                        Generate QR

                    </button>

                </div>


                <div class="preview-panel">

                    <h3>Preview</h3>

                    <div class="preview-box">

                        <div class="preview-placeholder">

                            <i class="fa-solid fa-qrcode"></i>

                            <p>
                                Your QR code will
                                appear here
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }


    // ==========================================
    // CATEGORY CLICK
    // ==========================================

    categoryCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const titleElement =
                card.querySelector("h3");

            if (!titleElement) {
                return;
            }

            const type =
                titleElement.textContent.trim();


            // Active card

            categoryCards.forEach(function (item) {
                item.classList.remove("active");
            });

            card.classList.add("active");


            // Change workspace

            switch (type) {

                case "Image QR":
                    imageQR();
                    break;

                case "Text QR":
                    textQR();
                    break;

                case "URL QR":
                    urlQR();
                    break;

                case "WiFi QR":
                    wifiQR();
                    break;

                case "Contact QR":
                    contactQR();
                    break;

                case "More":
                    originalWorkspace();
                    break;

            }

        });

    });

});






// ==========================================
// QR OPTION → WORKSPACE SWITCHING
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const qrOptions = document.querySelectorAll(".qr-option");
    const uploadPanel = document.querySelector(".upload-panel");

    if (!qrOptions.length || !uploadPanel) {
        return;
    }


    // ------------------------------------------
    // Workspace Header
    // ------------------------------------------

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


    // ------------------------------------------
    // IMAGE QR
    // ------------------------------------------

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

                </div>

            </div>
        `;


        const button =
            uploadPanel.querySelector(".choose-image-btn");

        const input =
            uploadPanel.querySelector(".image-file-input");


        button.addEventListener("click", function () {
            input.click();
        });


        input.addEventListener("change", function () {

            if (!this.files.length) return;

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


    // ------------------------------------------
    // TEXT QR
    // ------------------------------------------

    function showTextQR() {

        uploadPanel.innerHTML = `

            ${workspaceHeader(
                "Create Text QR",
                "Enter text and generate your QR code"
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

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // URL QR
    // ------------------------------------------

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

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // WIFI QR
    // ------------------------------------------

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

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // CONTACT QR
    // ------------------------------------------

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

                </div>

            </div>
        `;
    }


    // ------------------------------------------
    // LOCATION QR
    // ------------------------------------------

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

                </div>

            </div>
        `;
    }


    // ==========================================
    // OPTION CLICK
    // ==========================================

    qrOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            // Active state
            qrOptions.forEach(function (item) {
                item.classList.remove("active");
            });

            option.classList.add("active");


            // Option name
            const title =
                option.querySelector("h3");

            if (!title) return;

            const optionName =
                title.textContent.trim();


            // Change same workspace
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

                case "Location QR":
                    showLocationQR();
                    break;

                default:
                    break;
            }

        });

    });

});
