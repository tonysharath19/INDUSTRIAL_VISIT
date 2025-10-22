// Check localStorage for admin login (fallback to localStorage for simplicity)
if (localStorage.getItem('adminLoggedIn') !== 'true') {
  window.location.href = "adminlogin.html";
}

// Debug: Log that we're on admin page
console.log('Admin page loaded, checking auth...');
console.log('adminLoggedIn:', localStorage.getItem('adminLoggedIn'));

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('adminLoggedIn');
  window.location.href = "adminlogin.html";
});

// Load students from Firestore
let students = [];
let studentDocs = []; // Store document references for updates/deletes
const tableBody = document.querySelector('#studentsTable tbody');
const searchInput = document.getElementById('searchInput');
const branchFilter = document.getElementById('branchFilter');
const genderFilter = document.getElementById('genderFilter');
const meal1Filter = document.getElementById('meal1Filter');
const meal2Filter = document.getElementById('meal2Filter');
const meal3Filter = document.getElementById('meal3Filter');
const addStudentBtn = document.getElementById('addStudentBtn');
const downloadBtn = document.getElementById('downloadBtn');
const totalCount = document.getElementById('totalCount');
const totalStudentsCount = document.getElementById('totalStudentsCount');

  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach((student, index) => {
      const row = document.createElement('tr');
      // Add serial number as first column
      const slNoTd = document.createElement('td');
      slNoTd.textContent = index + 1;
      row.appendChild(slNoTd);
      // Define the order of fields to display (matching table headers)
      const fields = ['usn', 'name', 'branch', 'gender', 'phone', 'email', 'bloodGroup', 'emergencyContact', 'meal1', 'meal2', 'meal3', 'special'];
      fields.forEach((field, fieldIndex) => {
        const td = document.createElement('td');
        let value = student[field] || '';
        // Convert USN (index 0) and Name (index 1) to uppercase
        if (fieldIndex === 0 || fieldIndex === 1) {
          value = value.toUpperCase();
        }
        td.textContent = value;
        row.appendChild(td);
      });
      // Add actions column
      const actionsTd = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'action-btn edit';
      editBtn.onclick = () => editStudent(index);
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'action-btn delete';
      deleteBtn.onclick = () => deleteStudent(index);
      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(deleteBtn);
      row.appendChild(actionsTd);
      tableBody.appendChild(row);
    });
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const branch = branchFilter.value;
    const gender = genderFilter.value;
    const meal1 = meal1Filter.value;
    const meal2 = meal2Filter.value;
    const meal3 = meal3Filter.value;

    // First, apply non-meal filters to get baseFiltered
    let baseFiltered = students;
    if (query) {
      baseFiltered = baseFiltered.filter(s => s.usn.toLowerCase().includes(query));
    }
    if (branch) {
      baseFiltered = baseFiltered.filter(s => s.branch === branch);
    }
    if (gender) {
      baseFiltered = baseFiltered.filter(s => s.gender === gender);
    }

    // Now, apply meal filters to baseFiltered to get filtered for display
    let filtered = baseFiltered;
    if (meal1) {
      if (meal1.toLowerCase() === 'veg') {
        filtered = filtered.filter(s => s.meal1.toLowerCase().includes('veg') && !s.meal1.toLowerCase().includes('non'));
      } else if (meal1.toLowerCase() === 'non-veg') {
        filtered = filtered.filter(s => s.meal1.toLowerCase().includes('non-veg'));
      }
    }
    if (meal2) {
      if (meal2.toLowerCase() === 'veg') {
        filtered = filtered.filter(s => s.meal2.toLowerCase().includes('veg') && !s.meal2.toLowerCase().includes('non'));
      } else if (meal2.toLowerCase() === 'non-veg') {
        filtered = filtered.filter(s => s.meal2.toLowerCase().includes('non-veg'));
      }
    }
    if (meal3) {
      if (meal3.toLowerCase() === 'veg') {
        filtered = filtered.filter(s => s.meal3.toLowerCase().includes('veg') && !s.meal3.toLowerCase().includes('non'));
      } else if (meal3.toLowerCase() === 'non-veg') {
        filtered = filtered.filter(s => s.meal3.toLowerCase().includes('non-veg'));
      }
    }
    renderTable(filtered);

    // Update total students count
    totalStudentsCount.textContent = `Total Students: ${filtered.length}`;

    // Always calculate and display veg/non-veg counts for each day from baseFiltered
    let countText = '';
    const day1Veg = baseFiltered.filter(s => s.meal1.toLowerCase().includes('veg') && !s.meal1.toLowerCase().includes('non')).length;
    const day1NonVeg = baseFiltered.filter(s => s.meal1.toLowerCase().includes('non-veg')).length;
    countText += `Day 1: Veg: ${day1Veg}, Non-Veg: ${day1NonVeg}<br>`;

    const day2Veg = baseFiltered.filter(s => s.meal2.toLowerCase().includes('veg') && !s.meal2.toLowerCase().includes('non')).length;
    const day2NonVeg = baseFiltered.filter(s => s.meal2.toLowerCase().includes('non-veg')).length;
    countText += `Day 2: Veg: ${day2Veg}, Non-Veg: ${day2NonVeg}<br>`;

    const day3Veg = baseFiltered.filter(s => s.meal3.toLowerCase().includes('veg') && !s.meal3.toLowerCase().includes('non')).length;
    const day3NonVeg = baseFiltered.filter(s => s.meal3.toLowerCase().includes('non-veg')).length;
    countText += `Day 3: Veg: ${day3Veg}, Non-Veg: ${day3NonVeg}`;

    totalCount.innerHTML = countText;
  }

  // Initial render
  renderTable(students);

  // Search / Filter
  searchInput.addEventListener('input', applyFilters);
  branchFilter.addEventListener('change', applyFilters);
  genderFilter.addEventListener('change', applyFilters);
  meal1Filter.addEventListener('change', applyFilters);
  meal2Filter.addEventListener('change', applyFilters);
  meal3Filter.addEventListener('change', applyFilters);

  // Sorting
  document.querySelectorAll('#studentsTable th').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (key) {
        students.sort((a,b) =>
          a[key].toString().localeCompare(b[key].toString())
        );
        applyFilters();
      }
    });
  });

  // Add Student
  addStudentBtn.addEventListener('click', () => {
    document.getElementById('addModal').classList.remove('hidden');
  });

  // Close add modal
  document.getElementById('closeAddModal').addEventListener('click', () => {
    document.getElementById('addModal').classList.add('hidden');
  });

  // Add form submission
  document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usn = document.getElementById('addUsn').value.toLowerCase();
    try {
      // Check for duplicate USN in Firestore
      const q = query(collection(window.db, "students"), where("usn", "==", usn));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return alert('A student with this USN is already registered.');
      }

      const newStudent = {
        usn: usn,
        name: document.getElementById('addName').value,
        branch: document.getElementById('addBranch').value,
        gender: document.getElementById('addGender').value,
        phone: document.getElementById('addPhone').value,
        email: document.getElementById('addEmail').value,
        bloodGroup: document.getElementById('addBloodGroup').value,
        emergencyContact: document.getElementById('addEmergencyContact').value,
        meal1: document.getElementById('addMeal1').value,
        meal2: document.getElementById('addMeal2').value,
        meal3: document.getElementById('addMeal3').value,
        special: document.getElementById('addSpecial').value
      };
      await addDoc(collection(window.db, "students"), {
        ...newStudent,
        timestamp: new Date()
      });
      loadStudents(); // Reload students
      document.getElementById('addModal').classList.add('hidden');
      document.getElementById('addForm').reset();
    } catch (error) {
      console.error("Error adding student: ", error);
      alert('Error adding student');
    }
  });

  // Character count for add special
  document.getElementById('addSpecial').addEventListener('input', (e) => {
    const count = e.target.value.length;
    document.getElementById('addCharCount').textContent = `${count} / 500`;
  });

  // Edit Student
  let editIndex = -1;
  function editStudent(index) {
    editIndex = index;
    const student = students[index];
    document.getElementById('editUsn').value = student.usn;
    document.getElementById('editName').value = student.name;
    document.getElementById('editBranch').value = student.branch;
    document.getElementById('editGender').value = student.gender;
    document.getElementById('editPhone').value = student.phone;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editBloodGroup').value = student.bloodGroup;
    document.getElementById('editEmergencyContact').value = student.emergencyContact;
    document.getElementById('editMeal1').value = student.meal1;
    document.getElementById('editMeal2').value = student.meal2;
    document.getElementById('editMeal3').value = student.meal3;
    document.getElementById('editSpecial').value = student.special;
    document.getElementById('editCharCount').textContent = `${student.special.length} / 500`;
    document.getElementById('editModal').classList.remove('hidden');
  }

  // Close modal
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
  });

  // Edit form submission
  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (editIndex !== -1) {
      const usn = document.getElementById('editUsn').value.toLowerCase();
      const originalUsn = students[editIndex].usn.toLowerCase();
      try {
        // Check for duplicate USN if USN has changed
        if (usn !== originalUsn) {
          const q = query(collection(window.db, "students"), where("usn", "==", usn));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            return alert('A student with this USN is already registered.');
          }
        }

        const updatedStudent = {
          usn: usn,
          name: document.getElementById('editName').value,
          branch: document.getElementById('editBranch').value,
          gender: document.getElementById('editGender').value,
          phone: document.getElementById('editPhone').value,
          email: document.getElementById('editEmail').value,
          bloodGroup: document.getElementById('editBloodGroup').value,
          emergencyContact: document.getElementById('editEmergencyContact').value,
          meal1: document.getElementById('editMeal1').value,
          meal2: document.getElementById('editMeal2').value,
          meal3: document.getElementById('editMeal3').value,
          special: document.getElementById('editSpecial').value
        };
        await updateDoc(doc(window.db, "students", studentDocs[editIndex]), updatedStudent);
        loadStudents(); // Reload students
        document.getElementById('editModal').classList.add('hidden');
      } catch (error) {
        console.error("Error updating student: ", error);
        alert('Error updating student');
      }
    }
  });

  // Character count for edit special
  document.getElementById('editSpecial').addEventListener('input', (e) => {
    const count = e.target.value.length;
    document.getElementById('editCharCount').textContent = `${count} / 500`;
  });

  // Delete Student
  async function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteDoc(doc(window.db, "students", studentDocs[index]));
        loadStudents(); // Reload students
      } catch (error) {
        console.error("Error deleting student: ", error);
        alert('Error deleting student');
      }
    }
  }

// Download Excel
  downloadBtn.addEventListener('click', () => {
    let csv = 'Sl No,USN,Name,Branch,Gender,Phone,Email,Blood Group,Emergency Contact,Meal Day 1,Meal Day 2,Meal Day 3,Special Requests\n';
    students.forEach((s, index) => {
      csv += `${index + 1},${s.usn},${s.name},${s.branch},${s.gender},${s.phone},${s.email},${s.bloodGroup},${s.emergencyContact},${s.meal1},${s.meal2},${s.meal3},${s.special.replace(/,/g,';')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.csv';
    link.click();
  });

import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Load students from Firestore
async function loadStudents() {
  try {
    const querySnapshot = await getDocs(collection(window.db, "students"));
    students = [];
    studentDocs = [];
    querySnapshot.forEach((doc) => {
      students.push(doc.data());
      studentDocs.push(doc.id);
    });
    applyFilters();
  } catch (error) {
    console.error("Error loading students: ", error);
  }
}

// Call loadStudents on page load
loadStudents();
  