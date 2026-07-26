const imageTab=document.getElementById("imageTab");

const textTab=document.getElementById("textTab");

const imageSection=document.getElementById("imageSection");

const textSection=document.getElementById("textSection");

imageTab.addEventListener("click",()=>{

    imageTab.classList.add("active");

    textTab.classList.remove("active");

    imageSection.style.display="block";

    textSection.style.display="none";

});

textTab.addEventListener("click",()=>{

    textTab.classList.add("active");

    imageTab.classList.remove("active");

    textSection.style.display="block";

    imageSection.style.display="none";

});
