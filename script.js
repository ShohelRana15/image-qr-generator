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
// ELEMENTS
// ======================

const imageTab = document.getElementById("imageTab");
const textTab = document.getElementById("textTab");

const imageSection = document.getElementById("imageSection");
const textSection = document.getElementById("textSection");

const imageFile = document.getElementById("imageFile");
const dropArea = document.getElementById("dropArea");

const imagePreview = document.getElementById("imagePreview");
const finalPreview = document.getElementById("finalPreview");

const uploadBtn = document.getElementById("uploadBtn");

const imageUrl = document.getElementById("imageUrl");

const qrCanvas = document.getElementById("qrcode");

const message = document.getElementById("message");

const fileInfo = document.getElementById("fileInfo");

const progress = document.getElementById("uploadProgress");

const cropBtn = document.getElementById("cropBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const rotateBtn = document.getElementById("rotateBtn");
const resetBtn = document.getElementById("resetBtn");

let cropper = null;

// ======================
// TAB
// ======================

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

// ======================
// IMAGE SELECT
// ======================

imageFile.addEventListener("change", loadImage);

dropArea.addEventListener("dragover", e => {

e.preventDefault();

});

dropArea.addEventListener("drop", e => {

e.preventDefault();

imageFile.files = e.dataTransfer.files;

loadImage();

});

function loadImage(){

const file = imageFile.files[0];

if(!file) return;

fileInfo.innerHTML =
file.name + "<br>" +
(file.size/1024).toFixed(1)+" KB";

const reader = new FileReader();

reader.onload = e=>{

imagePreview.src = e.target.result;

imagePreview.style.display="block";

if(cropper){

cropper.destroy();

}

cropper = new Cropper(imagePreview,{

viewMode:0,
autoCropArea:1,
responsive:true

});

};

reader.readAsDataURL(file);

}
// ======================
// CROP BUTTONS
// ======================

cropBtn.onclick = () => {

if(!cropper) return;

const canvas = cropper.getCroppedCanvas();

imagePreview.src = canvas.toDataURL();

cropper.destroy();

cropper = new Cropper(imagePreview,{
viewMode:0,
autoCropArea:1
});

};

zoomInBtn.onclick=()=>{

if(cropper) cropper.zoom(0.1);

};

zoomOutBtn.onclick=()=>{

if(cropper) cropper.zoom(-0.1);

};

rotateBtn.onclick=()=>{

if(cropper) cropper.rotate(90);

};

resetBtn.onclick=()=>{

if(cropper) cropper.reset();

};

// ======================
// IMAGE UPLOAD
// ======================

uploadBtn.onclick = async()=>{

const file=imageFile.files[0];

if(!file){

message.innerHTML="Select an image";

message.style.color="red";

return;

}

progress.style.display="block";

progress.value=10;

uploadBtn.disabled=true;

const fileName=Date.now()+"_"+file.name;

const {error}=await supabaseClient.storage
.from("images")
.upload(fileName,file);

if(error){

message.innerHTML=error.message;

message.style.color="red";

progress.style.display="none";

uploadBtn.disabled=false;

return;

}

progress.value=100;

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

setTimeout(()=>{

progress.style.display="none";

progress.value=0;

},1000);

};

// ======================
// TEXT QR
// ======================

document.getElementById("generateBtn").onclick=()=>{

const text=document.getElementById("textInput").value.trim();

if(text===""){

alert("Write something");

return;

}

imageUrl.value=text;

finalPreview.style.display="none";

QRCode.toCanvas(qrCanvas,text);

};

// ======================
// COPY URL
// ======================

document.getElementById("copyBtn").onclick=()=>{

if(imageUrl.value==="") return;

navigator.clipboard.writeText(imageUrl.value);

message.innerHTML="Copied";

message.style.color="green";

};

// ======================
// DOWNLOAD QR
// ======================

document.getElementById("downloadBtn").onclick=()=>{

const link=document.createElement("a");

link.download="QR-Code.png";

link.href=qrCanvas.toDataURL("image/png");

link.click();

};
