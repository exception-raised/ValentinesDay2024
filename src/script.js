const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeParagraph = async (paragraph) => {
    var text = paragraph.textContent.trim();
    var charIndex = 0;
    paragraph.textContent = ""; 

    for (let char of text) {
        paragraph.textContent += char;
        await delay(50);
    }
}

const prologue = async () => {
    var paragraphs = document.querySelectorAll("#textContainer p");
    var index = 0;

    paragraphs[index].style.display = "block";

    for (let paragraph of paragraphs) {
        await typeParagraph(paragraph);
        await delay(2000);
        paragraphs[index].style.display = "none"; 
        index = (index + 1) % paragraphs.length; 
        paragraphs[index].style.display = "block";
    }
    paragraphs[0].style.display = "none"
}

window.addEventListener("DOMContentLoaded", () => {
    prologue();
});
