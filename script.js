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

    // প্রয়োজনীয় element না থাকলে stop
    if (!welcome || !progressBar || !progressText) {
        return;
    }


    // Welcome Screen Show
    welcome.style.display = "flex";
    welcome.style.opacity = "1";


    let progress = 0;


    // Loading Progress
    const loadingTimer = setInterval(function () {

        progress++;

        // Progress Bar
        progressBar.style.width = progress + "%";


        // Loading Status
        let status = "";

        if (progress <= 25) {

            status = "Initializing QR Hub...";

        } else if (progress <= 50) {

            status = "Preparing Workspace...";

        } else if (progress <= 75) {

            status = "Loading Resources...";

        } else if (progress < 100) {

            status = "Almost Ready...";

        } else {

            status = "QR Hub Ready!";

        }


        // Animated Dots
        const dots = ".".repeat((progress % 3) + 1);


        // Loading Text
        progressText.innerHTML = `
            <div class="loading-status">
                ${status}
            </div>

            <div class="loading-percent">
                Loading${dots} ${progress}%
            </div>
        `;


        // ==================================
        // LOADING COMPLETE
        // ==================================

        if (progress >= 100) {

            clearInterval(loadingTimer);


            setTimeout(function () {

                // Fade Out
                welcome.classList.add("hideWelcome");


                setTimeout(function () {

                    // পুরো Welcome Screen Hide
                    welcome.style.display = "none";

                    // ভবিষ্যতে refresh হলে আবার show করার জন্য
                    welcome.classList.remove("hideWelcome");

                }, 600);

            }, 500);

        }

    }, 25);

});
