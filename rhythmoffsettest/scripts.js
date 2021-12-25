// DOM elements
const squares = document.querySelectorAll(".flashy-box");
const startbtn = document.getElementById("start-test");
const readyno = document.getElementById("ready-no");
const offsetspan = document.getElementById("offset-span");
const avgoffsetspan = document.getElementById('avg-offset-span');

// data stuffs
let times = [];
let offsets = [];
let running_sum = 0;
let running_count = 0;

let count = 3;
let mode = 0; // start
let testid;
let inittime = 0;
let started = false;
let starttime = 0;
const timeinterval = 500; // in ms

// some color stuff
// best:(3, 219, 252) to worst:(252, 61, 3)
let rslope = 249*2/timeinterval; // 252 - 3
let r_initval = 252;

let gslope = -158*2/timeinterval; // 61 - 219
let g_initval = 61;

let bslope = -249*2/timeinterval; // 3 - 252
let b_initval = 3;
function offsetToColor(offset_val) {
    let getColorComponent = (slope, initval, x) => slope*(x - (timeinterval/2.0)) + initval;
    return { r: getColorComponent(rslope, r_initval, offset_val), g: getColorComponent(gslope, g_initval, offset_val), b: getColorComponent(bslope, b_initval, offset_val) };
}


const plot_div = document.getElementById('timing-plot-div');

startbtn.addEventListener("click", ()=>{
    if (mode === 0) {
        // reset plots
        let plot_config = {
            x: times,
            y: offsets,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: []
            }
        };
        let layout_config = {
            yaxis: {
                range: [-(timeinterval/2) - 1, (timeinterval/2) + 1]
            }
        };
        Plotly.newPlot( plot_div, [plot_config], layout_config, { responsive:true });

        const id = setInterval(()=>{ 
            if (count === 0) {
                readyno.style.color = "green";
                readyno.style.fontWeight = "bold";
                readyno.innerText = "Go!";
                avgoffsetspan.innerText = "_";
    
                startbtn.innerText = "Reload";
                startbtn.style.backgroundColor = "red";
                inittime = Date.now();
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
        running_sum = 0;
        running_count = 0;
    }
});

function runTest(){
    let boxindex = 0;
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
        let trueoffset = diff <= timeinterval/2.0 ? diff : diff - timeinterval;

        running_sum += trueoffset;
        running_count++;
        
        offsetspan.innerText = ""+(trueoffset);
        avgoffsetspan.innerText = "" + (running_sum/running_count);
        // do plotting stuff
        let color = offsetToColor(Math.abs(trueoffset));
        let update = {
            x: [[(currtime - inittime)/1000]],
            y: [[trueoffset]],
            'marker.color': [[`rgb(${color.r}, ${color.g}, ${color.b})`]]
        };
        Plotly.extendTraces(plot_div, update, [0]);
        window.removeEventListener('keypress', timeKeyPress);
    }
}