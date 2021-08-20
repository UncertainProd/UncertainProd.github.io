// DOM elements
const squares = document.querySelectorAll(".flashy-box");
const startbtn = document.getElementById("start-test");
const readyno = document.getElementById("ready-no");
const offsetspan = document.getElementById("offset-span");
const beep = document.getElementById("beep");
let count = 3;
let mode = 0; // start
let testid;
let started = false;
let starttime = 0;
const timeinterval = 500; // in ms
let soundid;

startbtn.addEventListener("click", ()=>{
    if (mode === 0) {
        const id = setInterval(()=>{ 
            if (count === 0) {
                readyno.style.color = "green";
                readyno.style.fontWeight = "bold";
                readyno.innerText = "Go!";
    
                startbtn.innerText = "Reload";
                startbtn.style.backgroundColor = "red";
                mode = 1;
                clearInterval(id);
                startbtn.disabled = false;
                runTest();
                // const intid = setInterval(timeKeyPress, timeinterval);
                started = true;
            }
            else{
                startbtn.disabled = true;
                readyno.innerText = ""+count;
                count--; 
            }
        }, timeinterval);
    }
    else{
        // cleanup
        testid ? clearInterval(testid) : null;
        soundid ? clearInterval(soundid) : null;
        for (const sq of squares) {
            sq.style.backgroundColor = "red";
        }
        count = 3;
        readyno.innerText = "";
        readyno.style.color = "black";
        readyno.style.fontWeight = "";
        
        startbtn.innerText = "Start";
        startbtn.style.backgroundColor = "green";
        startbtn.disabled = false;
        mode = 0;
        started = false;
        offsetspan.innerText = "_"
    }
});

function runTest(){
    let boxindex = 0;
    soundid = setInterval(()=>{beep.play()}, timeinterval);
    testid = setInterval(()=>{
        window.removeEventListener('keypress', timeKeyPress);
        boxindex > 0 ? squares[(boxindex-1)%4].style.backgroundColor = "red" : null;
        squares[boxindex%4].style.backgroundColor = "blue";
        starttime = Date.now();
        window.addEventListener("keypress", timeKeyPress);
        boxindex++;
    }, timeinterval);
}

function timeKeyPress(){
    if (started) {
        console.log("KeyDown!");
        let currtime = Date.now();
        let diff = currtime - starttime;
        offsetspan.innerText = ""+diff <= timeinterval/2.0 ? diff : diff - timeinterval;
    }
}