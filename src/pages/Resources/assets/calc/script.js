/* Индикатор */
let indicatorCalc = document.getElementById('indicator-calc');
let indicatorCalcBtn = indicatorCalc.closest('button');
indicatorCalcBtn.addEventListener('click', calculate);


let oldA = document.getElementById('oldA');
let newA = document.getElementById('newA');
let difA = document.getElementById('difA');

let oldB = document.getElementById('oldB');
let newB = document.getElementById('newB');
let difB = document.getElementById('difB');

let oldC = document.getElementById('oldC');
let newC = document.getElementById('newC');
let difC = document.getElementById('difC');

let oldD = document.getElementById('oldD');
let newD = document.getElementById('newD');
let difD = document.getElementById('difD');

let difClearense = document.getElementById('difClearense');
let difSpeed = document.getElementById('difSpeed');

let oldSpeed = document.getElementById('oldSpeed');

setTimeout(function setCalc() {

    if (typeof calculate.debounce === 'function' && oldSpeed) {
        oldSpeed.addEventListener('input', calculate.debounce(300));
        return;
    }

    setTimeout(setCalc, 300);

}, 300);


let oldWidth = document.getElementById('oldWidth');
oldWidth.addEventListener('change', calculate);

let newWidth = document.getElementById('newWidth');
newWidth.addEventListener('change', calculate);

let oldRadius = document.getElementById('oldRadius');
oldRadius.addEventListener('change', calculate);

let newRadius = document.getElementById('newRadius');
newRadius.addEventListener('change', calculate);

let newProfile = document.getElementById('newProfile');
newProfile.addEventListener('change', calculate);

let oldProfile = document.getElementById('oldProfile');
oldProfile.addEventListener('change', calculate);

let newSpeed = document.getElementById('newSpeed');
newSpeed.addEventListener('change', calculate);


//let newSpeed = document.getElementById ('newSpeed');


function calculate() {
    /* Индикатор */
    indicatorCalc.classList.remove('d-none');
    indicatorCalcBtn.disabled = true;

    setTimeout(function closeIndicatorCalc() {

        if (typeof closeProgress === 'function') {

            oldA.innerHTML = oldWidth.options[oldWidth.selectedIndex].value;
            newA.innerHTML = newWidth.options[newWidth.selectedIndex].value;
            difA.innerHTML = newA.innerHTML - oldA.innerHTML;

            oldC.innerHTML = Math.round(oldRadius.options[oldRadius.selectedIndex].value * 25.4);
            newC.innerHTML = Math.round(newRadius.options[newRadius.selectedIndex].value * 25.4);
            difC.innerHTML = newC.innerHTML - oldC.innerHTML;

            oldD.innerHTML = Math.round(oldWidth.options[oldWidth.selectedIndex].value * oldProfile.options[oldProfile.selectedIndex].value * 0.02
                + oldRadius.options[oldRadius.selectedIndex].value * 25.4);
            newD.innerHTML = Math.round(newWidth.options[newWidth.selectedIndex].value * newProfile.options[newProfile.selectedIndex].value * 0.02
                + newRadius.options[newRadius.selectedIndex].value * 25.4);
            difD.innerHTML = newD.innerHTML - oldD.innerHTML;

            oldB.innerHTML = Math.round((oldD.innerHTML - oldC.innerHTML) / 2);
            newB.innerHTML = Math.round((newD.innerHTML - newC.innerHTML) / 2);
            difB.innerHTML = newB.innerHTML - oldB.innerHTML;

            difClearense.innerHTML = (Math.round(newWidth.options[newWidth.selectedIndex].value * newProfile.options[newProfile.selectedIndex].value * 0.02
                    + newRadius.options[newRadius.selectedIndex].value * 25.4)
                - Math.round(oldWidth.options[oldWidth.selectedIndex].value * oldProfile.options[oldProfile.selectedIndex].value * 0.02
                    + oldRadius.options[oldRadius.selectedIndex].value * 25.4)) / 2;

            newSpeed.innerHTML = Math.round((Math.round(newWidth.options[newWidth.selectedIndex].value * newProfile.options[newProfile.selectedIndex].value * 0.02
                    + newRadius.options[newRadius.selectedIndex].value * 25.4)
                / Math.round(oldWidth.options[oldWidth.selectedIndex].value * oldProfile.options[oldProfile.selectedIndex].value * 0.02
                    + oldRadius.options[oldRadius.selectedIndex].value * 25.4)) * oldSpeed.value * 100) / 100;
            difSpeed.innerHTML = Math.round((newSpeed.innerHTML - oldSpeed.value) * 100) / 100;

            closeProgress();
            return;
        }

        setTimeout(closeIndicatorCalc, 200);

    }, 200);
}


let paramWidth = document.getElementById('paramWidth');
paramWidth.addEventListener('change', calculateWidth);


let paramProfile = document.getElementById('paramProfile');
paramProfile.addEventListener('change', calculateWidth);


let paramRadius = document.getElementById('paramRadius');
paramRadius.addEventListener('change', calculateWidth);


/* Индикатор */
let indicatorCalcWidth = document.getElementById('indicator-calc-width');
let indicatorCalcWidthBtn = indicatorCalcWidth.closest('button');
indicatorCalcWidthBtn.addEventListener('click', calculateWidth);

function calculateWidth() {

    /* Индикатор */
    indicatorCalcWidth.classList.remove('d-none');
    indicatorCalcWidthBtn.disabled = true;



    /* Индикатор */
    setTimeout(function closeIndicatorCalc() {
        if (typeof closeProgress === 'function') {

            let width = paramWidth.value;
            let profile = paramProfile.value;
            let radius = paramRadius.value;

            if (profile < 50) scalar = 0.85;
            if (profile >= 50) scalar = 0.7;

            let rimWidthMin = (Math.round(((width * scalar) * 0.03937) * 2)) / 2;
            let rimWidthMax = (rimWidthMin + 1.5);

            document.getElementById('resultWidthMin').innerHTML = rimWidthMin.toString();
            document.getElementById('resultWidthMax').innerHTML = rimWidthMax.toString();
            document.getElementById('resultDiameter').innerHTML = radius;

            closeProgress();
            return;
        }

        setTimeout(closeIndicatorCalc, 200);

    }, 200);
}


calculate();
calculateWidth();