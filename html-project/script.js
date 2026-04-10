let subjects=[];
let reviews=[];
let currentUser=null;
document.addEventListener('DOMContentLoaded', function() 
{
    checkAuthentication();
    initializeEventListeners();
    loadStoredData();
    updateDashboard();
});
let currentCGPAValue=null;
let targetCGPAValue=null;
let currentEditMode=null; 
function editCurrentCGPA() 
{
    currentEditMode='current';
    document.getElementById('modalTitle').textContent='Update Current CGPA';
    document.getElementById('cgpaInput').value=currentCGPAValue||'';
    document.getElementById('cgpaInput').placeholder='Enter current CGPA';
    document.getElementById('cgpaModal').classList.add('show');
}
function editTargetCGPA() 
{
    currentEditMode='target';
    document.getElementById('modalTitle').textContent='Update Target CGPA';
    document.getElementById('cgpaInput').value=targetCGPAValue || '';
    document.getElementById('cgpaInput').placeholder='Enter your target CGPA';
    document.getElementById('cgpaModal').classList.add('show');
}
function closeModal() 
{
    document.getElementById('cgpaModal').classList.remove('show');
    document.getElementById('cgpaForm').reset();
    currentEditMode=null;
}
function handleCGPAFormSubmit(e) 
{
    e.preventDefault();
    const cgpaValue=parseFloat(document.getElementById('cgpaInput').value);
    if (isNaN(cgpaValue)||cgpaValue<0||cgpaValue>10) 
    {
        showNotification('Enter a valid CGPA between 0 and 10','error');
        return;
    }
    if (currentEditMode==='current') 
    {
        currentCGPAValue=cgpaValue;
        localStorage.setItem('currentCGPA',cgpaValue.toString());
        document.getElementById('currentCGPA').textContent = cgpaValue.toFixed(2);
        showNotification('CGPA updated successfully','success');
    } 
    else if (currentEditMode==='target') 
    {
        targetCGPAValue=cgpaValue;
        localStorage.setItem('targetCGPA', cgpaValue.toString());
        document.getElementById('targetCGPA').textContent = cgpaValue.toFixed(2);
        showNotification('Target CGPA updated successfully','success');
    }
    closeModal();
}
function checkAuthentication() 
{
    const userData = localStorage.getItem('currentUser');
    if (!userData && window.location.pathname.includes('index.html')) 
        {
        window.location.href = 'login.html';
        return;
    }
    if (userData) 
        {
        currentUser = JSON.parse(userData);
        updateUserInfo();
    }
}
function updateUserInfo() 
{
    if (currentUser) 
        {
        const userNameElement=document.getElementById('userName');
        const studentNameElement=document.getElementById('studentName');
        if (userNameElement) 
            {
            userNameElement.textContent=`Welcome, ${currentUser.name.split(' ')[0]}!`;
        }
        if (studentNameElement) 
            {
            studentNameElement.textContent=currentUser.name;
        }
    }
}
function initializeEventListeners() 
{
    const navLinks=document.querySelectorAll('.nav-link');
    navLinks.forEach(link => 
        {
        link.addEventListener('click', function(e) 
        {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    const logoutBtn=document.getElementById('logoutBtn');
    if (logoutBtn) 
        {
        logoutBtn.addEventListener('click', logout);
    }
    const subjectForm=document.getElementById('subjectForm');
    if (subjectForm) 
        {
        subjectForm.addEventListener('submit', handleSubjectSubmit);
    }
    const targetForm = document.getElementById('targetForm');
    if (targetForm) 
        {
        targetForm.addEventListener('submit', handleTargetGPACalculation);
    }
    const currentForm = document.getElementById('currentForm');
    if (currentForm) 
        {
        currentForm.addEventListener('submit', handleCurrentGPACalculation);
    }
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) 
        {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    const cgpaForm = document.getElementById('cgpaForm');
    if (cgpaForm) 
        {
        cgpaForm.addEventListener('submit', handleCGPAFormSubmit);
    }
    const ratingButtons = document.querySelectorAll('.rating-btn');
    ratingButtons.forEach(btn => 
        {
        btn.addEventListener('click', handleRatingClick);
    });
    const timetableEditForm = document.getElementById('timetableEditForm');
    if (timetableEditForm) {
        timetableEditForm.addEventListener('submit', handleTimetableEditSubmit);
    }
    const completedSemesters = document.getElementById('completedSemesters');
    if (completedSemesters) {
        completedSemesters.addEventListener('input', generateSemesterInputs);
    }
}
function showSection(sectionId) 
{
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}
function logout() 
{
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
function loadStoredData()
{
    const storedSubjects=localStorage.getItem('subjects');
    const storedReviews=localStorage.getItem('reviews');
    const storedCurrentCGPA=localStorage.getItem('currentCGPA');
    const storedTargetCGPA=localStorage.getItem('targetCGPA');
    
    if (storedSubjects) 
        {
        subjects=JSON.parse(storedSubjects);
        displaySubjects();
    }
    if (storedReviews) 
        {
        reviews=JSON.parse(storedReviews);
        displayReviews();
    }
    if (storedCurrentCGPA) 
        {
        currentCGPAValue=parseFloat(storedCurrentCGPA);
        document.getElementById('currentCGPA').textContent = currentCGPAValue.toFixed(2);
    }
    if (storedTargetCGPA) 
        {
        targetCGPAValue=parseFloat(storedTargetCGPA);
        document.getElementById('targetCGPA').textContent = targetCGPAValue.toFixed(2);
    }
    const storedManualTimetable = localStorage.getItem('manualTimetable');
    if (storedManualTimetable) {
        manualTimetable = JSON.parse(storedManualTimetable);
    }
    updateDashboard();
}
function saveToLocalStorage(key, data) 
{
    localStorage.setItem(key, JSON.stringify(data));
}
function handleSubjectSubmit(e) 
{
    e.preventDefault();
    const subject = 
    {
        id: Date.now(),
        name: document.getElementById('subjectName').value,
        examType: document.getElementById('examType').value,
        studyHours: parseInt(document.getElementById('studyHours').value),
        credits: parseInt(document.getElementById('credits').value),
        internalMarks: parseInt(document.getElementById('internalMarks').value),
        totalInternalMarks: parseInt(document.getElementById('totalInternalMarks').value),
        priority: 0
    };
    subject.priority = calculatePriority(subject);
    subjects.push(subject);
    subjects.sort((a, b) => b.priority - a.priority);
    saveToLocalStorage('subjects', subjects);
    displaySubjects();
    updateDashboard();
    e.target.reset();
    showNotification('Subject added successfully!', 'success');
}
function calculatePriority(subject) 
{
    const marksRatio=subject.internalMarks/subject.totalInternalMarks;
    const urgency=subject.examType==='FAT'?3:subject.examType.includes('CAT')?2:1;
    const studyWeight=subject.studyHours/10;
    const creditWeight=subject.credits/4;    
    return(urgency*3)+((1-marksRatio)*2)+studyWeight+creditWeight;
}
function displaySubjects() 
{
    const container=document.getElementById('subjectsContainer');
    if (!container) return;
    container.innerHTML='';
    
    if (subjects.length===0) 
        {
        container.innerHTML='<p>No subjects added. Add your subject above</p>';
        return;
    }
    subjects.forEach(subject => 
        {
        const card=createSubjectCard(subject);
        container.appendChild(card);
    });
}
function createSubjectCard(subject) 
{
    const card=document.createElement('div');
    card.className='subject-card';
    const priorityLevel=subject.priority > 7 ? 'High' : subject.priority > 4 ? 'Medium' : 'Low';
    const priorityColor=subject.priority > 7 ? '#e74c3c' : subject.priority > 4 ? '#f39c12' : '#27ae60';
    card.innerHTML= `
        <h4>${subject.name}</h4>
        <div class="subject-info">
            <span>Exam: ${subject.examType}</span>
            <span class="priority-badge" style="background: ${priorityColor}">${priorityLevel} Priority</span>
        </div>
        <div class="subject-info">
            <span>Study Hours: ${subject.studyHours}h</span>
            <span>Credits: ${subject.credits}</span>
        </div>
        <div class="subject-info">
            <span>Marks: ${subject.internalMarks}/${subject.totalInternalMarks}</span>
            <span>${((subject.internalMarks/subject.totalInternalMarks) * 100).toFixed(1)}%</span>
        </div>
        <button onclick="removeSubject(${subject.id})" class="remove-btn" style="margin-top: 10px;">Remove</button>
    `;
    return card;
}
function removeSubject(id) 
{
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects=subjects.filter(subject => subject.id !== id);
        saveToLocalStorage('subjects', subjects);
        displaySubjects();
        updateDashboard();
        showNotification('Subject deleted successfully', 'info');
    }
}
function generateSemesterInputs() 
{
    const count=parseInt(document.getElementById('completedSemesters').value)||0;
    const container=document.getElementById('semesterGPAs');
    container.innerHTML='';
    for (let i = 1; i <= count; i++) {
        const input=document.createElement('div');
        input.className='semester-input';
        input.innerHTML=`
            <label>Semester ${i} GPA:</label>
            <input type="number" step="0.01" min="0" max="10" class="semester-gpa" data-semester="${i}" required>
        `;
        container.appendChild(input);
    }
}
function handleTargetGPACalculation(e) 
{
    e.preventDefault();
    const targetCGPA=parseFloat(document.getElementById('targetCGPAInput').value);
    const semesterGPAs=Array.from(document.querySelectorAll('.semester-gpa')).map(input => parseFloat(input.value));
    const currentCGPA=semesterGPAs.reduce((sum, gpa) => sum + gpa, 0) / semesterGPAs.length;
    const requiredGPA=(targetCGPA * (semesterGPAs.length + 1)) - (currentCGPA * semesterGPAs.length);
    const resultPanel=document.getElementById('targetResult');
    
    if (requiredGPA>10) 
        {
        resultPanel.innerHTML= `
            <h3>Target Not Achievable</h3>
            <p>Your target CGPA of ${targetCGPA} is not achievable with a maximum GPA of 10.</p>
            <p>Current CGPA: ${currentCGPA.toFixed(2)}</p>
            <p>Maximum possible CGPA: ${((currentCGPA * semesterGPAs.length + 10) / (semesterGPAs.length + 1)).toFixed(2)}</p>
        `;
    } else if (requiredGPA < 0) 
        {
        resultPanel.innerHTML= `
            <h3>Target Already Achieved</h3>
            <p>Your current CGPA of ${currentCGPA.toFixed(2)} is already higher than your target of ${targetCGPA}.</p>
        `;
    } else {
        resultPanel.innerHTML= `
            <h3>Required GPA Calculation</h3>
            <p><strong>Target CGPA:</strong> ${targetCGPA}</p>
            <p><strong>Current CGPA:</strong> ${currentCGPA.toFixed(2)}</p>
            <p><strong>Required GPA this semester:</strong> <span style="color: #667eea; font-size: 1.5rem; font-weight: bold;">${requiredGPA.toFixed(2)}</span></p>
            <p>Score at least ${requiredGPA.toFixed(2)} GPA this semester to achieve your target.</p>
        `;
    }
}
function handleCurrentGPACalculation(e) 
{
    e.preventDefault();
    const subjectRows=document.querySelectorAll('#subjectsInput .subject-input-row');
    let totalPoints=0;
    let totalCredits=0;
    subjectRows.forEach(row => 
        {
        const grade=parseFloat(row.querySelector('.grade-select').value);
        const credits = parseInt(row.querySelector('.credit-input').value);
        if (grade && credits) {
            totalPoints+=grade*credits;
            totalCredits+=credits;
        }
    });
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const resultPanel = document.getElementById('currentResult');
    resultPanel.innerHTML = `
        <h3>Current Semester GPA</h3>
        <p><strong>Total Credits:</strong> ${totalCredits}</p>
        <p><strong>Total Grade Points:</strong> ${totalPoints.toFixed(2)}</p>
        <p><strong>Your GPA:</strong> <span style="color: #667eea; font-size: 1.5rem; font-weight: bold;">${gpa.toFixed(2)}</span></p>
        <p>${getGPAMessage(gpa)}</p>
    `;
}
function getGPAMessage(gpa) 
{
    if (gpa >= 9) return "Excellent performance! Keep it up!";
    if (gpa >= 8) return "Very good performance! Great job!";
    if (gpa >= 7) return "Good performance! Room for improvement.";
    if (gpa >= 6) return "Average performance. Work harder next time.";
    return "Needs significant improvement. Don't give up!";
}
function addSubjectRow() 
{
    const container=document.getElementById('subjectsInput');
    const row=document.createElement('div');
    row.className='subject-input-row';
    row.innerHTML=`
        <div class="form-group">
            <label>Grade</label>
            <select class="grade-select" required>
                <option value="">Select Grade</option>
                <option value="10">S (10)</option>
                <option value="9">A (9)</option>
                <option value="8">B (8)</option>
                <option value="7">C (7)</option>
                <option value="6">D (6)</option>
                <option value="5">E (5)</option>
                <option value="0">F (0)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Credits</label>
            <input type="number" class="credit-input" min="1" max="10" required>
        </div>
        <button type="button" class="remove-btn" onclick="removeSubjectRow(this)">Remove</button>
    `;
    container.appendChild(row);
}
function removeSubjectRow(button) 
{
    const rows = document.querySelectorAll('#subjectsInput .subject-input-row');
    if (rows.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('You must have at least one subject', 'error');
    }
}
function showCalculatorTab(tab) 
{
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.calculator-panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    if (tab==='target') 
        {
        tabs[0].classList.add('active');
        document.getElementById('targetCalculator').classList.add('active');
    } else 
        {
        tabs[1].classList.add('active');
        document.getElementById('currentCalculator').classList.add('active');
    }
}
function generateTimetable() 
{
    const timetableBody=document.getElementById('timetableBody');
    const timeSlots=[
        '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
    ];
    const days=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    timetableBody.innerHTML = '';
    const schedule=createRealisticSchedule();
    
    timeSlots.forEach((time, timeIndex) => 
        {
        const row=document.createElement('tr');
        row.innerHTML=`<td><strong>${time}</strong></td>`;
        
        days.forEach(day => 
            {
            const cell = document.createElement('td');
            
            // Check for manual edits first
            const manualEdit = manualTimetable[day] && manualTimetable[day][time];
            if (manualEdit) {
                cell.textContent = manualEdit.name;
                cell.className = `editable ${manualEdit.type}`;
                applyTimetableCellStyle(cell, manualEdit.type);
            } else if (time === '12:00-1:00') 
                {
                cell.textContent = 'Lunch';
                cell.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
                cell.style.fontWeight = 'bold';
                cell.style.color = '#92400e';
            }
            else if (day==='Saturday'||day==='Sunday') 
                {
                if (day==='Sunday') 
                    {
                    cell.textContent = ' Holiday';
                    cell.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                } 
                else 
                    {
                    if (timeIndex < 2) 
                        {
                        cell.textContent = 'Study Time';
                        cell.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
                    } else {
                        cell.textContent = 'Weekend';
                        cell.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                    }
                }
                cell.style.fontWeight = 'bold';
                cell.style.color = '#701a75';
            }
            else 
                {
                const subject = schedule[day] && schedule[day][time];
                if (subject) 
                    {
                    if (subject.type === 'exam-prep') 
                        {
                        cell.textContent = subject.name;
                        cell.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
                        cell.style.fontWeight = 'bold';
                        cell.style.color = '#92400e';
                    } 
                    else 
                        {
                        cell.textContent = subject.name;
                        cell.style.background = getSubjectColor(subject.priority);
                        cell.style.fontWeight = 'bold';
                        cell.style.color = 'white';
                    }
                } 
                else 
                    {
                    cell.textContent = 'Free';
                    cell.className = 'editable';
                    cell.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                }
            }
            row.appendChild(cell);
        });
        
        timetableBody.appendChild(row);
    });
    
    // Add click event listener
    timetableBody.addEventListener('click', handleTimetableClick);
    
    showNotification('Timetable generated with smart scheduling!', 'success');
}
function createRealisticSchedule() 
{
    const schedule={};
    const today=new Date().getDay(); 
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const timeSlots = [
        '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
    ];
    days.forEach(day => {
        schedule[day] = {};
        timeSlots.forEach(time => {
            schedule[day][time] = null;
        });
    });
    days.forEach(day => {
        schedule[day]['12:00-1:00'] = { name: 'Lunch Break', type: 'break' };
    });
    const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority);
    const startIndex = today === 0 ? 1 : today; 
    sortedSubjects.forEach(subject => {
        let allocatedHours = 0;
        const requiredHours = parseInt(subject.studyHours);
        for (let dayOffset = 0; dayOffset < 7 && allocatedHours < requiredHours; dayOffset++) {
            const dayIndex = (startIndex + dayOffset - 1) % 7;
            const day = days[dayIndex];
            const isWeekend = day === 'Saturday' || day === 'Sunday';
            const allowWeekend = subject.examType === 'FAT' || subject.examType === 'CAT 2';
            if (isWeekend && !allowWeekend) continue;
            const availableSlots = timeSlots.filter(time => time !== '12:00-1:00');
            for (const time of availableSlots) {
                if (!schedule[day][time] && allocatedHours < requiredHours) {
                    schedule[day][time] = subject;
                    allocatedHours++;
                    break; 
                }
            }
        }
        if (subject.examType === 'FAT' || subject.examType === 'CAT 2') {
            const examDayIndex = Math.max(0, startIndex - 1); 
            const examDay = days[examDayIndex];
            for (const time of availableSlots) {
                if (!schedule[examDay][time]) {
                    schedule[examDay][time] = { 
                        name: `${subject.name} - Exam Prep`, 
                        type: 'exam-prep',
                        originalSubject: subject 
                    };
                    break;
                }
            }
        }
    });
    return schedule;
}

function getSubjectColor(priority) {
    if (priority > 7) {
        return 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'; 
    } else if (priority > 4) {
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; 
    } else {
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; 
    }
}
function clearTimetable() {
    const timetableBody = document.getElementById('timetableBody');
    timetableBody.innerHTML = '';
    showNotification('Timetable cleared', 'info');
}

// Timetable edit functionality
let manualTimetable = {}; // Store manual edits
let currentEditCell = null; // Track current editing cell

function openTimetableEditModal(cell, day, time) {
    currentEditCell = { cell, day, time };
    
    // Populate subject dropdown
    const subjectSelect = document.getElementById('editSubject');
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.name;
        option.textContent = subject.name;
        subjectSelect.appendChild(option);
    });
    
    // Get current cell data
    const currentData = manualTimetable[day] && manualTimetable[day][time] 
        ? manualTimetable[day][time] 
        : cell.textContent;
    
    // Pre-fill form if data exists
    if (currentData && currentData !== 'Free' && currentData !== 'Lunch' && currentData !== 'Holiday') {
        document.getElementById('editActivity').value = currentData.name || currentData;
        document.getElementById('editSubject').value = currentData.name || '';
        document.getElementById('editType').value = currentData.type || 'study';
        document.getElementById('editNotes').value = currentData.notes || '';
    } else {
        // Reset form
        document.getElementById('editActivity').value = '';
        document.getElementById('editSubject').value = '';
        document.getElementById('editType').value = 'study';
        document.getElementById('editNotes').value = '';
    }
    
    // Show modal
    document.getElementById('timetableEditModal').style.display = 'block';
}

function closeTimetableEditModal() {
    document.getElementById('timetableEditModal').style.display = 'none';
    currentEditCell = null;
}

function handleTimetableEditSubmit(e) {
    e.preventDefault();
    
    if (!currentEditCell) return;
    
    const { cell, day, time } = currentEditCell;
    const activity = document.getElementById('editActivity').value.trim();
    const subject = document.getElementById('editSubject').value;
    const type = document.getElementById('editType').value;
    const notes = document.getElementById('editNotes').value.trim();
    
    // Store manual edit
    manualTimetable[day] = manualTimetable[day] || {};
    
    if (activity) {
        manualTimetable[day][time] = {
            name: activity,
            subject: subject,
            type: type,
            notes: notes
        };
        
        // Update cell display
        cell.textContent = activity;
        cell.className = `editable ${type}`;
        
        // Apply styling based on type
        applyTimetableCellStyle(cell, type);
    } else {
        // Clear the slot
        delete manualTimetable[day][time];
        cell.textContent = 'Free';
        cell.className = 'editable';
        cell.style.background = '';
    }
    
    // Save to localStorage
    saveToLocalStorage('manualTimetable', manualTimetable);
    
    closeTimetableEditModal();
    showNotification('Timetable updated successfully', 'success');
}

function applyTimetableCellStyle(cell, type) {
    switch(type) {
        case 'study':
            cell.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
            cell.style.color = '#1e40af';
            break;
        case 'class':
            cell.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
            cell.style.color = '#166534';
            break;
        case 'exam':
            cell.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
            cell.style.color = '#92400e';
            break;
        case 'break':
            cell.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
            cell.style.color = '#9f1239';
            break;
        default:
            cell.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
            cell.style.color = '#374151';
    }
}

function handleTimetableClick(e) {
    const cell = e.target;
    if (cell.tagName === 'TD' && !cell.classList.contains('header')) {
        const timeSlot = cell.closest('tr').querySelector('td:first-child').textContent;
        const day = cell.closest('table').querySelector('thead tr th').textContent;
        
        // Don't allow editing lunch or fixed slots
        if (timeSlot === '12:00-1:00' || cell.textContent === 'Lunch' || cell.textContent === 'Holiday') {
            return;
        }
        
        openTimetableEditModal(cell, day, timeSlot);
    }
}

function handleRatingClick(e) {
    const rating = parseInt(e.target.dataset.rating);
    document.getElementById('rating').value = rating;
    const buttons = document.querySelectorAll('.rating-btn');
    buttons.forEach((btn, index) => {
        if (index < rating) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const review = {
        id: Date.now(),
        facultyName: document.getElementById('facultyName').value,
        subject: document.getElementById('subject').value,
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('reviewComment').value,
        date: new Date().toLocaleDateString()
    };
    
    reviews.push(review);
    saveToLocalStorage('reviews', reviews);
    displayReviews();
    e.target.reset();
    
    // Reset rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('rating').value = 0;
    
    showNotification('Review submitted successfully!', 'success');
}
function displayReviews() 
{
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    container.innerHTML = '';
    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first to add a review!</p>';
        return;
    }
    reviews.slice(0, 6).forEach(review => {
        const card = createReviewCard(review);
        container.appendChild(card);
    });
}
function createReviewCard(review) 
{
    const card = document.createElement('div');
    card.className = 'review-card';
    const stars = '('.repeat(review.rating) + '('.repeat(5 - review.rating);
    card.innerHTML = `
        <div class="review-header">
            <div>
                <div class="review-faculty">${review.facultyName}</div>
                <div class="review-subject">${review.subject}</div>
            </div>
            <div class="review-rating">${stars}</div>
        </div>
        <div class="review-comment">${review.comment}</div>
        <div style="margin-top: 10px; font-size: 0.8rem; color: #999;">${review.date}</div>
        <button onclick="deleteReview(${review.id})" class="delete-btn" style="margin-top: 10px;">Delete</button>
    `;
    
    return card;
}
function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        reviews = reviews.filter(review => review.id !== id);
        saveToLocalStorage('reviews', reviews);
        displayReviews();
        showNotification('Review deleted successfully', 'info');
    }
}
function updateDashboard() 
{
    const activeSubjectsElement = document.getElementById('activeSubjects');
    const totalStudyHoursElement = document.getElementById('totalStudyHours');
    if (activeSubjectsElement) {
        activeSubjectsElement.textContent = subjects.length;
    }
    if (totalStudyHoursElement) {
        const totalHours = subjects.reduce((sum, subject) => sum + subject.studyHours, 0);
        totalStudyHoursElement.textContent = totalHours;
    }
}
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    switch(type) 
    {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        default:
            notification.style.background = '#667eea';
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
