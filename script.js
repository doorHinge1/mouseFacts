var mainBody = document.getElementById("main-body")
var xStats = document.getElementById("x-stats")
var toggleBtn = document.getElementById("toggle-stats")

var clickCount = document.getElementById("clickCount")
var cpsCount = document.getElementById("cps")
var avgCpsCount = document.getElementById("avg-cps")
var topCpsCount = document.getElementById("top-cps")
var avgHoldVal = document.getElementById("avg-ht")
var totalHoldVal = document.getElementById("t-ht")
var tMDVal = document.getElementById("t-md")
var mSpdVal  = document.getElementById("m-spd")
var avgSpdVal  = document.getElementById("avg-spd")
var mCoords = document.getElementById("m-crds")
var particles = document.getElementById("particles");


let mSize = Math.floor((document.getElementById("mmHolder").clientHeight*10));

let measuringTime = 0.5;
let clicks = 0;
let averageCps = 0;
let highestCps = 0;
let consistency = 0;
let currentClicks = 0;
let totalIntervals = 0;
let currentHoldTime = 0;
let totalHoldTime = 0;
let holdMs = 0;
let statsToggled = false;
let totalMouseDist = 0;
let thisDist = 0;
let pMX = 0;
let pMY = 0;
let timeMoving = 0;

window.onload = function()
{
    document.addEventListener("mousedown",onClick);
    document.addEventListener("mouseup",onMouseUp)

    setInterval(onTick,measuringTime*1000)
    setInterval(animFrame,5)

} 

let popResistance = 2;
let popRecoil = 3000;
let popRecoilScale = 40;
let popAmplifier = 500;
pv = 0;
p=0;

function onClick(e)
{
    if (e.button != 0) return;
    holdMs = Date.now();
    pv = -Math.pow(popResistance,-p/popRecoilScale)*popAmplifier;
    clicks++;
    currentClicks++;
    clickCount.textContent=clicks;
    createBubble(e);
}

function onMouseUp(e)
{
    if (e.button != 0) return;
    totalHoldTime += Date.now()-holdMs;
    totalHoldVal.textContent = totalHoldTime/1000 + "s";
    avgHoldVal.textContent = (Math.round(totalHoldTime/clicks))/1000 + "s";
}

function createBubble(e)
{
    var x = e.pageX;
    var y = e.pageY;
    var particle = document.createElement("img");
    particle.draggable = "false";
    particle.src="bubble.png";
    particle.className="particle";
    particle.style.top=y+"px";
    particle.style.left=x+"px";
    setTimeout(function(){
        particle.remove();
    },1000)
    particles.append(particle);
}

function onTick()
{
    mSpdVal.textContent = Math.round(100*thisDist/measuringTime)/100 + "m/s";
    if (thisDist > 0)
        timeMoving+=measuringTime;
    avgSpdVal.textContent = Math.round(100*totalMouseDist/timeMoving)/100 + "m/s"
    thisDist = 0;
    if (currentClicks > 0)
    {
        let thisCps = currentClicks/measuringTime;
        cpsCount.textContent = thisCps;
        if (thisCps>highestCps)
        {
            highestCps = thisCps;
            topCpsCount.textContent = highestCps;
        }
        totalIntervals++;
        averageCps = Math.round((clicks/totalIntervals)/measuringTime);
        avgCpsCount.textContent = averageCps;
        currentClicks=0;
        return;
    }
    cpsCount.textContent = "0";
}

function animFrame()
{
    pv+=(5/1000)*popRecoil;
    p-=pv*(5/1000);
    if (p <= 0)
    {
        p = 0;
        if (pv < 0)
            pv = 0;
    }
    clickCount.style.fontSize=(300+p)+"px";
}

function toggleStats()
{
    statsToggled = !statsToggled;
    if (statsToggled)
    {
        xStats.style.display = "block";
        toggleBtn.textContent = "Less Stats"
    }
    else
    {
        xStats.style.display = "none";
        toggleBtn.textContent = "More Stats";
    }
}

document.onmousemove = onMouseMove;

function onMouseMove(e)
{
    mCoords.textContent = "Mouse X: "+e.pageX + ", Mouse Y: "+e.pageY;
    dx= (pMX-e.pageX)
    dy = (pMY-e.pageY)
    d = Math.sqrt(dx*dx + dy*dy);
    totalMouseDist += d/mSize;
    thisDist += d/mSize;
    tMDVal.textContent = Math.round(totalMouseDist*100)/100+"m";
    pMX = e.pageX;
    pMY = e.pageY;
}