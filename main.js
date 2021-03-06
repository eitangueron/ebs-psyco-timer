let intervalTimer;
let timeLeft;
let isPaused = false;
let isStarted = false;


let chaptersAmmount = 8
// let chaptersBySeconds = [60 * 30, 60 * 20, 60 * 20, 60 * 20, 60 * 20, 60 * 20, 60 * 20, 60 * 20, 60 * 20] //final 
let chaptersBySeconds = [15, 10, 10, 10, 10, 10, 10, 10, 10] //test
let withEssay = true
let currentChapter = 0
let wholeTime = chaptersBySeconds[currentChapter]; // manage this to set the whole time 
let clockType = 'ascending'
let isEnded = false
// const clockType = 'descending'


function displayTimeLeft(timeLeft) { //displays time on the input 
    if (timeLeft >= 0) {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        minutes < 0 ? minutes = 0 : null
        seconds < 0 ? seconds = 0 : null
        let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        displayOutput.textContent = displayString;
        // console.log(timeLeft)
    } else {
        // displayTimeLeft(chaptersBySeconds[currentChapter+1])
        displayOutput.textContent = '00:00'
    }
    // update(timeLeft, wholeTime);
}

//audios:
const endTestSound = document.getElementById('end-test');
const fiveMinsToEndChapter = document.getElementById('5-more-mins');
const endChapter = document.getElementById('end-chapter');

//controls:
const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');

//settings buttons (chapter and with or without essay):
const chaptersAmmountBtn = document.getElementById('chapters-ammount-btn');
const essayToggleBtn = document.getElementById('with-essay-toggle-btn');


const totalChaptersInText = document.getElementById('total-chapters');
const currentChapterInTextDisplayed = document.getElementById('current-chapter-in-text');
const essayChapterInTextDisplayed = document.getElementById('essay-chapter-in-text');
const changeClockTypeButton = document.getElementById('change-clock-type-btn');
const changeClockTypeSpan = document.getElementById('change-clock-type-span');

// toggles between which p tag to display with numbers chapters or essay one
const toggleDisplayChapterInTextOrEssay = (showEssay) => {
    if (showEssay) {
        currentChapterInTextDisplayed.style.display = "none";
        essayChapterInTextDisplayed.style.display = 'inline';
    } else {
        currentChapterInTextDisplayed.style.display = "inline";
        essayChapterInTextDisplayed.style.display = 'none';
    }
}

//able/disable all changes while clock running
const toggleDisableChangesWhileClockRuning = () => {
    chaptersAmmountBtn.disabled = !chaptersAmmountBtn.disabled;
    changeClockTypeButton.disabled = !changeClockTypeButton.disabled;
    essayToggleBtn.disabled = !essayToggleBtn.disabled;
    volumeIcon.style.color = '#949494'
    volumeIcon.style.cursor = 'not-allowed'
    essayVMark.style.cursor = 'not-allowed'
    controlersEssaySpan.style.cursor = 'not-allowed'
    chaptersAmmountBtn.style.cursor = 'not-allowed'
    changeClockTypeSpan.style.cursor = 'not-allowed'
}

//changes what current chapter are we in that is displayed in text 
const changeChapterDisplayedInText = () => {
    let curChapter = document.getElementById('current-chapter')
    if (withEssay) {
        toggleDisplayChapterInTextOrEssay(false)
        curChapter.textContent = currentChapter
        if (currentChapter === 0) { //bug fix for when withessay ends and next run is without essay
            curChapter.textContent = currentChapter + 1
        }
    } else {
        curChapter.textContent = currentChapter + 1
    }
}

// end test and rest all 
const endButton = document.getElementById('end-button');
endButton.addEventListener('click', () => {
    clearInterval(intervalTimer);
    // isPaused = !isPaused
    let sure = confirm('האם אתה בטוח שברצונך לסיים?')
    if (sure) {
        resetAll()
    } else {
        if (!isPaused) {
            clockType === 'ascending' ? timerAscending(timeLeft) : timerDescending(timeLeft)
        }
    }
})

// skip to next chapter - works only affter stating (will b displayed only during play on)
const nextChapterButton = document.getElementById('next-chapter-button');

const advanceToNextChapter = () => {
    if (isStarted && chaptersBySeconds[currentChapter + 1]) {
        currentChapter++
        wholeTime = chaptersBySeconds[currentChapter]
        timeLeft = clockType === 'ascending' ? 0 : wholeTime
        displayTimeLeft(timeLeft)
        changeChapterDisplayedInText()
        if (!isPaused) {
            clearInterval(intervalTimer);
            clockType === 'ascending' ? timerAscending(0) : timerDescending(wholeTime)
        }
    }
}

nextChapterButton.addEventListener('click', advanceToNextChapter)

const finishButtonText = document.getElementById('finish-btn-span')
const finishButtonIcon = document.getElementById('stop-btn-icon')

const pauseButtonIcon = document.getElementById('pause-icon');
const pauseButtonText = document.getElementById('pause-text');
const timeDisplayed = document.getElementById('actuall-time');
// const soundCheckBox = document.getElementById('sound-check-box');
const volumeIcon = document.getElementById('volume-icon');
const essayVMark = document.getElementById('controlers-of-with-essay');
const controlersEssayChapterBox = document.getElementById('controlers-of-chapter-essay');
const controlersEssaySpan = document.getElementById('controlers-of-with-essay-span');

const resetAll = () => {
    clearInterval(intervalTimer);
    toggleDisableChangesWhileClockRuning()
    currentChapter = 0
    wholeTime = chaptersBySeconds[currentChapter]
    changeChapterDisplayedInText()
    toggleDisplayChapterInTextOrEssay(withEssay)
    isStarted = false
    isPaused = false
    pauseButtonText.textContent = 'התחל'
    pauseButtonIcon.textContent = 'play_arrow'
    endButton.setAttribute("disabled", "true")
    nextChapterButton.setAttribute("disabled", "true")
    endButton.style.opacity = 0
    nextChapterButton.style.opacity = 0
    timeDisplayed.style.color = 'white'
    volumeIcon.style.color = 'black'
    volumeIcon.style.cursor = 'pointer'
    essayVMark.style.cursor = 'pointer'
    controlersEssaySpan.style.cursor = 'pointer'
    changeClockTypeSpan.style.cursor = 'pointer'
    chaptersAmmountBtn.style.cursor = 'default'
    controlersEssayChapterBox.style.cursor = 'default'
    timeLeft = wholeTime
    clockType === 'ascending' ? displayTimeLeft(0) : displayTimeLeft(wholeTime);
    fireWorksOff()
    unableMainButtons()
    finishButtonText.textContent = 'סיים'
    finishButtonIcon.textContent = 'stop'
    isEnded = false
}


// change how many chapter will b a full test:
chaptersAmmountBtn.addEventListener("change", (event) => {
    chaptersAmmount = chaptersAmmountBtn.value
    // withEssay ? chaptersBySeconds = [60 * 30] : chaptersBySeconds = [] //final
    withEssay ? chaptersBySeconds = [15] : chaptersBySeconds = [] //test
    for (let i = 0; i < chaptersAmmount; i++) {
        // chaptersBySeconds.push(20 * 60) //final
        chaptersBySeconds.push(10) //test
    }
    totalChaptersInText.textContent = chaptersAmmount
})


// add or remove essay from structure:
essayToggleBtn.addEventListener('click', () => {
    if (withEssay) {
        withEssay = false
        chaptersBySeconds.shift()
        wholeTime = chaptersBySeconds[currentChapter]
        clockType === 'ascending' ? displayTimeLeft(0) : displayTimeLeft(wholeTime)
        // displayTimeLeft(wholeTime);
    } else {
        withEssay = true
        // chaptersBySeconds.unshift(60 * 30) //final
        chaptersBySeconds.unshift(15) //test
        wholeTime = chaptersBySeconds[currentChapter]
        clockType === 'ascending' ? displayTimeLeft(0) : displayTimeLeft(wholeTime)
    }
    toggleDisplayChapterInTextOrEssay(withEssay)
})

// voulume test:
volumeIcon.addEventListener('click', () => {
    if (!isStarted) {
        endChapter.play()
    }
})

const disableMainButtons = () => {
    pauseBtn.classList.add('disabled')
    nextChapterButton.classList.add('disabled')
}

const unableMainButtons = () => {
    pauseBtn.classList.remove('disabled')
    nextChapterButton.classList.remove('disabled')
}

//fireWorks :
const fireWorksBox = document.getElementById('fire-works-box')
const fireWorksOn = () => {
    fireWorksBox.classList.add("pyro")
}
const fireWorksOff = () => {
    fireWorksBox.classList.remove("pyro")
}


const toggleClockType = () => {
    if (clockType === 'ascending') {
        clockType = 'descending'
        displayTimeLeft(wholeTime)
    } else if (clockType === 'descending') {
        clockType = 'ascending'
        displayTimeLeft(0)
    }
}
changeClockTypeButton.addEventListener('click', toggleClockType)

// main play descending
function timerDescending(seconds) { //counts time, takes seconds
    timeLeft = seconds
    displayTimeLeft(timeLeft)
    intervalTimer = setInterval(function () {
        timeLeft--
        if (timeLeft === 5) { // 5 mins to end of chapter           //test
        // if (timeLeft === 300) { // 5 mins to end of chapter           //final
            fiveMinsToEndChapter.play()
        } else if (timeLeft === 0 && chaptersBySeconds[currentChapter + 1]) {
            endChapter.play()
        } else if (timeLeft < 0) { //chapter done  
            currentChapter++
            wholeTime = chaptersBySeconds[currentChapter]
            if (wholeTime) { //check if there is another chapter or if all test done
                endChapter.play()
                if (timeLeft === -1) {
                    changeChapterDisplayedInText()
                }
                displayTimeLeft(wholeTime);
                clearInterval(intervalTimer);
                timerDescending(wholeTime)
                return
            } else { //test done 
                endTestSound.play()
                fireWorksOn()
                clearInterval(intervalTimer)
                disableMainButtons()
                finishButtonText.textContent = 'רענן'
                finishButtonIcon.textContent = 'refresh'
                isEnded = true
                // setTimeout( () => {
                //     alert('כל הכבוד!')
                //   }, 2000);
                return
            }
        }
        if (isNaN(timeLeft) || isNaN(seconds)) { //against is NaN bug
            alert('נתקלנו בבעיה, אנא צור קשר עם הנלהלת האתר ולחץ רענן')
            location.reload();
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}

//main play ascending
function timerAscending(seconds) { //counts time, takes seconds
    timeLeft = seconds
    displayTimeLeft(timeLeft)
    intervalTimer = setInterval(function () {
        timeLeft++
        if (timeLeft === wholeTime - 5) { // 5 mins to end of chapter           //test
        // if (timeLeft === wholeTime - 300) { // 5 mins to end of chapter           //final
            fiveMinsToEndChapter.play()
        } else if (timeLeft === wholeTime && chaptersBySeconds[currentChapter + 1]) {
            endChapter.play()
        } else if (timeLeft > wholeTime) { //chapter done  
            currentChapter++
            wholeTime = chaptersBySeconds[currentChapter]
            if (wholeTime) { //check if there is another chapter or if all test done
                endChapter.play()
                if (timeLeft === wholeTime + 1) {
                    changeChapterDisplayedInText()
                }
                displayTimeLeft(wholeTime);
                clearInterval(intervalTimer);
                timerAscending(0)
                return
            } else { //test done 
                endTestSound.play()
                fireWorksOn()
                clearInterval(intervalTimer)
                disableMainButtons()
                finishButtonText.textContent = 'רענן'
                finishButtonIcon.textContent = 'refresh'
                isEnded = true
            }
        }
        if (isNaN(timeLeft)) { //against is NaN bug
            alert('נתקלנו בבעיה, אנא צור קשר עם הנלהלת האתר ולחץ רענן')
            location.reload();
        }

        if (!isEnded) {
            displayTimeLeft(timeLeft);
        }

    }, 1000);
}

//pause feature
function pauseTimer(event) {
    if (isStarted === false) { //play
        toggleDisableChangesWhileClockRuning()
        clockType === 'ascending' ? timerAscending(0) : timerDescending(wholeTime)
        isStarted = true;
        pauseButtonText.textContent = 'השהה'
        pauseButtonIcon.textContent = 'pause'
        endButton.disabled = !endButton.disabled;
        endButton.removeAttribute("disabled")
        nextChapterButton.removeAttribute("disabled")
        nextChapterButton.style.opacity = 1
        endButton.style.opacity = 1
        controlersEssayChapterBox.style.cursor = 'not-allowed'
    } else if (isPaused) { //continue  
        pauseButtonText.textContent = 'השהה'
        pauseButtonIcon.textContent = 'pause'
        if (clockType === 'descending') {
            if (timeLeft >= 0) {
                timerDescending(timeLeft);
            } else {
                clearInterval(intervalTimer);
                timerDescending(wholeTime)
            }
        } else {
            timerAscending(timeLeft)
        }
        isPaused = !isPaused
        timeDisplayed.style.color = 'white'
    } else { //pause
        pauseButtonText.textContent = 'המשך'
        pauseButtonIcon.textContent = 'play_arrow'
        clearInterval(intervalTimer);
        isPaused = !isPaused
        timeDisplayed.style.color = '#ff5e57'
    }
}

//initial display time
clockType === 'ascending' ? displayTimeLeft(0) : displayTimeLeft(wholeTime);

//start clock btn
pauseBtn.addEventListener('click', pauseTimer);
//spacebar or enter clicks
document.body.onkeyup = function (e) {
    if ((e.keyCode == 32 && !isEnded) || (e.keyCode == 13 && !isEnded)) {
        pauseTimer()
    }
}