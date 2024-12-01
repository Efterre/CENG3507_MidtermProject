let allStudentList = JSON.parse(localStorage.getItem("allStudentList")); localStorage.setItem("allStudentList", JSON.stringify(allStudentList));
let allCourseList = JSON.parse(localStorage.getItem("allCourseList")); localStorage.setItem("allCourseList", JSON.stringify(allCourseList));

const gradeScale = 10;

function addCourse(event) {
    event.preventDefault();
    const courseCode = document.getElementById('course-code').value.trim();
    const courseName = document.getElementById('course-name').value.trim();
    const professorName = document.getElementById('profesor-name').value.trim();
 
    if (!courseCode || !courseName || !professorName) {
        alert("CourseCode, CourseName ve ProfessorName must be filled!");
        return;  
    } 
    let courses = JSON.parse(localStorage.getItem('allCourseList')) || [];
 
    const existingCourse = courses.find(course => course.courseCode === courseCode);
    if (existingCourse) {
        alert("Course Code has already been exist!");
        return; 
    } 
    const course = {
        courseCode: courseCode,
        courseName: courseName,
        professorName: professorName,
        studentList: [],  
        gradeScale: gradeScale 
    };

    courses.push(course);

    localStorage.setItem('allCourseList', JSON.stringify(courses));
    showCourseList('course-addition-table-body');
    showCourseList('course-deletion-table-body');
    showCourseList('course-selection-body');
    updateStudentLists();
  
    document.getElementById('course-code').value = '';
    document.getElementById('course-name').value = '';
    document.getElementById('profesor-name').value = '';
 
}

document.querySelector('button[type="addition-submit"]').addEventListener('click', addCourse); 

function showCourseList(tableBodyId) {
    const courseTableBody = document.getElementById(tableBodyId);
    courseTableBody.innerHTML = ''; 
 
    const courses = JSON.parse(localStorage.getItem('allCourseList')) || [];
 
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.professorName}</td>
            <td>${course.studentList.length}</td>
        `;
        courseTableBody.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', () => showCourseList('course-addition-table-body'));

function deleteCourse(event) {
    event.preventDefault();
    const courseCodeToDelete = document.getElementById('delete-course-code').value.trim();
 
    let courses = JSON.parse(localStorage.getItem('allCourseList')) || [];
 
    const courseIndex = courses.findIndex(course => course.courseCode === courseCodeToDelete);
    if (courseIndex === -1) {
        alert("Course Code does not exist!");
        return; 
    }
 
    courses.splice(courseIndex, 1);
 
    localStorage.setItem('allCourseList', JSON.stringify(courses));
 
    document.getElementById('delete-course-code').value = '';

    console.log(`Course deleted: ${courseCodeToDelete}`);
    showCourseList('course-deletion-table-body');
    showCourseList('course-addition-table-body');
    showCourseList('course-selection-body');
    updateStudentLists();

}

document.querySelector('button[type="delete-submit"]').addEventListener('click', deleteCourse);

document.addEventListener('DOMContentLoaded', () => showCourseList('course-deletion-table-body'));
 
function checkStudentIdExists(studentId) {
    return allStudentList.some(student => student.studentId === studentId);
}
 
function displayStudentCourses(studentId) {
    const student = allStudentList.find(student => student.studentId === studentId);

    if (student) {
        const studentCoursesList = document.getElementById("selected-course-body");
        studentCoursesList.innerHTML = ''; 

        student.studentCourseList.forEach(courseCode => {
            const course = allCourseList.find(c => c.courseCode === courseCode);
            if (course) {
                const row = document.createElement("tr"); 
                row.innerHTML = `
                    <td>${course.courseCode}</td>
                    <td>${course.courseName}</td>
                    <td>${course.professorName}</td>
                    <td>
                        <button class="remove-button" data-course-code="${course.courseCode}">
                            Delete
                        </button>
                    </td>
                `;
                studentCoursesList.appendChild(row);  
            }
        });
    } else {
        alert("not found student.");
    }
};

document.getElementById("selected-course-body").addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-button")) {
        const courseCode = event.target.getAttribute("data-course-code");
        const studentId = document.getElementById("course-selection-student-id").value.trim();
 
        removeCourseFromStudentInLocalStorage(studentId, courseCode);
        displayStudentCourses(studentId); 
    }
});
 
document.getElementById("course-selection-student-id").addEventListener("change", function() {
    const studentId = this.value.trim();
    displayStudentCourses(studentId);
});
 
function selectCourse(studentId, courseCode) {
    const student = allStudentList.find(student => student.studentId === studentId);
    const course = allCourseList.find(course => course.courseCode === courseCode);

    if (student && course) {
        if (!student.studentCourseList.includes(course.courseCode)) {
         const grades = {
            midterm: "", 
            final: "",  
            letterGrade: "" 
        };
            student.studentCourseList.push([course.courseCode, grades]);
            updateStudentCoursesInLocalStorage(studentId, courseCode);
            displayStudentCourses(studentId);
            updateStudentLists();
        }
    }
    
}
 
function displaySelectionCourse() {
    const courseSelectionBody = document.getElementById("course-selection-body");
    courseSelectionBody.innerHTML = ''; 

    allCourseList.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.professorName}</td>
            <td>
                <button class="action-button" data-course-code="${course.courseCode}">
                    Select
                </button>
            </td>
        `;
        courseSelectionBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  const selectStudentButton = document.querySelector("button[type='student-selection-submit']");
  const studentIdInput = document.getElementById("course-selection-student-id");

  selectStudentButton.addEventListener("click", function() {
    const studentId = studentIdInput.value.trim();
 
    if (!checkStudentIdExists(studentId)) {
      alert("Student ID not found!");
      return;
    }
    
  });
  document.getElementById("course-selection-body").addEventListener("click", function(event) {
        if (event.target.classList.contains("action-button")) {
            const courseCode = event.target.getAttribute("data-course-code");
            const studentId = studentIdInput.value.trim();
 
            selectCourse(studentId, courseCode);
        }
    });
  
  
});

function updateStudentCoursesInLocalStorage(studentId, courseCode) { 
    let allStudentList = JSON.parse(localStorage.getItem('allStudentList')) || [];
 
    const student = allStudentList.find(student => student.studentId === studentId);
    if (student) { 
        if (!student.studentCourseList.includes(courseCode)) {
            student.studentCourseList.push(courseCode);
        }
    } else {
        console.error("Student not found in localStorage.");
        return;
    } 
    localStorage.setItem('allStudentList', JSON.stringify(allStudentList));
    updateStudentLists();
}
 
function removeCourseFromStudentInLocalStorage(studentId, courseCode) {
    let allStudentList = JSON.parse(localStorage.getItem('allStudentList')) || [];
    const student = allStudentList.find(student => student.studentId === studentId);
    
    if (student) {
        const courseIndex = student.studentCourseList.indexOf(courseCode);
        if (courseIndex > -1) {
            student.studentCourseList.splice(courseIndex, 1); 
            localStorage.setItem('allStudentList', JSON.stringify(allStudentList));
            updateStudentCoursesInLocalStorage(studentId, courseCode); 
            displayStudentCourses(studentId); 
            updateStudentLists();
        }
    } 
};

function addStudent(event) {
    event.preventDefault();
  
    let allStudentList = JSON.parse(localStorage.getItem("allStudentList")) || [];
 
    const studentIdInput = document.getElementById("student-id").value.trim();
    const studentNameInput = document.getElementById("student-name").value.trim();
    const studentSurnameInput = document.getElementById("student-surname").value.trim();
 
    if (!studentIdInput || !studentNameInput || !studentSurnameInput) {
        alert("All fields must be filled out.");
        return;
    }
 
    const existingStudent = allStudentList.find(student => student.studentId === studentIdInput);
    if (existingStudent) {
        alert("A student with this ID already exists.");
        return;
    }
 
    const newStudent = {
        studentId: studentIdInput,
        studentName: studentNameInput,
        studentSurname: studentSurnameInput,
        studentCourseList: [],  
        gpa: 0.00  
    };
 
    allStudentList.push(newStudent);
 
    localStorage.setItem("allStudentList", JSON.stringify(allStudentList));
    
    displayStudents("student-list-body");
    displayStudents("student-cancelation-body");
    displayStudents("student-update-list-body");
    updateStudentLists(); 
    document.getElementById("student-id").value = '';
    document.getElementById("student-name").value = '';
    document.getElementById("student-surname").value = '';
    
}

document.querySelector('button[type="submit"]').addEventListener('click', addStudent);

function displayStudents(tableBodyId) {
    const studentTableBody = document.getElementById(tableBodyId);
    let allStudentList = JSON.parse(localStorage.getItem("allStudentList")) || [];
    studentTableBody.innerHTML = '';  
    
    allStudentList.forEach(student => {
        const row = document.createElement("tr");
 
        const studentIdCell = document.createElement("td");
        studentIdCell.textContent = student.studentId;

        const studentNameCell = document.createElement("td");
        studentNameCell.textContent = student.studentName;

        const studentSurnameCell = document.createElement("td");
        studentSurnameCell.textContent = student.studentSurname;
        
        const courseListCell = document.createElement("td");
        if (student.studentCourseList.length === 0) {
          courseListCell.textContent = "No Courses";  
        } else {
          courseListCell.textContent = student.studentCourseList.join(", ");  
        }
        const gpaCell = document.createElement("td");
        gpaCell.textContent = student.gpa.toFixed(2);  
 
        row.appendChild(studentIdCell);
        row.appendChild(studentNameCell);
        row.appendChild(studentSurnameCell);
        row.appendChild(courseListCell);
        row.appendChild(gpaCell);
 
        studentTableBody.appendChild(row);
    });
}

window.onload = function() {
    displayStudents('student-list-body');
    displayStudents('student-cancelation-body');
    displayStudents('student-update-list-body');
    displaySelectionCourse();
    updateStudentLists();
};

document.addEventListener('DOMContentLoaded', () => displayStudents('student-list-body'));

document.addEventListener('DOMContentLoaded', () => displayStudents('student-cancelation-body'));

function deleteStudent(event) {
    event.preventDefault();
 
    let allStudentList = JSON.parse(localStorage.getItem("allStudentList")) || [];
 
    const studentIdToDelete = document.getElementById("cancel-student-id").value.trim();
 
    if (!studentIdToDelete) {
        alert("Student ID cannot be empty.");
        return;
    }
 
    const studentIndex = allStudentList.findIndex(student => student.studentId === studentIdToDelete);
    if (studentIndex === -1) {
        alert("No student found with this ID.");
        return;
    }
 
    allStudentList.splice(studentIndex, 1);
    removeStudentFromCourse(studentIdToDelete);
    localStorage.setItem("allStudentList", JSON.stringify(allStudentList));
  
    displayStudents("student-cancelation-body");
    displayStudents("student-list-body");
    displayStudents("student-update-list-body");
    updateStudentLists();
  
    document.getElementById("cancel-student-id").value = '';
}

document.getElementById("student-cancellation-form").addEventListener("submit", deleteStudent);

function updateStudent(event) {
    event.preventDefault(); 
 
    const studentIdToUpdate = document.getElementById("student-update-id").value.trim();
    const studentNameToUpdate = document.getElementById("student-update-name").value.trim();
    const studentSurnameToUpdate = document.getElementById("student-update-surname").value.trim();

 
    let allStudentList = JSON.parse(localStorage.getItem("allStudentList")) || [];
 
    const studentIndex = allStudentList.findIndex(student => student.studentId === studentIdToUpdate);
    if (studentIndex === -1) {
        alert("No student found with this ID.");
        return;
    }
 
    if (studentNameToUpdate) {
        allStudentList[studentIndex].studentName = studentNameToUpdate;
    }
    if (studentSurnameToUpdate) {
        allStudentList[studentIndex].studentSurname = studentSurnameToUpdate;
    }
 
    localStorage.setItem("allStudentList", JSON.stringify(allStudentList));
 
    displayStudents("student-update-list-body");
    displayStudents("student-cancelation-body");
    displayStudents("student-list-body");
 
    document.getElementById("student-update-id").value = '';
    document.getElementById("student-update-name").value = '';
    document.getElementById("student-update-surname").value = '';
}

document.addEventListener('DOMContentLoaded', () => displayStudents('student-update-list-body'));

document.getElementById("student-update-form").addEventListener("submit", updateStudent);

function updateStudentLists() { 
    let allStudentList = JSON.parse(localStorage.getItem('allStudentList')) || [];
    let allCourseList = JSON.parse(localStorage.getItem('allCourseList')) || [];
 
    for (let i = 0; i < allCourseList.length; i++) {
        const course = allCourseList[i];
 
        for (let j = 0; j < allStudentList.length; j++) {
            const student = allStudentList[j];
 
            if (student.studentCourseList.includes(course.courseCode)) { 
                if (!course.studentList.includes(student.studentId)) {
                    course.studentList.push(student.studentId);
                    console.log(`Öğrenci ${student.studentId} kursa ${course.courseCode} eklendi.`);
                }
            }
        }
    } 
    localStorage.setItem('allCourseList', JSON.stringify(allCourseList));
};

function removeStudentFromCourse(studentId) { 
    let allCourseList = JSON.parse(localStorage.getItem('allCourseList')) || [];
 
    for (let i = 0; i < allCourseList.length; i++) {
        const course = allCourseList[i];
 
        const index = course.studentList.indexOf(studentId);
        if (index !== -1) { 
            course.studentList.splice(index, 1);
            console.log(`Öğrenci ${studentId} kurs ${course.courseCode} listesinden silindi.`);
        }
    }
 
    localStorage.setItem('allCourseList', JSON.stringify(allCourseList));
}

document.getElementById('student-search-form').addEventListener('submit', function(event) {
    event.preventDefault();  
    const searchValue = document.getElementById('student-search-id-or-name').value.trim().toLowerCase();
 
    const allStudentList = JSON.parse(localStorage.getItem('allStudentList')) || [];
 
    const searchResults = allStudentList.filter(student => { 
        return student.studentId.toLowerCase() === searchValue || 
               student.studentName.toLowerCase().includes(searchValue) || 
               student.studentSurname.toLowerCase().includes(searchValue);
    }); 
    const tableBody = document.getElementById('student-search-table-body');
    tableBody.innerHTML = '';  

    if (searchResults.length > 0) {
        searchResults.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.studentName}</td>
                <td>${student.studentSurname}</td>
                <td>${student.studentCourseList.join(', ')}</td>
                <td>${student.studentGPA}</td>
            `;
            tableBody.appendChild(row);
        });
    } else { 
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No results found.</td>';
        tableBody.appendChild(row);
    }
});

document.getElementById('student-addition-form').addEventListener('submit', function(event) {
    event.preventDefault();  

    const courseCode = document.getElementById('score-student-in-course').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const midtermScore = parseFloat(document.getElementById('student-midterm-score').value.trim());
    const finalScore = parseFloat(document.getElementById('student-final-score').value.trim());
 
    const students = JSON.parse(localStorage.getItem('students'));
    const courses = JSON.parse(localStorage.getItem('courses'));
    const allStudents = JSON.parse(localStorage.getItem('allStudentList'));
 
    if (!students || !students[studentId]) {
        alert('Öğrenci ID mevcut değil.');
        return;
    }

    if (!courses || !courses[courseCode]) {
        alert('Kurs kodu mevcut değil.');
        return;
    }
 
    if (!students[studentId].courses.includes(courseCode)) {
        alert('Öğrenci bu kursta kayıtlı değil.');
        return;
    }
 
    if (isNaN(midtermScore) || midtermScore < 0 || midtermScore > 100) {
        alert('Geçerli bir vize notu girin (0-100).');
        return;
    }

    if (isNaN(finalScore) || finalScore < 0 || finalScore > 100) {
        alert('Geçerli bir final notu girin (0-100).');
        return;
    }
 
    const studentName = students[studentId].name || (allStudents[studentId] ? allStudents[studentId].name : '');
    const studentSurname = students[studentId].surname || (allStudents[studentId] ? allStudents[studentId].surname : '');
 
    saveStudentScore(studentId, studentName, studentSurname, midtermScore, finalScore);
     
    document.getElementById('student-addition-form').reset();
});


 

function showContent(contentId) {
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.style.display = 'none';
    });
    
    const selectedContent = document.getElementById(contentId);
    selectedContent.style.display = 'block';
};
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = 'block'; // Bölümü göster
};
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block'; // Bölümü göster
    } else {
        section.style.display = 'none'; // Bölümü gizle
    }
};