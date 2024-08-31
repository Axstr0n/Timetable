

const subjects = {
    "mag-1s": {
        "EKMM": EKMM,
        "NPZM": NPZM,
        "ENSM": ENSM,

        "TRPM": TRPM,
        "TDZM": TDZM,
        "SLTM": SLTM,

        "KNTM": KNTM,
        "IPKM": IPKM,
        "KNSM": KNSM,

        "VSTM": VSTM,
        "VSDM": VSDM,
        "MKEM": MKEM,

        "MITM": MITM,
        "NOPM": NOPM,
        "TPOM": TPOM,
        
        "MPKM": MPKM,
        "RBSM": RBSM,
        "PAPM": PAPM

    },
    "mag-2s": {
        "KNEM": KNEM,
        "PTMM": PTMM,
        "TRSM": TRSM,

        "HTTM": HTTM,
        "KOOM": KOOM,
        "RDTM": RDTM,

        "OBTM": OBTM,
        "NNTM": NNTM,
        "GSPM": GSPM,
        
        "DSKM": DSKM,
        "AKMM": AKMM,
        "PRSM": PRSM,
        
        "NPPM": NPPM,
        "POPM": POPM,
        "MSSM": MSSM,

        "LSSM": LSSM,
        "FLIM": FLIM,
        "DKSM": DKSM
    },
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
InitializeCurrentSubjectsStatus();
FillSubjectsAbbreviationContainer()
FillSubjectsContainer();
DisplaySelectedSubjects();

gradeSemesterSelect.addEventListener('change', function(){
    currentSubjects = subjects[gradeSemesterSelect.value];
    InitializeCurrentSubjectsStatus();
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

// Save / Discard //
// const saveButton = document.getElementById("save-button");
// saveButton.addEventListener('click', function(){
//     SaveToLocalStorage();
// })
const discardButton = document.getElementById("discard-button");
discardButton.addEventListener('click', function(){
    EraseFromLocalStorage();
})

function SaveToLocalStorage(){
    localStorage.setItem("Axstr0n-Timetable_subjectsStatus", JSON.stringify(subjectsStatus));
    //console.log("Saved to local storage");
}
function EraseFromLocalStorage(){
    subjectsStatus = {};
    InitializeCurrentSubjectsStatus();
    localStorage.setItem("Axstr0n-Timetable_subjectsStatus", JSON.stringify(subjectsStatus));
    // localStorage.removeItem("Axstr0n-Timetable_subjectsStatus");
    //console.log("Erased from local storage");
    console.log(subjectsStatus)
    FillSubjectsAbbreviationContainer();
    FillSubjectsContainer();
    DisplaySelectedSubjects();
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
            ${exerciseInfo.group}
        </button>
        `;
        if(exerciseInfo.type == 'VP'){
            lectureExerciseButtonsHtml += exerciseButtonHtml;
        }
        else if(exerciseInfo.type == 'VL'){
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

function InitializeCurrentSubjectsStatus(){
    for (let [subjectKey, subjectInfo] of Object.entries(currentSubjects)) {
        if (subjectInfo.abbreviation in subjectsStatus) {
            // console.log(`Subject ${subject.abbreviation} already created`);
        }
        else{
            let subjectStatus = {};
            subjectStatus.canShow = false;
            for (let [exerciseKey, exerciseInfo] of Object.entries(subjectInfo.exercises)) {
                subjectStatus[exerciseKey] = true;
            }
            subjectsStatus[subjectInfo.abbreviation] = subjectStatus;
        }
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

function DisplaySelectedSubjects(){
    let selectedSubjects = FindSelectedSubjects(currentSubjects);
    let lessonsForMonday = SortLessonsByDay('monday', selectedSubjects);
    let lessonsForTuesday = SortLessonsByDay('tuesday', selectedSubjects);
    let lessonsForWednesday = SortLessonsByDay('wednesday', selectedSubjects);
    let lessonsForThursday = SortLessonsByDay('thursday', selectedSubjects);
    let lessonsForFriday = SortLessonsByDay('friday', selectedSubjects);
    AddLessonsToTimetable([lessonsForMonday,lessonsForTuesday,lessonsForWednesday,lessonsForThursday,lessonsForFriday]);
}

function FindSelectedSubjects(subjects){
    let selectedSubjects = [];
    for (let [subjectKey, subjectInfo] of Object.entries(subjects)) {
        if(subjectsStatus[subjectInfo.abbreviation].canShow === true){
            selectedSubjects.push(subjectInfo);
        }
    }
    return selectedSubjects;
}
function SortLessonsByDay(sortDay, selectedSubjects){
    let lessons = [];
    for(let subject of selectedSubjects){
        
        if(subjectsStatus[subject.abbreviation].canShow == false){
            continue;
        }
        if(subject.lecture.day == sortDay){
            lessons.push([subject.abbreviation])
        }

        for (let [exerciseKey, exerciseInfo] of Object.entries(subject.exercises)) {
            if(subjectsStatus[subject.abbreviation][exerciseKey] == false){
                continue;
            }
            if(exerciseInfo.day == sortDay){
                lessons.push([subject.abbreviation,exerciseKey]);
            }
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
        let [lessonStart, lessonEnd] = GetStartEndTime(lesson);
        lessonStart = ConvertTime(lessonStart);
        lessonEnd = ConvertTime(lessonEnd);

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
                let [colLessonStart, colLessonEnd] = GetStartEndTime(colLesson);
                colLessonStart = ConvertTime(colLessonStart);
                colLessonEnd = ConvertTime(colLessonEnd);
                
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
    let abbreviation = lesson[0];
    let title = currentSubjects[abbreviation].name;
    let type = "";
    let group = "";
    let [timeStart, timeEnd] = GetStartEndTime(lesson);
    let classroom = "";
    let day = "";
    let bgColor = currentSubjects[abbreviation].bgColor;
    // Lecture
    if(lesson.length == 1){
        type = currentSubjects[abbreviation].lecture.type;
        classroom = currentSubjects[abbreviation].lecture.classroom;
        day = currentSubjects[abbreviation].lecture.day;
    }
    // Exericse
    else if(lesson.length == 2){
        type = currentSubjects[abbreviation].exercises[lesson[1]].type;
        group = currentSubjects[abbreviation].exercises[lesson[1]].group;
        classroom = currentSubjects[abbreviation].exercises[lesson[1]].classroom;
        day = currentSubjects[abbreviation].exercises[lesson[1]].day;
    }

    //#region CALCULATE POSITION
    let xGap = 0.2;
    let yGap = 0.3;

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
    let height = ((ConvertTime(timeEnd)-7) - (ConvertTime(timeStart)-7)) * (100/13) - yGap * 2;
    //#endregion
    
    let fontSize = "12px";
    if(width < 10){ fontSize = '10px'; }
    if(width < 5){ fontSize = '9px'; }
    if(width < 3){ fontSize = '8px'; }
    if(width < 2){ fontSize = '7px'; }

    let html = 
    `
    <div class="entry-box ${type=='P'?'lecture':''}" 
         style="top:${top}%; height:${height}%; left:${left}%; width:${width}%; background-color:${bgColor}">
        <div class="entry" style="font-size:${fontSize}px">
            <div class="subject-title-type-group">
                <div class="subject-title">
                    ${title.length < 25 && width > 9 ? title : abbreviation}
                </div>
                <div class="subject-type"> ${type} </div>
                <div class="subject-group"> ${group} </div>
                </div>
            <div class="subject-time"> ${timeStart}-${timeEnd} </div>
            <div class="subject-classroom"> ${classroom} </div>
        </div>
    </div>
    `;
    let entries = document.getElementById('entries');
    entries.innerHTML += html;
}


function GetStartEndTime(lesson){
    let lessonStart = 0;
    let lessonEnd = 0;
    if(lesson.length == 1){
        lessonStart = currentSubjects[lesson[0]].lecture.timeStart;
        lessonEnd = currentSubjects[lesson[0]].lecture.timeEnd;
    }
    else if(lesson.length == 2){
        lessonStart = currentSubjects[lesson[0]].exercises[lesson[1]].timeStart;
        lessonEnd = currentSubjects[lesson[0]].exercises[lesson[1]].timeEnd;
    }
    return [lessonStart, lessonEnd];
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