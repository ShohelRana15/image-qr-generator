// ===============================
// QR HUB v3.0
// Part 1
// ===============================

// ---------- SUPABASE ----------

const SUPABASE_URL="https://vbufbeaktxvcxfcskyhr.supabase.co";

const SUPABASE_KEY="sb_publishable_HD8afj98r3io1rI-qRNVOw__JgSxR87";

const supabaseClient=supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

// ---------- ELEMENTS ----------

const imageTab=document.getElementById("imageTab");
const textTab=document.getElementById("textTab");

const imageSection=document.getElementById("imageSection");
const textSection=document.getElementById("textSection");

const imageFile=document.getElementById("imageFile");
const imagePreview=document.getElementById("imagePreview");
const finalPreview=document.getElementById("finalPreview");

const uploadBtn=document.getElementById("uploadBtn");

const imageUrl=document.getElementById("imageUrl");

const qrCanvas=document.getElementById("qrcode");

const message=document.getElementById("message");

const cropBtn=document.getElementById("cropBtn");
const zoomInBtn=document.getElementById("zoomInBtn");
const zoomOutBtn=document.getElementById("zoomOutBtn");
const rotateBtn=document.getElementById("rotateBtn");
const resetBtn=document.getElementById("resetBtn");

let cropper=null;
let croppedBlob=null;

// ---------- TAB ----------

imageTab.onclick=()=>{

imageTab.classList.add("active");
textTab.classList.remove("active");

imageSection.style.display="block";
textSection.style.display="none";

};

textTab.onclick=()=>{

textTab.classList.add("active");
imageTab.classList.remove("active");

textSection.style.display="block";
imageSection.style.display="none";

};

// ---------- IMAGE ----------

imageFile.addEventListener("change",()=>{

const file=imageFile.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=e=>{

imagePreview.src=e.target.result;

imagePreview.style.display="block";

if(cropper){

cropper.destroy();

}

cropper=new Cropper(imagePreview,{

viewMode:0,
autoCropArea:1,
responsive:true,
background:false

});

};

reader.readAsDataURL(file);

});
// ===============================
// CROP TOOLS
// ===============================

cropBtn.onclick=()=>{

if(!cropper)return;

cropper.getCroppedCanvas({

imageSmoothingQuality:"high"

}).toBlob(blob=>{

croppedBlob=blob;

imagePreview.src=URL.createObjectURL(blob);

cropper.destroy();

cropper=new Cropper(imagePreview,{

viewMode:0,
autoCropArea:1,
responsive:true,
background:false

});

},"image/png");

};

zoomInBtn.onclick=()=>{

if(cropper)cropper.zoom(0.1);

};

zoomOutBtn.onclick=()=>{

if(cropper)cropper.zoom(-0.1);

};

rotateBtn.onclick=()=>{

if(cropper)cropper.rotate(90);

};

resetBtn.onclick=()=>{

if(cropper)cropper.reset();

};

// ===============================
// IMAGE UPLOAD
// ===============================

uploadBtn.onclick=async()=>{

let uploadFile=imageFile.files[0];

if(croppedBlob){

uploadFile=new File(

[croppedBlob],

"cropped.png",

{type:"image/png"}

);

}

if(!uploadFile){

message.innerHTML="Select Image";

message.style.color="red";

return;

}

uploadBtn.disabled=true;

uploadBtn.innerHTML="Uploading...";

const fileName=Date.now()+"_"+uploadFile.name;

const {error}=await supabaseClient.storage

.from("images")

.upload(fileName,uploadFile,{
upsert:true
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

finalPreview.src=imagePreview.src;

finalPreview.style.display="block";

QRCode.toCanvas(qrCanvas,data.publicUrl);

message.innerHTML="Upload Successful";

message.style.color="green";

uploadBtn.disabled=false;

uploadBtn.innerHTML="Upload Image";

};
// ===============================
// TEXT QR
// ===============================

const generateBtn=document.getElementById("generateBtn");
const textInput=document.getElementById("textInput");

generateBtn.onclick=()=>{

const text=textInput.value.trim();

if(text===""){

alert("Please enter text.");

return;

}

finalPreview.style.display="none";

imageUrl.value=text;

QRCode.toCanvas(qrCanvas,text,{

width:260

});

message.innerHTML="Text QR Generated";

message.style.color="green";

};

// ===============================
// COPY URL
// ===============================

const copyBtn=document.getElementById("copyBtn");

copyBtn.onclick=()=>{

if(imageUrl.value===""){

alert("Nothing to copy.");

return;

}

navigator.clipboard.writeText(imageUrl.value);

copyBtn.innerHTML="✅ Copied";

setTimeout(()=>{

copyBtn.innerHTML="Copy URL";

},2000);

};

// ===============================
// DOWNLOAD QR
// ===============================

const downloadBtn=document.getElementById("downloadBtn");

downloadBtn.onclick=()=>{

if(qrCanvas.width===0){

alert("Generate QR first.");

return;

}

const link=document.createElement("a");

link.download="QR-Code.png";

link.href=qrCanvas.toDataURL("image/png");

link.click();

};

// ===============================
// DRAG & DROP
// ===============================

const dropArea=document.getElementById("dropArea");

dropArea.addEventListener("dragover",(e)=>{

e.preventDefault();

dropArea.style.borderColor="#2563eb";

});

dropArea.addEventListener("dragleave",()=>{

dropArea.style.borderColor="#2563eb";

});

dropArea.addEventListener("drop",(e)=>{

e.preventDefault();

imageFile.files=e.dataTransfer.files;

imageFile.dispatchEvent(new Event("change"));

});
// ===============================
// QR OPTIONS
// ===============================

function generateQR(value){

QRCode.toCanvas(

qrCanvas,

value,

{

width:260,

margin:2,

errorCorrectionLevel:"H",

color:{

dark:"#000000",

light:"#ffffff"

}

}

);

}

// ===============================
// CLEAR MESSAGE
// ===============================

function showMessage(text,color){

message.innerHTML=text;

message.style.color=color;

setTimeout(()=>{

message.innerHTML="";

},3000);

}

// ===============================
// DEFAULT STATE
// ===============================

imageSection.style.display="block";

textSection.style.display="none";

imagePreview.style.display="none";

finalPreview.style.display="none";

// ===============================
// PREVENT DOUBLE CLICK
// ===============================

uploadBtn.addEventListener("dblclick",(e)=>{

e.preventDefault();

});

// ===============================
// IMAGE LOAD ERROR
// ===============================

imagePreview.onerror=()=>{

showMessage("Image Preview Failed","red");

};

// ===============================
// QR ERROR
// ===============================

window.addEventListener("error",(e)=>{

console.log(e);

});

// ===============================
// Welcome Screen
// ===============================

window.addEventListener("load", () => {

    const welcome = document.getElementById("welcomeScreen");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    welcome.style.display = "flex";

    let progress = 0;

    const timer = setInterval(() => {

        progress++;

        progressBar.style.width = progress + "%";

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
    status = "Finalizing...";
}

// Animated dots
const dots = ".".repeat((progress % 3) + 1);

progressText.innerHTML = `
    <div class="loading-status">${status}</div>
    <div class="loading-percent">Loading${dots} ${progress}%</div>
`;

        if(progress >= 100){

            clearInterval(timer);

            setTimeout(() => {

                welcome.classList.add("hideWelcome");

                setTimeout(() => {
                    welcome.style.display = "none";
                    welcome.classList.remove("hideWelcome");
                },600);

            },300);

        }

    },20);

});

// ===============================
// Refresh Button (Fixed Version)
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    const refreshBtn = document.getElementById("refreshBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener("click", () => {

            const icon = document.getElementById("refreshIcon");

            if (icon) {
                icon.classList.add("rotate-refresh");
            }

            setTimeout(() => {
                window.location.reload();
            }, 600);

        });

    }

});

let deferredPrompt;

const installBtn = document.getElementById("installBtn");

if (installBtn) {

    // Install Event
    window.addEventListener("beforeinstallprompt", (e) => {

        e.preventDefault();

        deferredPrompt = e;

        installBtn.hidden = false;

        console.log("✅ Install Prompt Ready");

    });

    // Install Button Click
    installBtn.addEventListener("click", async () => {

        if (deferredPrompt) {

            deferredPrompt.prompt();

            const choice = await deferredPrompt.userChoice;

            console.log(choice);

            deferredPrompt = null;

            installBtn.hidden = true;

        } else {

            alert(
`Automatic install is not available right now.

Install QR Hub manually:

Chrome Menu (⋮)

→ Install app

or

→ Add to Home screen`
            );

        }

    });

}

// ===============================
// FINISH
// ===============================

console.log("QR Hub v3.0 Loaded Successfully");