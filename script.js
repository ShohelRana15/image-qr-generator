// ================================
// QR HUB v2.0
// PART 1
// ================================

// ---------- SUPABASE ----------

const SUPABASE_URL = "https://vbufbeaktxvcxfcskyhr.supabase.co";

const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ---------- ELEMENTS ----------

const imageTab = document.getElementById("imageTab");
const textTab = document.getElementById("textTab");

const imageSection = document.getElementById("imageSection");
const textSection = document.getElementById("textSection");

const imageFile = document.getElementById("imageFile");
const imagePreview = document.getElementById("imagePreview");

const uploadBtn = document.getElementById("uploadBtn");

const imageUrl = document.getElementById("imageUrl");

const qrCanvas = document.getElementById("qrcode");

const message = document.getElementById("message");

const finalPreview = document.getElementById("finalPreview");

// ---------- TABS ----------

imageTab.onclick = () => {

    imageTab.classList.add("active");
    textTab.classList.remove("active");

    imageSection.style.display = "block";
    textSection.style.display = "none";

};

textTab.onclick = () => {

    textTab.classList.add("active");
    imageTab.classList.remove("active");

    textSection.style.display = "block";
    imageSection.style.display = "none";

};

// ---------- CROPPER ----------

let cropper = null;

imageFile.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        imagePreview.src = e.target.result;

        imagePreview.style.display = "block";

        if(cropper){

            cropper.destroy();

        }

        cropper = new Cropper(imagePreview,{

            aspectRatio:1,

            viewMode:1,

            autoCropArea:1,

            responsive:true,

            movable:true,

            zoomable:true,

            rotatable:true,

            scalable:true

        });

    }

    reader.readAsDataURL(file);

});

// ---------- TOOLS ----------

document.getElementById("zoomInBtn").onclick=()=>{

    if(cropper) cropper.zoom(.1);

};

document.getElementById("zoomOutBtn").onclick=()=>{

    if(cropper) cropper.zoom(-.1);

};

document.getElementById("rotateBtn").onclick=()=>{

    if(cropper) cropper.rotate(90);

};

document.getElementById("resetBtn").onclick=()=>{

    if(cropper) cropper.reset();

};

document.getElementById("cropBtn").onclick=()=>{

    if(!cropper) return;

    const canvas=cropper.getCroppedCanvas({

        width:1000,

        height:1000

    });

    imagePreview.src=canvas.toDataURL("image/png");

    cropper.destroy();

    cropper=new Cropper(imagePreview,{

        aspectRatio:1,

        viewMode:1

    });

};
// ================================
// PART 2
// UPLOAD + QR
// ================================

uploadBtn.addEventListener("click", async () => {

    if (!cropper) {

        alert("Please select an image.");

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerHTML = "Uploading...";

    // Crop Image

    const canvas = cropper.getCroppedCanvas({

        width:1000,

        height:1000

    });

    finalPreview.src = canvas.toDataURL("image/png");

    finalPreview.style.display = "block";

    const blob = await new Promise(resolve=>{

        canvas.toBlob(resolve,"image/png",1);

    });

    const fileName = Date.now()+".png";

    const {error}=await supabaseClient.storage

    .from("images")

    .upload(fileName,blob,{

        contentType:"image/png"

    });

    if(error){

        message.innerHTML=error.message;

        message.style.color="red";

        uploadBtn.disabled=false;

        uploadBtn.innerHTML="Upload Image";

        return;

    }

    const {data}=supabaseClient.storage

    .from("images")

    .getPublicUrl(fileName);

    imageUrl.value=data.publicUrl;

    QRCode.toCanvas(

        qrCanvas,

        data.publicUrl,

        {

            width:260,

            margin:2

        },

        function(err){

            if(err) console.log(err);

        }

    );

    message.innerHTML="Upload Successful";

    message.style.color="green";

    uploadBtn.disabled=false;

    uploadBtn.innerHTML="Upload Image";

});
// ================================
// PART 3
// COPY + DOWNLOAD + TEXT QR
// ================================

// ---------- COPY URL ----------

const copyBtn = document.getElementById("copyBtn");

copyBtn.onclick = async () => {

    if (!imageUrl.value) {

        alert("No URL Found");
        return;

    }

    await navigator.clipboard.writeText(imageUrl.value);

    copyBtn.innerHTML = "✅ Copied";

    setTimeout(() => {

        copyBtn.innerHTML =
        '<i class="fa-regular fa-copy"></i> Copy URL';

    },2000);

};


// ---------- DOWNLOAD QR ----------

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.onclick = () => {

    const link = document.createElement("a");

    link.download = "QR-Code.png";

    link.href = qrCanvas.toDataURL("image/png");

    link.click();

};


// ---------- TEXT QR ----------

const generateBtn = document.getElementById("generateBtn");

const textInput = document.getElementById("textInput");

generateBtn.onclick = () => {

    if(textInput.value.trim()==""){

        alert("Please enter text.");

        return;

    }

    QRCode.toCanvas(

        qrCanvas,

        textInput.value,

        {

            width:260,

            margin:2

        }

    );

    imageUrl.value="";

    finalPreview.style.display="none";

    message.innerHTML="Text QR Generated";

    message.style.color="green";

};
