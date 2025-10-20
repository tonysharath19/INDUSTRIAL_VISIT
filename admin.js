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

  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach((student, index) => {
      const row = document.createElement('tr');
      Object.values(student).forEach(value => {
        const td = document.createElement('td');
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
    let filtered = students;
    const query = searchInput.value.toLowerCase();
    const branch = branchFilter.value;
    const gender = genderFilter.value;
    const meal1 = meal1Filter.value;
    const meal2 = meal2Filter.value;
    const meal3 = meal3Filter.value;

    if (query) {
      filtered = filtered.filter(s => s.usn.toLowerCase().includes(query));
    }
    if (branch) {
      filtered = filtered.filter(s => s.branch === branch);
    }
    if (gender) {
      filtered = filtered.filter(s => s.gender === gender);
    }
    if (meal1) {
      filtered = filtered.filter(s => s.meal1.toLowerCase() === meal1.toLowerCase());
    }
    if (meal2) {
      filtered = filtered.filter(s => s.meal2.toLowerCase() === meal2.toLowerCase());
    }
    if (meal3) {
      filtered = filtered.filter(s => s.meal3.toLowerCase() === meal3.toLowerCase());
    }
    renderTable(filtered);

    // Check if any filter is active
    const filterActive = query || branch || gender || meal1 || meal2 || meal3;
    if (filterActive) {
      let countText = '';
      // Calculate meal counts only for active meal filters
      if (meal1) {
        const day1Veg = filtered.filter(s => s.meal1.toLowerCase().includes('veg')).length;
        const day1NonVeg = filtered.filter(s => s.meal1.toLowerCase().includes('non-veg')).length;
        countText += `Day 1 Veg: ${day1Veg} Non Veg: ${day1NonVeg}`;
      }
      if (meal2) {
        if (countText) countText += ', ';
        const day2Veg = filtered.filter(s => s.meal2.toLowerCase().includes('veg')).length;
        const day2NonVeg = filtered.filter(s => s.meal2.toLowerCase().includes('non-veg')).length;
        countText += `Day 2 Veg: ${day2Veg} Non Veg: ${day2NonVeg}`;
      }
      if (meal3) {
        if (countText) countText += ', ';
        const day3Veg = filtered.filter(s => s.meal3.toLowerCase().includes('veg')).length;
        const day3NonVeg = filtered.filter(s => s.meal3.toLowerCase().includes('non-veg')).length;
        countText += `Day 3 Veg: ${day3Veg} Non Veg: ${day3NonVeg}`;
      }
      if (!meal1 && !meal2 && !meal3) {
        // If no meal filters active, show total
        countText = `Total: ${filtered.length}`;
      }
      totalCount.textContent = countText;
    } else {
      totalCount.textContent = `Total: ${filtered.length}`;
    }
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
  addStudentBtn.addEventListener('click', async () => {
    const newStudent = {
      usn: prompt('Enter USN:'),
      name: prompt('Enter Name:'),
      branch: prompt('Enter Branch:'),
      gender: prompt('Enter Gender:'),
      phone: prompt('Enter Phone:'),
      email: prompt('Enter Email:'),
      bloodGroup: prompt('Enter Blood Group:'),
      emergencyContact: prompt('Enter Emergency Contact:'),
      meal1: prompt('Meal Day 1:'),
      meal2: prompt('Meal Day 2:'),
      meal3: prompt('Meal Day 3:'),
      special: prompt('Special Requests:')
    };
    if (newStudent.usn && newStudent.name) {
      try {
        await addDoc(collection(window.db, "students"), {
          ...newStudent,
          usn: newStudent.usn.toLowerCase(),
          timestamp: new Date()
        });
        loadStudents(); // Reload students
      } catch (error) {
        console.error("Error adding student: ", error);
        alert('Error adding student');
      }
    }
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
      const updatedStudent = {
        usn: document.getElementById('editUsn').value.toLowerCase(),
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
      try {
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
    let csv = 'USN,Name,Branch,Gender,Phone,Email,Blood Group,Emergency Contact,Meal Day 1,Meal Day 2,Meal Day 3,Special Requests\n';
    students.forEach(s => {
      csv += `${s.usn},${s.name},${s.branch},${s.gender},${s.phone},${s.email},${s.bloodGroup},${s.emergencyContact},${s.meal1},${s.meal2},${s.meal3},${s.special.replace(/,/g,';')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.csv';
    link.click();
  });

import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
  