// Student Management System
class StudentManagementSystem {
    constructor() {
        this.students = [];
        this.chart = null;
        this.activityLog = [];
        this.loadData();
        this.initializeEventListeners();
        this.updateDate();
        this.renderDashboard();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add student button
        document.getElementById('addStudentBtn').addEventListener('click', () => {
            this.openModal('add');
        });

        // Search
        document.getElementById('searchStudent').addEventListener('click', () => {
            this.searchStudents();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            this.importData();
        });

        // Chart tabs
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChart(e.target.dataset.chart);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    // Load data from localStorage
    loadData() {
        const saved = localStorage.getItem('students');
        if (saved) {
            this.students = JSON.parse(saved);
        } else {
            // Sample data
            this.students = [
                {
                    id: '1',
                    name: 'Thabo Mbeki',
                    grade: '12',
                    class: 'A',
                    email: 'thabo.m@school.co.za',
                    phone: '+27 12 345 6789',
                    address: 'Soweto, Johannesburg',
                    subjects: {
                        math: 85,
                        english: 78,
                        science: 92,
                        history: 88
                    },
                    attendance: 95,
                    status: 'active'
                },
                {
                    id: '2',
                    name: 'Sarah Jones',
                    grade: '11',
                    class: 'B',
                    email: 'sarah.j@school.co.za',
                    phone: '+27 12 345 6790',
                    address: 'Sandton, Johannesburg',
                    subjects: {
                        math: 92,
                        english: 88,
                        science: 85,
                        history: 90
                    },
                    attendance: 98,
                    status: 'active'
                },
                {
                    id: '3',
                    name: 'John Doe',
                    grade: '10',
                    class: 'A',
                    email: 'john.d@school.co.za',
                    phone: '+27 12 345 6791',
                    address: 'Pretoria, Gauteng',
                    subjects: {
                        math: 65,
                        english: 72,
                        science: 68,
                        history: 70
                    },
                    attendance: 82,
                    status: 'active'
                }
            ];
            this.saveData();
        }
        this.loadActivity();
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('students', JSON.stringify(this.students));
        this.addActivity('Data saved', 'info');
    }

    // Load activity log
    loadActivity() {
        const saved = localStorage.getItem('activityLog');
        if (saved) {
            this.activityLog = JSON.parse(saved);
        } else {
            this.activityLog = [
                { action: 'System initialized', time: new Date().toISOString(), icon: 'info' }
            ];
        }
        this.renderActivity();
    }

    // Add activity
    addActivity(action, type = 'info') {
        const activity = {
            action,
            time: new Date().toISOString(),
            icon: type
        };
        this.activityLog.unshift(activity);
        if (this.activityLog.length > 10) {
            this.activityLog.pop();
        }
        localStorage.setItem('activityLog', JSON.stringify(this.activityLog));
        this.renderActivity();
    }

    // Render activity log
    renderActivity() {
        const container = document.getElementById('activityLog');
        container.innerHTML = '';

        this.activityLog.slice(0, 5).forEach(activity => {
            const time = new Date(activity.time);
            const timeStr = time.toLocaleTimeString();

            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.icon)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.action}</div>
                    <div class="activity-time">${timeStr}</div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    getActivityIcon(type) {
        const icons = {
            add: 'fa-user-plus',
            edit: 'fa-edit',
            delete: 'fa-user-minus',
            attendance: 'fa-calendar-check',
            export: 'fa-download',
            import: 'fa-upload',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // Update date
    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    // Render dashboard
    renderDashboard() {
        this.renderStudentsTable();
        this.updateStats();
        this.updateChart('grades');
    }

    // Render students table
    renderStudentsTable(filteredStudents = null) {
        const tbody = document.getElementById('studentsTableBody');
        const students = filteredStudents || this.students;

        tbody.innerHTML = '';

        students.forEach(student => {
            const avg = this.calculateAverage(student.subjects);
            const status = this.getStatus(avg);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.grade}${student.class}</td>
                <td>${student.attendance}%</td>
                <td>${avg}%</td>
                <td><span class="status-badge status-${status}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="sms.editStudent('${student.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn attendance" onclick="sms.markAttendance('${student.id}')">
                            <i class="fas fa-calendar-check"></i>
                        </button>
                        <button class="action-btn delete" onclick="sms.deleteStudent('${student.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update total count
        document.getElementById('totalStudents').textContent = this.students.length;
    }

    // Calculate average grade
    calculateAverage(subjects) {
        const values = Object.values(subjects);
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return Math.round(sum / values.length);
    }

    // Get status based on average
    getStatus(avg) {
        if (avg >= 75) return 'good';
        if (avg >= 50) return 'warning';
        return 'danger';
    }

    // Update statistics
    updateStats() {
        // Average grade
        const averages = this.students.map(s => this.calculateAverage(s.subjects));
        const avgGrade = averages.length ? Math.round(averages.reduce((a, b) => a + b, 0) / averages.length) : 0;
        document.getElementById('avgGrade').textContent = avgGrade + '%';

        // Average attendance
        const attendance = this.students.map(s => s.attendance);
        const avgAttendance = attendance.length ? Math.round(attendance.reduce((a, b) => a + b, 0) / attendance.length) : 0;
        document.getElementById('avgAttendance').textContent = avgAttendance + '%';

        // Top performer
        if (this.students.length) {
            const topStudent = this.students.reduce((prev, current) => {
                const prevAvg = this.calculateAverage(prev.subjects);
                const currAvg = this.calculateAverage(current.subjects);
                return prevAvg > currAvg ? prev : current;
            });
            document.getElementById('topPerformer').textContent = topStudent.name.split(' ')[0];
        } else {
            document.getElementById('topPerformer').textContent = '-';
        }
    }

    // Update chart
    updateChart(type) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        let data, options;

        switch(type) {
            case 'grades':
                data = {
                    labels: this.students.map(s => s.name.split(' ')[0]),
                    datasets: [{
                        label: 'Average Grade',
                        data: this.students.map(s => this.calculateAverage(s.subjects)),
                        backgroundColor: 'rgba(67, 97, 238, 0.5)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 1
                    }]
                };
                options = {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                };
                break;

            case 'attendance':
                data = {
                    labels: this.students.map(s => s.name.split(' ')[0]),
                    datasets: [{
                        label: 'Attendance %',
                        data: this.students.map(s => s.attendance),
                        backgroundColor: 'rgba(76, 201, 240, 0.5)',
                        borderColor: 'rgba(76, 201, 240, 1)',
                        borderWidth: 1
                    }]
                };
                options = {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                };
                break;

            case 'performance':
                // Grade distribution
                const distribution = {
                    '90-100': 0,
                    '80-89': 0,
                    '70-79': 0,
                    '60-69': 0,
                    'Below 60': 0
                };

                this.students.forEach(s => {
                    const avg = this.calculateAverage(s.subjects);
                    if (avg >= 90) distribution['90-100']++;
                    else if (avg >= 80) distribution['80-89']++;
                    else if (avg >= 70) distribution['70-79']++;
                    else if (avg >= 60) distribution['60-69']++;
                    else distribution['Below 60']++;
                });

                data = {
                    labels: Object.keys(distribution),
                    datasets: [{
                        data: Object.values(distribution),
                        backgroundColor: [
                            'rgba(67, 97, 238, 0.5)',
                            'rgba(76, 201, 240, 0.5)',
                            'rgba(247, 37, 133, 0.5)',
                            'rgba(244, 162, 97, 0.5)',
                            'rgba(244, 67, 54, 0.5)'
                        ],
                        borderColor: [
                            'rgba(67, 97, 238, 1)',
                            'rgba(76, 201, 240, 1)',
                            'rgba(247, 37, 133, 1)',
                            'rgba(244, 162, 97, 1)',
                            'rgba(244, 67, 54, 1)'
                        ],
                        borderWidth: 1
                    }]
                };
                options = {
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                };
                break;
        }

        this.chart = new Chart(ctx, {
            type: type === 'performance' ? 'pie' : 'bar',
            data: data,
            options: options
        });
    }

    // Search students
    searchStudents() {
        const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
        
        if (!searchTerm) {
            this.renderStudentsTable();
            return;
        }

        const filtered = this.students.filter(s => 
            s.name.toLowerCase().includes(searchTerm) ||
            s.grade.includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm)
        );

        this.renderStudentsTable(filtered);
    }

    // Open modal for add/edit
    openModal(mode, studentId = null) {
        const modal = document.getElementById('studentModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('studentForm');

        if (mode === 'add') {
            title.textContent = 'Add New Student';
            form.reset();
            document.getElementById('studentId').value = '';
        } else {
            title.textContent = 'Edit Student';
            const student = this.students.find(s => s.id === studentId);
            if (student) {
                document.getElementById('studentId').value = student.id;
                document.getElementById('studentName').value = student.name;
                document.getElementById('studentGrade').value = student.grade;
                document.getElementById('studentClass').value = student.class;
                document.getElementById('studentEmail').value = student.email;
                document.getElementById('studentPhone').value = student.phone;
                document.getElementById('studentAddress').value = student.address;
                document.getElementById('mathGrade').value = student.subjects.math;
                document.getElementById('englishGrade').value = student.subjects.english;
                document.getElementById('scienceGrade').value = student.subjects.science;
                document.getElementById('historyGrade').value = student.subjects.history;
                document.getElementById('attendanceDays').value = student.attendance;
            }
        }

        modal.style.display = 'block';
    }

    // Close modal
    closeModal() {
        document.getElementById('studentModal').style.display = 'none';
        document.getElementById('reportModal').style.display = 'none';
    }

    // Save student
    saveStudent() {
        const studentId = document.getElementById('studentId').value;
        const studentData = {
            id: studentId || Date.now().toString(),
            name: document.getElementById('studentName').value,
            grade: document.getElementById('studentGrade').value,
            class: document.getElementById('studentClass').value,
            email: document.getElementById('studentEmail').value,
            phone: document.getElementById('studentPhone').value,
            address: document.getElementById('studentAddress').value,
            subjects: {
                math: parseFloat(document.getElementById('mathGrade').value) || 0,
                english: parseFloat(document.getElementById('englishGrade').value) || 0,
                science: parseFloat(document.getElementById('scienceGrade').value) || 0,
                history: parseFloat(document.getElementById('historyGrade').value) || 0
            },
            attendance: parseInt(document.getElementById('attendanceDays').value) || 0,
            status: 'active'
        };

        if (studentId) {
            // Update existing
            const index = this.students.findIndex(s => s.id === studentId);
            this.students[index] = studentData;
            this.addActivity(`Updated student: ${studentData.name}`, 'edit');
        } else {
            // Add new
            this.students.push(studentData);
            this.addActivity(`Added new student: ${studentData.name}`, 'add');
        }

        this.saveData();
        this.renderDashboard();
        this.closeModal();
    }

    // Edit student
    editStudent(studentId) {
        this.openModal('edit', studentId);
    }

    // Delete student
    deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            const student = this.students.find(s => s.id === studentId);
            this.students = this.students.filter(s => s.id !== studentId);
            this.saveData();
            this.renderDashboard();
            this.addActivity(`Deleted student: ${student.name}`, 'delete');
        }
    }

    // Mark attendance
    markAttendance(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            const newAttendance = prompt(`Enter attendance % for ${student.name}:`, student.attendance);
            if (newAttendance !== null && !isNaN(newAttendance)) {
                student.attendance = parseInt(newAttendance);
                this.saveData();
                this.renderDashboard();
                this.addActivity(`Updated attendance for ${student.name}`, 'attendance');
            }
        }
    }

    // Mark attendance for all
    markAttendanceAll() {
        const date = prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
        if (date) {
            this.addActivity(`Marked attendance for all students on ${date}`, 'attendance');
            alert('Attendance marked for all students!');
        }
    }

    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.students, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `students_export_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.addActivity('Exported student data', 'export');
    }

    // Import data
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = readerEvent => {
                try {
                    const content = readerEvent.target.result;
                    const importedData = JSON.parse(content);
                    
                    if (Array.isArray(importedData)) {
                        this.students = importedData;
                        this.saveData();
                        this.renderDashboard();
                        this.addActivity('Imported student data', 'import');
                        alert('Data imported successfully!');
                    } else {
                        alert('Invalid file format');
                    }
                } catch (error) {
                    alert('Error importing file');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Generate report
    generateReport() {
        const modal = document.getElementById('reportModal');
        const content = document.getElementById('reportContent');

        let reportHTML = `
            <div class="report-section">
                <h3>Student Performance Report</h3>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Total Students: ${this.students.length}</p>
            </div>
            
            <div class="report-section">
                <h3>Summary Statistics</h3>
                <div class="summary-box">
                    <p>Average Grade: ${document.getElementById('avgGrade').textContent}</p>
                    <p>Average Attendance: ${document.getElementById('avgAttendance').textContent}</p>
                    <p>Top Performer: ${document.getElementById('topPerformer').textContent}</p>
                </div>
            </div>
            
            <div class="report-section">
                <h3>Student Details</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Grade</th>
                            <th>Average</th>
                            <th>Attendance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.students.forEach(student => {
            const avg = this.calculateAverage(student.subjects);
            const status = this.getStatus(avg);
            reportHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.grade}${student.class}</td>
                    <td>${avg}%</td>
                    <td>${student.attendance}%</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        reportHTML += `
                    </tbody>
                </table>
            </div>
        `;

        content.innerHTML = reportHTML;
        modal.style.display = 'block';
        this.addActivity('Generated performance report', 'export');
    }

    // Send notifications
    sendNotifications() {
        const message = prompt('Enter notification message for all students:');
        if (message) {
            this.addActivity(`Sent notification: "${message.substring(0, 30)}..."`, 'info');
            alert('Notifications sent successfully!');
        }
    }

    // Backup data
    backupData() {
        const backup = {
            students: this.students,
            activityLog: this.activityLog,
            backupDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const backupFileDefaultName = `backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', backupFileDefaultName);
        linkElement.click();
        
        this.addActivity('Created system backup', 'export');
    }
}

// Initialize the system
const sms = new StudentManagementSystem();

// Global functions
function saveStudent() {
    sms.saveStudent();
}

function closeModal() {
    sms.closeModal();
}

function markAttendanceAll() {
    sms.markAttendanceAll();
}

function generateReport() {
    sms.generateReport();
}

function sendNotifications() {
    sms.sendNotifications();
}

function backupData() {
    sms.backupData();
}