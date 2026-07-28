// ======================
// SUPABASE
// ======================

const SUPABASE_URL = "https://vbufbeaktxvcxfcskyhr.supabase.co";

const SUPABASE_KEY = "sb_publishable_HD8afj98r3io1rI-qRNVOw__JgSxR87";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// ======================
// TAB SWITCH
// ======================

const imageTab = document.getElementById("imageTab");
const textTab = document.getElementById("textTab");

const imageSection = document.getElementById("imageSection");
const textSection = document.getElementById("textSection");

imageTab.addEventListener("click", () => {

    imageTab.classList.add("active");
    textTab.classList.remove("active");

    imageSection.style.display = "block";
    textSection.style.display = "none";

});

textTab.addEventListener("click", () => {

    textTab.classList.add("active");
    imageTab.classList.remove("active");

    textSection.style.display = "block";
    imageSection.style.display = "none";

});


// ======================
// IMAGE PREVIEW
// ======================

const imageFile = document.getElementById("imageFile");
const imagePreview = document.getElementById("imagePreview");

imageFile.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";

    };

    reader.readAsDataURL(file);

});
