const data = {
    // All text corresponds to a scene, and will be rendered in order.
    prologue: {
        p1: "This is the text for paragraph 1.",
        p2: "This is the text for paragraph 2.",
        p3: "This is the text for paragraph 3."
    },
    penultimate: {
        p1: "paragraph 1 of penultimate"
    },
    epilogue: {
        p1: "Paragraph 1 of epilogue"
    },
    cupid: {
        shouldUseAudio: false, // Whether or not cupid should play a sound on click.
        audioPath: "audio.mp3",
        speed: 60 // How quick Cupid will zoom around.
    },
    rain: {
        // A list of images that will be displayed during the rain epilogue scene.
        images: [
        ]
    }
};

class CCupid {
    #m_deleted = false;
    #m_reference;
    #m_helpTextRef;
    #m_directions = ['up', 'right', 'down', 'left'];
    constructor(){
        const cupid = document.createElement("div");
        cupid.className = "cupid";
        cupid.id = "cupid";
        this.#m_reference = cupid;

        this.#m_helpTextRef = document.createElement("div");
        this.#m_helpTextRef.textContent = "Click on Cupid!";
        this.#m_helpTextRef.style.position = "fixed";
        this.#m_helpTextRef.style.top = "10%";
        this.#m_helpTextRef.style.left = "50%";
        this.#m_helpTextRef.style.fontSize = "25px";
        this.#m_helpTextRef.style.transform = "translateX(-50%)";
        this.#m_helpTextRef.style.color = "black";
        this.#m_helpTextRef.style.textAlign = "center";
        document.body.appendChild(this.#m_helpTextRef);

        cupid.onclick = this.#Delete.bind(this);
        document.body.appendChild(cupid);
    }

    IsDeleted() {
        return this.#m_deleted;
    }

    #MoveImplementation(){
        const direction = this.#GetRandomDirection();
        const cupid = this.#m_reference;
        const step = data.cupid.speed; 
        const currentPosition = {
            top: parseInt(cupid.style.top || '0'),
            left: parseInt(cupid.style.left || '0')
        };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let newPosition = { ...currentPosition };
        switch (direction) {
            case 'up':
                newPosition.top -= step;
                break;
            case 'right':
                newPosition.left += step;
                break;
            case 'down':
                newPosition.top += step;
                break;
            case 'left':
                newPosition.left -= step;
                break;
        }

        if (
            newPosition.left >= 0 &&
            newPosition.left + cupid.offsetWidth <= viewportWidth &&
            newPosition.top >= 0 &&
            newPosition.top + cupid.offsetHeight <= viewportHeight
        ) {
            cupid.style.top = `${newPosition.top}px`;
            cupid.style.left = `${newPosition.left}px`;
        }
    }

    Move() {
        setInterval(()=>{
            this.#MoveImplementation();
        }, 50);
    }

    #GetRandomDirection(){
        return this.#m_directions[Math.floor(Math.random() * this.#m_directions.length)];
    }

    #Delete(){
        if(data.cupid.shouldUseAudio){
            const audio = new Audio(data.cupid.audioPath);
            audio.play();
        }
        document.body.removeChild(this.#m_reference);
        document.body.removeChild(this.#m_helpTextRef);
        this.#m_deleted = true;
    }
}

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

const displayText = async (textData, targetContainerId) => {
    const textContainer = document.getElementById(targetContainerId);
    textContainer.style.display = "block";

    for (let key in textData) {
        const paragraph = document.createElement("p");
        paragraph.textContent = textData[key];
        paragraph.style.display = "none";
        textContainer.appendChild(paragraph);
    }

    var paragraphs = document.querySelectorAll(`#${targetContainerId} p`);
    var index = 0;

    paragraphs[index].style.display = "block";

    for (let paragraph of paragraphs) {
        await typeParagraph(paragraph);
        await delay(2000);
        paragraphs[index].style.display = "none"; 
        index = (index + 1) % paragraphs.length; 
        paragraphs[index].style.display = "block";
    }

    paragraphs[0].style.display = "none";
    textContainer.style.display = "none";
    textContainer.innerHTML = "";
    return Promise.resolve();
}

const prologue = async () =>{
    await displayText(data.prologue, "textContainer");
}

const epilogue = async () => {
    await displayText(data.epilogue, "textContainer");
}

const get_random_image = () =>{
    return data.rain.images[Math.floor(Math.random() * data.rain.images.length)];
}

const start_rain = () => {
    const rainContainer = document.getElementById('rain-container');
    for (let i = 0; i < 50; i++) {
        const rainDrop = document.createElement('img');
        rainDrop.src = get_random_image();
        rainDrop.alt = 'Rain Drop';
        rainDrop.classList.add('rain-drop');
        rainDrop.style.left = `${Math.random() * 100}vw`; 
        rainDrop.style.animationDuration = `${Math.random() * 2 + 1}s`; 
        rainContainer.appendChild(rainDrop);
    }
}


const penultimate = async() => {
    await displayText(data.penultimate, "textContainer");
}

const main = async () => {

    await prologue();
    const Cupid = new CCupid();
    Cupid.Move();
    while (!Cupid.IsDeleted()) {
        await delay(1000);
    }
    await penultimate();
    start_rain();
    await epilogue();

}

window.addEventListener("DOMContentLoaded", () => {
    main();
});
