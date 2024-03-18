

const subjects = {
    "1g-1s": {
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
    "1g-2s": {
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

    }
}
let subjectsStatus = {};

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



function FillSubjectsAbbreviationContainer(){
    document.getElementById('subjects-abbreviation-container').innerHTML = "";
    let subjectColors = CreateMultipleColors(Object.keys(currentSubjects).length);
    let index = 0;
    for (let [subjectKey, subjectInfo] of Object.entries(currentSubjects)) {
        const color = subjectColors[index];
        subjectInfo.bgColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        index ++;
        let subjectButtonHtml = "";
        if(subjectsStatus[subjectInfo.abbreviation].canShow){
            subjectButtonHtml += 
            `
            <button id="button-toggle-${subjectInfo.abbreviation}" class="abbreviation-button active-button" onclick='ToggleSubject("${subjectInfo.abbreviation}")' style="background-color: ${subjectInfo.bgColor}">${subjectInfo.abbreviation}</button>
            `;
        }
        else{
            subjectButtonHtml += 
            `
            <button id="button-toggle-${subjectInfo.abbreviation}" class="abbreviation-button" onclick='ToggleSubject("${subjectInfo.abbreviation}")' style="background-color: ${subjectInfo.bgColor}">${subjectInfo.abbreviation}</button>
            `;
        }
        document.getElementById('subjects-abbreviation-container').innerHTML += subjectButtonHtml;
    }
    let buttons = document.querySelectorAll('button');
    for(let button of buttons){
        button.addEventListener('click', function(){
            FillSubjectsContainer();
            DisplaySelectedSubjects();
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
    let subjectButtonHtml = "";
    if(subjectsStatus[subject.abbreviation].canShow){
        subjectButtonHtml += 
        `
        <button id="button-toggle-${subject.abbreviation}" class="active-button" onclick='ToggleSubject("${subject.abbreviation}")'>X</button>
        `;
    }
    else{
        subjectButtonHtml += 
        `
        <button id="button-toggle-${subject.abbreviation}" onclick='ToggleSubject("${subject.abbreviation}")'>X</button>
        `;
    }
    let lectureExerciseButtonsHtml = "";
    let labExerciseButtonsHtml = "";
    for (let [exerciseKey, exerciseInfo] of Object.entries(subject.exercises)) {
        if(exerciseInfo.type == 'VP'){
            if(subjectsStatus[subject.abbreviation][exerciseKey]){
                lectureExerciseButtonsHtml += 
                `
                <button id="button-toggle-${subject.abbreviation}-${exerciseKey}" class="active-button" onclick='ToggleSubjectExercise("${subject.abbreviation}", "${exerciseKey}")'>${exerciseInfo.group}</button>
                `;
            }
            else{
                lectureExerciseButtonsHtml += 
                `
                <button id="button-toggle-${subject.abbreviation}-${exerciseKey}" onclick='ToggleSubjectExercise("${subject.abbreviation}", "${exerciseKey}")'>${exerciseInfo.group}</button>
                `;
            }
        }
        else if(exerciseInfo.type == 'VL'){
            if(subjectsStatus[subject.abbreviation][exerciseKey]){
                labExerciseButtonsHtml +=
                `
                <button id="button-toggle-${subject.abbreviation}-${exerciseKey}" class="active-button" onclick='ToggleSubjectExercise("${subject.abbreviation}", "${exerciseKey}")'>${exerciseInfo.group}</button>
                `;
            }
            else{
                labExerciseButtonsHtml +=
                `
                <button id="button-toggle-${subject.abbreviation}-${exerciseKey}" onclick='ToggleSubjectExercise("${subject.abbreviation}", "${exerciseKey}")'>${exerciseInfo.group}</button>
                `;
            }
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
    // comment so that it remember when switching back to previous semester
    //subjectsStatus = {}; ///
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

    //#region CREATE DIVS
    let entry_box = document.createElement('div');
    entry_box.classList.add('entry-box');
        
    let entry = document.createElement('div');
    entry.classList.add('entry');
        
    let subject_title_type_group = document.createElement('div');
    subject_title_type_group.classList.add('subject-title-type-group');
        
    let subject_title = document.createElement('div');
    subject_title.classList.add('subject-title');
    subject_title.innerHTML = title;
        
    let subject_type = document.createElement('div');
    subject_type.classList.add('subject-type');
    subject_type.innerHTML = type;

    let subject_group = document.createElement('div');
    subject_group.classList.add('subject-group');
    subject_group.innerHTML = group;
        
    let subject_time = document.createElement('div');
    subject_time.classList.add('subject-time');
    subject_time.innerHTML = `${timeStart}-${timeEnd}`;
        
    let subject_classroom = document.createElement('div');
    subject_classroom.classList.add('subject-classroom');
    subject_classroom.innerHTML = classroom;
    //#endregion

    //#region APPEND CHILDREN
    subject_title_type_group.appendChild(subject_title);
    subject_title_type_group.appendChild(subject_type);
    subject_title_type_group.appendChild(subject_group);

    entry.appendChild(subject_title_type_group);
    entry.appendChild(subject_time);
    entry.appendChild(subject_classroom);
    entry_box.appendChild(entry);
        
    let entries = document.getElementById('entries');
    entries.appendChild(entry_box);
    //#endregion

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
    
    //#region CHANGE STYLES
    entry_box.style.top = `${top}%`;
    entry_box.style.height = `${height}%`;
    entry_box.style.left = `${left}%`;
    entry_box.style.width = `${width}%`;
    entry_box.style.borderWidth = '8px';
    entry_box.style.backgroundColor = bgColor;

    if(width < 10){
        entry.style.fontSize = '10px'
    }
    if(width < 9){
        subject_title.innerHTML = abbreviation;
    }
    if(width < 5){
        entry.style.fontSize = '9px'
    }
    if(type === 'P'){
        entry_box.style.border = 'solid 1px black';
        entry_box.style.boxShadow = 'inset 0 0 5px black';
    }

    //entry_box.style.opacity = 0.7;
    //#endregion

    //console.log('AddLessonToTimetable: done')
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