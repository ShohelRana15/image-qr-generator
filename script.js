const tabs = document.querySelectorAll(".tab");

const imageSection = document.getElementById("imageSection");

const textSection = document.getElementById("textSection");

tabs[0].onclick = ()=>{

tabs[0].classList.add("active");
tabs[1].classList.remove("active");

imageSection.style.display="block";
textSection.style.display="none";

}

tabs[1].onclick = ()=>{

tabs[1].classList.add("active");
tabs[0].classList.remove("active");

imageSection.style.display="none";
textSection.style.display="block";

}
