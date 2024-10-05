

const currentDate = new Date();
let weekDates = getDatesArray(getWeekRange(currentDate).startOfWeek, getWeekRange(currentDate).endOfWeek)
updateDate()

//#region DATE
function getWeekRange(baseDate) {
    const dayOfWeek = baseDate.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

    // Get the start of the week (Monday)
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - diffToMonday);

    // Get the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
        startOfWeek: formatDate(startOfWeek.toLocaleDateString('de-DE')),
        endOfWeek: formatDate(endOfWeek.toLocaleDateString('de-DE'))
    };
}
function formatDate(date){
    let formated = date.split('.').map(function(string) {
        return string.replace(' ','');
    });
    
    if(formated[0].length===1) formated[0] = `0${formated[0]}`;
    if(formated[1].length===1) formated[1] = `0${formated[1]}`;
    formated = formated.join('.')
    return formated;
}

function previousDate(){
    currentDate.setDate(currentDate.getDate() - 7);
    updateDate()
}

function nextDate(){
    currentDate.setDate(currentDate.getDate() + 7);
    updateDate()
}
function updateDate(){
    let week = getWeekRange(currentDate)
    document.getElementById("current-week").innerHTML = `${week.startOfWeek} - ${week.endOfWeek}`;
    weekDates = getDatesArray(week.startOfWeek, week.endOfWeek);
    // document.getElementById("day-monday").innerHTML = `Ponedeljek - ${weekDates[0]}`;
    // document.getElementById("day-tuesday").innerHTML = `Torek - ${weekDates[1]}`;
    // document.getElementById("day-wednesday").innerHTML = `Sreda - ${weekDates[2]}`;
    // document.getElementById("day-thursday").innerHTML = `Četrtek - ${weekDates[3]}`;
    // document.getElementById("day-friday").innerHTML = `Petek - ${weekDates[4]}`;
    UpdateDay("Ponedeljek", "monday", weekDates[0]);
    UpdateDay("Torek", "tuesday", weekDates[1]);
    UpdateDay("Sreda", "wednesday", weekDates[2]);
    UpdateDay("Četrtek", "thursday", weekDates[3]);
    UpdateDay("Petek", "friday", weekDates[4]);

}
function UpdateDay(daySlo, dayEng, date){
    document.getElementById(`day-${dayEng}`).innerHTML = `${daySlo} - ${date}`;
    if(workFreeDays.includes(date)){
        document.getElementById(`day-${dayEng}`).classList.add("work-free")
    }
    else if(document.getElementById(`day-${dayEng}`).classList.contains("work-free")){
        document.getElementById(`day-${dayEng}`).classList.remove("work-free")
    }
}

function getDatesArray(start, end) {
    const startDate = new Date(start.split('.').reverse().join('-')); // Convert from 'DD.MM.YYYY' to 'YYYY-MM-DD'
    const endDate = new Date(end.split('.').reverse().join('-'));     // Same for end date
    
    const datesArray = [];
    
    // Iterate from start date to end date
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        datesArray.push(formatDate(currentDate.toLocaleDateString('de-DE'))); // Add formatted date to array
        currentDate.setDate(currentDate.getDate() + 1);    // Move to next day
    }

    return datesArray;
}
//#endregion

const subjects = {
    "mag-3s": {
        "EKGM": EKGM,
        "TVEM": TVEM,
        "THAM": THAM,
        "ELMM": ELMM,

        "PMMM": PMMM,
        "PRTM": PRTM,
        "PCTM": PCTM,
        "VFSM": VFSM,

        "LKNM": LKNM,
        "HKSM": HKSM,
        "VNZM": VNZM,
        "SGMM": SGMM,

        "PMTM": PMTM,
        "CAMM": CAMM,
        "ADTM": ADTM,
        "INKM": INKM,

        "MLSM": MLSM,
        "EMAM": EMAM,
        "RLPM": RLPM,
        "NMTM": NMTM,

        "LMSM": LMSM,
        "LOTM": LOTM,
        "NSSM": NSSM,
        "AMPM": AMPM,
    }
}
let subjectsStatus = {};
if(localStorage.getItem("Axstr0n-Timetable_subjectsStatus")){
    subjectsStatus = JSON.parse(localStorage.getItem("Axstr0n-Timetable_subjectsStatus"));
}

let currentSubjects = {};

const gradeSemesterSelect = document.getElementById('grade-semester-select');

currentSubjects = subjects[gradeSemesterSelect.value];
CreateSubjectsStatus();
FillSubjectsAbbreviationContainer();
FillSubjectsContainer();
DisplaySelectedSubjects();

gradeSemesterSelect.addEventListener('change', function(){
    currentSubjects = subjects[gradeSemesterSelect.value];
    CreateSubjectsStatus();
    FillSubjectsAbbreviationContainer();
    FillSubjectsContainer();
    DisplaySelectedSubjects();
});

// Download //
document.getElementById('download-button').addEventListener('click', function() {
    const content = document.getElementById('timetable-wrapper');
    content.style.width = '1100px';
    
    html2canvas(content, { scale: 2 }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'timetable.png';
        link.click();
        content.style.width = '100%'; // reset
    });
});
function SaveToLocalStorage(){
    localStorage.setItem("Axstr0n-Timetable_subjectsStatus", JSON.stringify(subjectsStatus));
    //console.log("Saved to local storage");
}
function EraseFromLocalStorage(){
    subjectsStatus = {};
    CreateSubjectsStatus();
    localStorage.setItem("Axstr0n-Timetable_subjectsStatus", JSON.stringify(subjectsStatus));
    // localStorage.removeItem("Axstr0n-Timetable_subjectsStatus");
    //console.log("Erased from local storage");
    console.log(subjectsStatus)
    FillSubjectsAbbreviationContainer();
    FillSubjectsContainer();
    DisplaySelectedSubjects();
}
const discardButton = document.getElementById("discard-button");
discardButton.addEventListener('click', function(){
    EraseFromLocalStorage();
})

function CreateSubjectsStatus(){
    for (let [subjectKey, subjectInfo] of Object.entries(currentSubjects)) {
        if (subjectInfo.abbreviation in subjectsStatus) {
            // console.log(`Subject ${subject.abbreviation} already created`);
            continue;
        }
        
        let subjectStatus = {};
        subjectStatus.canShow = false;
        for (let [exerciseKey, exerciseInfo] of Object.entries(subjectInfo.exercises)) {
            subjectStatus[exerciseKey] = true;
        }
        subjectsStatus[subjectInfo.abbreviation] = subjectStatus;
    }
}

function FillSubjectsAbbreviationContainer(){
    document.getElementById('subjects-abbreviation-container').innerHTML = "";
    let subjectColors = CreateMultipleColors(Object.keys(currentSubjects).length);
    let index = 0;
    for (let [subjectKey, subjectInfo] of Object.entries(currentSubjects)) {
        const color = subjectColors[index];
        subjectInfo.bgColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        index ++;
        let subjectButtonHtml = 
        `
        <button id="button-toggle-${subjectInfo.abbreviation}" 
                class="abbreviation-button ${subjectsStatus[subjectInfo.abbreviation].canShow?'active-button':''}"
                onclick='ToggleSubject("${subjectInfo.abbreviation}")'
                style="background-color: ${subjectInfo.bgColor}"
        >
            ${subjectInfo.abbreviation}
        </button>
        `;

        document.getElementById('subjects-abbreviation-container').innerHTML += subjectButtonHtml;
    }
    let buttons = document.querySelectorAll('button');
    for(let button of buttons){
        button.addEventListener('click', function(){
            FillSubjectsContainer();
            DisplaySelectedSubjects();
            SaveToLocalStorage();
        });
    }
}
function ToggleSubject(subjectAbbreviation){
    subjectsStatus[subjectAbbreviation].canShow = !subjectsStatus[subjectAbbreviation].canShow;
    ToggleClassActiveButton(subjectAbbreviation);
}
function ToggleSubjectExercise(subjectAbbreviation, exerciseKey){
    subjectsStatus[subjectAbbreviation][exerciseKey] = !subjectsStatus[subjectAbbreviation][exerciseKey];
    localStorage.setItem("Axstr0n-Timetable_subjectsStatus", JSON.stringify(subjectsStatus));
    ToggleClassActiveButton(subjectAbbreviation, exerciseKey);
}
// Toggles css class active-button
function ToggleClassActiveButton(subjectAbbreviation, exerciseKey){
    if(!exerciseKey){
        let button = document.getElementById(`button-toggle-${subjectAbbreviation}`);
        button.classList.toggle('active-button');
    }
    else{
        let button = document.getElementById(`button-toggle-${subjectAbbreviation}-${exerciseKey}`);
        button.classList.toggle('active-button');
    }
}
function FillSubjectsContainer(){
    document.getElementById('subjects-container').innerHTML = "";
    for (let [subjectKey, subjectInfo] of Object.entries(currentSubjects)) {
        CreateSubjectContainer(subjectInfo)
    }
    let buttons = document.querySelectorAll('button');
    for(let button of buttons){
        button.addEventListener('click', function(){
            DisplaySelectedSubjects();
        });
    }
}
function CreateSubjectContainer(subject){
    if(!subjectsStatus[subject.abbreviation].canShow) return;

    let lectureExerciseButtonsHtml = "";
    let labExerciseButtonsHtml = "";
    for (let [exerciseKey, exerciseInfo] of Object.entries(subject.exercises)) {
        let exerciseButtonHtml =
        `
        <button id="button-toggle-${subject.abbreviation}-${exerciseKey}" 
                class="${subjectsStatus[subject.abbreviation][exerciseKey]?'active-button':''}" 
                onclick='ToggleSubjectExercise("${subject.abbreviation}", "${exerciseKey}")'
        >
            ${exerciseKey.substring(2)}
        </button>
        `;
        if(exerciseKey.substring(0,2) == 'VP'){
            lectureExerciseButtonsHtml += exerciseButtonHtml;
        }
        else if(exerciseKey.substring(0,2) == 'VL'){
            labExerciseButtonsHtml += exerciseButtonHtml;
        }
    }
    let htmlCode =
    `
        <div class="subject-select-container" style="background-color: ${subject.bgColor}">
            <div class="direction-label">${subject.direction}</div>
            <div class="title">${subject.name}</div>
            <div class="exercises-container">
                <div class="label">VP</div>
                <div class="buttons">
                    ${lectureExerciseButtonsHtml}
                </div>
            </div>
            <div class="exercises-container">
                <div class="label">VL</div>
                <div class="buttons">
                    ${labExerciseButtonsHtml}
                </div>
            </div>
        </div>
    `;
    document.getElementById('subjects-container').innerHTML += htmlCode;
}
function DisplaySelectedSubjects(){
    let allLessons = FilterLessons(currentSubjects);
    let lessonsForMonday = SortLessonsByDay('monday', allLessons);
    let lessonsForTuesday = SortLessonsByDay('tuesday', allLessons);
    let lessonsForWednesday = SortLessonsByDay('wednesday', allLessons);
    let lessonsForThursday = SortLessonsByDay('thursday', allLessons);
    let lessonsForFriday = SortLessonsByDay('friday', allLessons);
    AddLessonsToTimetable([lessonsForMonday,lessonsForTuesday,lessonsForWednesday,lessonsForThursday,lessonsForFriday]);
}

function FilterLessons(subjects){
    let lessons = [];
    for (let [subjectKey, subject] of Object.entries(subjects)) {
        if(subjectsStatus[subject.abbreviation].canShow === false) continue;// Check if subjects is selected
        // Check lecture (date)
        for(let date of weekDates){
            if(!subject["lecture"][date]) continue;
            let sub = {
                name: subject.name,
                abbreviation: subject.abbreviation,
                type: subject["lecture"][date].type,
                group: subject["lecture"][date].group,
                day: subject["lecture"][date].day,
                date: subject["lecture"][date].date,
                classroom: subject["lecture"][date].classroom,
                timeStart: subject["lecture"][date].timeStart,
                duration: subject["lecture"][date].duration,
            };
            lessons.push(sub);
            break;
        }
        // Check exercises (date)
        for (const typeGroup in subject["exercises"]) {
            if (!subject["exercises"].hasOwnProperty(typeGroup)) continue;
            if(subjectsStatus[subject.abbreviation][typeGroup] === false) continue;
            let group = subject["exercises"][typeGroup];
            for(let date of weekDates){
                if(!group[date]) continue;
                let sub = {
                    name: subject.name,
                    abbreviation: subject.abbreviation,
                    type: group[date].type,
                    group: group[date].group,
                    day: group[date].day,
                    date: group[date].date,
                    classroom: group[date].classroom,
                    timeStart: group[date].timeStart,
                    duration: group[date].duration,
                };
                lessons.push(sub);
                break;
            }
        }
    }
    return lessons;
}

function SortLessonsByDay(sortDay, allLessons){
    let lessons = [];
    for(let lesson of allLessons){
        if(lesson.day == sortDay){
            lessons.push(lesson)
        }
    }
    return lessons;
}
function AddLessonsToTimetable(lessonsByDay){
    document.getElementById('entries').innerHTML = "";
    for(let lessonsForDay of lessonsByDay){
        let columns = ControlOverlapping(lessonsForDay)
        AddLessonsByDay(columns);
    }
}
function ControlOverlapping(lessons){
    let col1 = [];
    let col2 = [];
    let col3 = [];
    let col4 = [];
    let col5 = [];
    let col6 = [];
    let col7 = [];
    let col8 = [];
    let col9 = [];
    let col10 = [];
    let columns = [col1, col2, col3, col4, col5, col6, col7, col8, col9, col10];
    for(let lesson of lessons){
        let lessonStart = ConvertTime(lesson.timeStart);
        let duration = ConvertTime(lesson.duration);
        let lessonEnd = lessonStart + duration;

        let isPlaced = false;
        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            
            if(column.length == 0){
                column.push(lesson);
                isPlaced = true;
                break;
            }
            let canPlace = true;

            for (let j = 0; j < column.length; j++) {
                const colLesson = column[j];
                let colLessonStart = ConvertTime(colLesson.timeStart);
                let colLessonEnd = ConvertTime(colLesson.timeStart) + ConvertTime(colLesson.duration);
                
                if(lessonStart == colLessonStart || lessonEnd == colLessonEnd){
                    canPlace = false;
                    break;
                }
                if(lessonStart > colLessonStart && lessonStart < colLessonEnd){
                    canPlace = false;
                    break;
                }
                if(lessonEnd > colLessonStart && lessonEnd < colLessonEnd){
                    canPlace = false;
                    break;
                }
            }
            if(canPlace){
                column.push(lesson);
                break;
            }
        }
        
    }
    for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i];
        if (col.length === 0) {
            columns.splice(i, 1);
        }
    }
    
    return columns
}

function AddLessonsByDay(columnOfLessonsByDay){
    let numberOfColumns = columnOfLessonsByDay.length;
    for (let i = 0; i < numberOfColumns; i++) {
        const column = columnOfLessonsByDay[i];
        for (let j = 0; j < column.length; j++) {
            const lesson = column[j];
            AddLessonToTimetable(lesson, i, numberOfColumns)
        }
    }
}

function AddLessonToTimetable(lesson, offsetXMultiplier, numberOfColumns){
    let abbreviation = lesson.abbreviation;
    let title = lesson.name;
    let type = lesson.type;
    let group = lesson.group;
    let timeStart = lesson.timeStart;
    let duration = lesson.duration;
    let classroom = lesson.classroom;
    let day = lesson.day;
    let bgColor = currentSubjects[abbreviation].bgColor;
    //#region CALCULATE POSITION
    let xGap = 0.3;
    let yGap = 0.5;

    let baseWidth = 20;
    let columnWidth = (baseWidth / numberOfColumns);
    let width =  columnWidth - xGap * 2;
    let left;
    switch (day) {
        case 'monday':
            left = 0;
            break;
        case 'tuesday':
            left = 20;
            break;
        case 'wednesday':
            left = 40;
            break;
        case 'thursday':
            left = 60;
            break;
        case 'friday':
            left = 80;
            break;
        default:
            console.log("Unknown DAY")
            break;
    }
    
    left += offsetXMultiplier * columnWidth + xGap;
    let top = (ConvertTime(timeStart)-7) * (100/13) + yGap;
    let height = (ConvertTime(duration)) * (100/13) - yGap * 3;
    //#endregion
    
    let fontSize = "12";
    if(width < 10){ fontSize = '10'; }
    if(width < 5){ fontSize = '9'; }
    if(width < 3){ fontSize = '8'; }
    if(width < 2){ fontSize = '7'; }

    let html = 
    `
    <div class="entry-box ${type=='P'?'lecture':'exercise'}" 
         style="top:${top}%; height:${height}%; left:${left}%; width:${width}%; background-color:${bgColor}">
        <div class="entry" style="font-size:${fontSize}px">
            <div class="subject-title-type-group">
                <div class="subject-title">
                    ${title.length < 25 && width > 9 ? title : abbreviation}
                </div>
                <div class="subject-type"> ${type} </div>
                <div class="subject-group"> ${group} </div>
                </div>
            <!--<div class="subject-time"> ${timeStart}-${duration} </div>-->
            <div class="subject-classroom"> ${classroom} </div>
        </div>
    </div>
    `;
    let entries = document.getElementById('entries');
    entries.innerHTML += html;
}
















// HELPER FUNCTIONS

// Outputs array of equally spaced colors
function CreateMultipleColors(number){
    let colors = [];
    for (let i = 1; i <= number; i++) {
        let h = (i / number);
        let s;
        if(i % 2 === 0){
            s = 0.8;
        }
        else{
            s = 0.3;
        }
        let v = 1;
        let color = HSVtoRGB(h,s,v);
        colors.push(color);
    }
    return colors;
}
// Converts HSV to RGB
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
// INPUT - 7:00,7:30,7:15 / OUTPUT - 7.00,7.50,7.25                      
function ConvertTime(time){
    const [hoursStr, minutesStr] = time.split(':');
    hours = parseInt(hoursStr, 10);
    minutes = parseInt(minutesStr, 10);
    //if(minutes == 15) minutes = 0.25;
    if(minutes == 30) minutes = 0.50;
    //if(minutes == 45) minutes = 0.75;
    timeOut = hours + minutes; // 7 - hours starts with 7:00
    return timeOut;
}
