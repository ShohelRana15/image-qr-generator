// ==========================================
// QR HUB v4.0
// IMAGE QR - SUPABASE CORE
// ==========================================

const QRHUB_IMAGE_CONFIG = {
    supabaseUrl: "https://vbufbeaktxvcxfcskyhr.supabase.co",
    supabaseKey: "sb_publishable_HD8afj98r3io1rI-qRNVOw__JgSxR87",
    storageBucket: "images",

    qrWidth: 260,
    qrMargin: 2,
    qrErrorCorrection: "H"
};

let qrHubSupabase = null;

function initializeQRHubSupabase() {

    if (typeof supabase === "undefined") {

        console.error(
            "QR Hub: Supabase library is not loaded."
        );

        return false;
    }

    try {

        qrHubSupabase = supabase.createClient(
            QRHUB_IMAGE_CONFIG.supabaseUrl,
            QRHUB_IMAGE_CONFIG.supabaseKey
        );

        console.log(
            "QR Hub: Supabase initialized successfully."
        );

        return true;

    } catch (error) {

        console.error(
            "QR Hub: Supabase initialization failed.",
            error
        );

        return false;
    }
}




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

                <canvas
                    class="image-qr-canvas"
                    style="
                        display:none;
                        max-width:100%;
                        height:auto;
                        border-radius:12px;
                    "
                ></canvas>

            </div>


            <div class="preview-actions">

                <button
                    type="button"
                    class="secondary-btn image-download-btn">

                    Download

                </button>


                <button
                    type="button"
                    class="primary-btn image-share-btn">

                    Share

                </button>

            </div>

        </div>

    `;
}

    

    // ==========================================
// IMAGE QR
// FULL FUNCTION
// Upload + Drag & Drop + Supabase
// QR Generate + Download + Share
// ==========================================

function showImageQR() {

    uploadPanel.innerHTML = `

        ${workspaceHeader(
            "Create Image QR",
            "Upload an image to generate your QR code"
        )}


        <div class="upload-layout">


            <!-- ==================================
                 UPLOAD AREA
            ================================== -->

            <div class="upload-box image-upload-box">


                <div class="upload-icon">

                    <i class="fa-solid fa-cloud-arrow-up"></i>

                </div>


                <h3>
                    Upload Image
                </h3>


                <p>
                    Drag & Drop your image here
                </p>


                <span>
                    or
                </span>


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


                <div
                    class="image-upload-status"
                    style="
                        margin-top:12px;
                        font-size:13px;
                        text-align:center;
                    "
                ></div>


            </div>


            <!-- ==================================
                 PREVIEW
            ================================== -->

            ${previewBox()}


        </div>

    `;


    // ==========================================
    // ELEMENTS
    // ==========================================

    const uploadBox =
        uploadPanel.querySelector(
            ".image-upload-box"
        );

    const uploadLayout =
    uploadPanel.querySelector(".upload-layout");

const previewPanel =
    uploadPanel.querySelector(".preview-panel");

const previewActions =
    uploadPanel.querySelector(".preview-actions");


    const chooseButton =
        uploadPanel.querySelector(
            ".choose-image-btn"
        );


    const input =
        uploadPanel.querySelector(
            ".image-file-input"
        );


    const status =
        uploadPanel.querySelector(
            ".image-upload-status"
        );


    const canvas =
        uploadPanel.querySelector(
            ".image-qr-canvas"
        );


    const placeholder =
        uploadPanel.querySelector(
            ".preview-placeholder"
        );


    const downloadButton =
        uploadPanel.querySelector(
            ".image-download-btn"
        );


    const shareButton =
        uploadPanel.querySelector(
            ".image-share-btn"
        );


    // ==========================================
    // CURRENT IMAGE URL
    // ==========================================

    let currentImageURL = "";


    // ==========================================
    // VALIDATE IMAGE
    // ==========================================

    function validateImage(file) {

        if (!file) {

            return false;

        }


        // File type

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            status.innerHTML =
                "❌ Only JPG, PNG or WEBP images are allowed.";

            status.style.color = "red";

            return false;

        }


        // 10MB limit

        if (
            file.size >
            10 * 1024 * 1024
        ) {

            status.innerHTML =
                "❌ Maximum file size is 10MB.";

            status.style.color = "red";

            return false;

        }


        return true;

    }


    // ==========================================
    // PROCESS IMAGE
    // ==========================================

   async function processImage(file) {

    if (!validateImage(file)) {
        return;
    }

    // Move status message below Preview
    previewPanel.appendChild(status);

    // Activate full-width crop mode
    uploadLayout.classList.add("image-crop-mode");

    chooseButton.innerHTML = `
        <i class="fa-solid fa-check"></i>
        ${file.name}
    `;

    const previewBoxElement =
        uploadPanel.querySelector(".preview-box");

    status.innerHTML =
        "✂️ Adjust the crop area, then click Crop & Generate QR.";
    status.style.color = "#2563eb";

    chooseButton.disabled = true;

    // Remove old cropper if exists
    if (window.qrHubCropper) {
        window.qrHubCropper.destroy();
        window.qrHubCropper = null;
    }

    // Create temporary image URL
    const imageURL = URL.createObjectURL(file);

    // Hide QR canvas
    canvas.style.display = "none";
    placeholder.style.display = "none";

    // Create crop area
    const cropWrapper = document.createElement("div");
    cropWrapper.className = "image-crop-wrapper";

    cropWrapper.innerHTML = `
        <img
            class="image-crop-target"
            src="${imageURL}"
            alt="Crop image"
            style="
                display:block;
                max-width:100%;
                width:100%;
            "
        >
    `;

    previewBoxElement.appendChild(cropWrapper);

    // Crop buttons
    const cropButtons = document.createElement("div");

    cropButtons.className = "crop-action-buttons";

    cropButtons.innerHTML = `
        <button
            type="button"
            class="secondary-btn crop-cancel-btn"
        >
            Cancel
        </button>

        <button
            type="button"
            class="primary-btn crop-confirm-btn"
        >
            Crop & Generate QR
        </button>
    `;

    previewBoxElement.appendChild(cropButtons);

    const cropImage =
        cropWrapper.querySelector(".image-crop-target");

    const cancelButton =
        cropButtons.querySelector(".crop-cancel-btn");

    const confirmButton =
        cropButtons.querySelector(".crop-confirm-btn");

    // Initialize Cropper
    window.qrHubCropper = new Cropper(cropImage, {

        aspectRatio: NaN,

        viewMode: 1,

        autoCropArea: 0.8,

        responsive: true,

        background: false,

        movable: true,

        zoomable: true,

        cropBoxMovable: true,

        cropBoxResizable: true
    });

    // CANCEL
    cancelButton.addEventListener("click", function () {

        if (window.qrHubCropper) {
            window.qrHubCropper.destroy();
            window.qrHubCropper = null;
        }

        URL.revokeObjectURL(imageURL);
        // Restore original upload layout
        uploadBox.appendChild(status);
        uploadLayout.classList.remove("image-crop-mode");

        cropWrapper.remove();
        cropButtons.remove();

        placeholder.style.display = "block";
        canvas.style.display = "none";

        chooseButton.innerHTML = `
            <i class="fa-solid fa-upload"></i>
            Choose Image
        `;

        status.innerHTML = "";

        chooseButton.disabled = false;
    });

    // CONFIRM CROP
    confirmButton.addEventListener("click", async function () {

        if (!window.qrHubCropper) {
            return;
        }

        confirmButton.disabled = true;
        cancelButton.disabled = true;

        status.innerHTML = "✂️ Cropping image...";
        status.style.color = "#2563eb";

        try {

            const croppedCanvas =
                window.qrHubCropper.getCroppedCanvas({
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: "high"
                });

            const croppedBlob =
                await new Promise((resolve, reject) => {

                    croppedCanvas.toBlob(
                        function (blob) {

                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(
                                    new Error(
                                        "Could not create cropped image."
                                    )
                                );
                            }

                        },
                        "image/png",
                        1
                    );
                });

            const croppedFile = new File(
                [croppedBlob],
                `cropped_${Date.now()}.png`,
                {
                    type: "image/png"
                }
            );

            // Destroy Cropper
            window.qrHubCropper.destroy();
            window.qrHubCropper = null;

            URL.revokeObjectURL(imageURL);

            cropWrapper.remove();
            cropButtons.remove();

            status.innerHTML =
                "⬆️ Uploading cropped image...";
            status.style.color = "#2563eb";

            // Upload cropped image to existing Supabase helper
            const publicURL =
                await uploadQRHubImageToSupabase(croppedFile);

            if (!publicURL) {
                throw new Error(
                    "Image URL was not generated."
                );
            }

            currentImageURL = publicURL;

            // Generate QR
            await QRCode.toCanvas(
                canvas,
                currentImageURL,
                {
                    width: 260,
                    margin: 2,
                    errorCorrectionLevel: "H",
                    color: {
                        dark: "#000000",
                        light: "#ffffff"
                    }
                }
            );

            placeholder.style.display = "none";
            canvas.style.display = "block";

            status.innerHTML =
                "✅ Cropped image QR generated successfully.";
            status.style.color = "green";

            uploadBox.classList.add(
                "image-upload-success"
            );

        }
        catch (error) {

            console.error(
                "Image Crop/QR Error:",
                error
            );

            status.innerHTML =
                "❌ " +
                (error.message ||
                    "Image processing failed.");

            status.style.color = "red";

            currentImageURL = "";
        }

        finally {

            chooseButton.disabled = false;

            confirmButton.disabled = false;
            cancelButton.disabled = false;
        }
    });
}


    

    // ==========================================
    // CHOOSE FILE
    // ==========================================

    chooseButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            input.click();

        }
    );


    // ==========================================
    // FILE INPUT CHANGE
    // ==========================================

    input.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            processImage(file);

        }
    );


    // ==========================================
    // CLICK UPLOAD BOX
    // ==========================================

    uploadBox.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".choose-image-btn"
                )
            ) {

                return;

            }


            input.click();

        }
    );


    // ==========================================
    // DRAG OVER
    // ==========================================

    uploadBox.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            uploadBox.classList.add(
                "drag-over"
            );


            status.innerHTML =
                "📂 Drop your image here";


            status.style.color =
                "#2563eb";

        }
    );


    // ==========================================
    // DRAG ENTER
    // ==========================================

    uploadBox.addEventListener(
        "dragenter",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            uploadBox.classList.add(
                "drag-over"
            );

        }
    );


    // ==========================================
    // DRAG LEAVE
    // ==========================================

    uploadBox.addEventListener(
        "dragleave",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            uploadBox.classList.remove(
                "drag-over"
            );


            if (!currentImageURL) {

                status.innerHTML = "";

            }

        }
    );


    // ==========================================
    // DROP
    // ==========================================

    uploadBox.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            uploadBox.classList.remove(
                "drag-over"
            );


            const files =
                event.dataTransfer.files;


            if (
                !files ||
                !files.length
            ) {

                return;

            }


            const file =
                files[0];


            processImage(file);

        }
    );


    // ==========================================
    // DOWNLOAD QR
    // ==========================================

    downloadButton.addEventListener(
        "click",
        function () {

            if (!currentImageURL) {

                alert(
                    "Please upload an image first."
                );

                return;

            }


            try {

                const link =
                    document.createElement("a");


                link.download =
                    "QR-Hub-Image-QR.png";


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.click();

            }

            catch (error) {

                console.error(
                    "Download Error:",
                    error
                );

                alert(
                    "Unable to download QR code."
                );

            }

        }
    );


    // ==========================================
    // SHARE QR
    // ==========================================

    shareButton.addEventListener(
        "click",
        async function () {

            if (!currentImageURL) {

                alert(
                    "Please upload an image first."
                );

                return;

            }


            try {


                // --------------------------------
                // Convert QR canvas to Blob
                // --------------------------------

                const blob =
                    await new Promise(
                        function (resolve) {

                            canvas.toBlob(
                                resolve,
                                "image/png"
                            );

                        }
                    );


                // --------------------------------
                // Mobile Web Share
                // --------------------------------

                if (
                    navigator.share &&
                    window.File
                ) {


                    const qrFile =
                        new File(

                            [blob],

                            "QR-Hub-Image-QR.png",

                            {
                                type:
                                    "image/png"
                            }

                        );


                    if (
                        navigator.canShare &&
                        navigator.canShare({
                            files: [qrFile]
                        })
                    ) {

                        await navigator.share({

                            title:
                                "QR Hub Image QR",

                            text:
                                "QR code generated by QR Hub",

                            files: [qrFile]

                        });


                        return;

                    }

                }


                // --------------------------------
                // Fallback
                // --------------------------------

                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            "QR Hub Image QR",

                        text:
                            currentImageURL

                    });

                    return;

                }


                // --------------------------------
                // No Share API
                // --------------------------------

                alert(
                    "Sharing is not supported on this device. Please use Download."
                );


            }

            catch (error) {

                if (
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.error(
                    "Share Error:",
                    error
                );


                alert(
                    "Unable to share QR code."
                );

            }

        }
    );

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


    // Glow শেষ হওয়ার পর class remove হবে
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





// ==========================================
// QR HUB - AUTOMATIC PWA UPDATE SYSTEM
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then((registration) => {

                console.log(
                    "QR Hub Service Worker registered."
                );


                // ----------------------------------
                // Check for update
                // ----------------------------------

                registration.update();


                // ----------------------------------
                // New Service Worker detected
                // ----------------------------------

                registration.addEventListener(
                    "updatefound",
                    () => {

                        const newWorker =
                            registration.installing;

                        if (!newWorker) return;


                        newWorker.addEventListener(
                            "statechange",
                            () => {

                                if (
                                    newWorker.state ===
                                    "installed"
                                ) {

                                    // পুরোনো SW থাকলে
                                    // নতুন update এসেছে
                                    if (
                                        navigator
                                            .serviceWorker
                                            .controller
                                    ) {

                                        showUpdateNotification(
                                            newWorker
                                        );

                                    }

                                }

                            }
                        );

                    }
                );

            })
            .catch((error) => {

                console.error(
                    "QR Hub Service Worker Error:",
                    error
                );

            });

    });


    // ------------------------------------------
    // New Service Worker activated
    // ------------------------------------------

    let refreshing = false;

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {

            if (refreshing) return;

            refreshing = true;

            console.log(
                "QR Hub updated. Reloading..."
            );

            window.location.reload();

        }
    );

}


// ==========================================
// UPDATE NOTIFICATION
// ==========================================

function showUpdateNotification(newWorker) {

    // আগে notification থাকলে remove
    const oldNotification =
        document.getElementById(
            "qrHubUpdateNotification"
        );

    if (oldNotification) {
        oldNotification.remove();
    }


    // Notification
    const notification =
        document.createElement("div");

    notification.id =
        "qrHubUpdateNotification";


    notification.innerHTML = `

        <div class="qrhub-update-icon">
            🔄
        </div>

        <div class="qrhub-update-content">

            <strong>
                New QR Hub Update Available
            </strong>

            <span>
                Updating...
            </span>

        </div>

    `;


    document.body.appendChild(
        notification
    );


    // ------------------------------------------
    // Activate new version
    // ------------------------------------------

    newWorker.postMessage({
        type: "SKIP_WAITING"
    });

}







// ==========================================
// QR HUB IMAGE QR
// SUPABASE IMAGE UPLOAD
// ==========================================

async function uploadQRHubImageToSupabase(file) {

    if (!qrHubSupabase) {

        const initialized =
            initializeQRHubSupabase();

        if (!initialized) {
            throw new Error(
                "Supabase is not available."
            );
        }
    }

    if (!file) {
        throw new Error(
            "No image selected."
        );
    }

    const safeName =
        file.name || "image.png";

    const fileName =
        `${Date.now()}_${safeName}`;

    const {
        error
    } = await qrHubSupabase
        .storage
        .from(
            QRHUB_IMAGE_CONFIG.storageBucket
        )
        .upload(
            fileName,
            file,
            {
                upsert: true
            }
        );

    if (error) {
        throw error;
    }

    const {
        data
    } = qrHubSupabase
        .storage
        .from(
            QRHUB_IMAGE_CONFIG.storageBucket
        )
        .getPublicUrl(fileName);

    if (!data || !data.publicUrl) {

        throw new Error(
            "Public image URL could not be generated."
        );
    }

    return data.publicUrl;
}





