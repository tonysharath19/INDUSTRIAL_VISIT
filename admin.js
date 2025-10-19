// Redirect to login if not authorized
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = "admin-login.html";
  }
  
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = "adminlogin.html";
  });
  
  // Load students
  let students = JSON.parse(localStorage.getItem('students') || '[]');
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
  addStudentBtn.addEventListener('click', () => {
    const newStudent = {
      usn: prompt('Enter USN:'),
      name: prompt('Enter Name:'),
      branch: prompt('Enter Branch:'),
      gender: prompt('Enter Gender:'),
      phone: prompt('Enter Phone:'),
      email: prompt('Enter Email:'),
      meal1: prompt('Meal Day 1:'),
      meal2: prompt('Meal Day 2:'),
      meal3: prompt('Meal Day 3:'),
      special: prompt('Special Requests:')
    };
    if (newStudent.usn && newStudent.name) {
      students.push(newStudent);
      localStorage.setItem('students', JSON.stringify(students));
      applyFilters();
    }
  });

  // Edit Student
  function editStudent(index) {
    const student = students[index];
    student.name = prompt('Edit Name:', student.name) || student.name;
    student.branch = prompt('Edit Branch:', student.branch) || student.branch;
    student.gender = prompt('Edit Gender:', student.gender) || student.gender;
    student.phone = prompt('Edit Phone:', student.phone) || student.phone;
    student.email = prompt('Edit Email:', student.email) || student.email;
    student.meal1 = prompt('Edit Meal Day 1:', student.meal1) || student.meal1;
    student.meal2 = prompt('Edit Meal Day 2:', student.meal2) || student.meal2;
    student.meal3 = prompt('Edit Meal Day 3:', student.meal3) || student.meal3;
    student.special = prompt('Edit Special Requests:', student.special) || student.special;
    localStorage.setItem('students', JSON.stringify(students));
    applyFilters();
  }

  // Delete Student
  function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
      students.splice(index, 1);
      localStorage.setItem('students', JSON.stringify(students));
      applyFilters();
    }
  }

  // Download Excel
  downloadBtn.addEventListener('click', () => {
    let csv = 'USN,Name,Branch,Gender,Phone,Email,Meal Day 1,Meal Day 2,Meal Day 3,Special Requests\n';
    students.forEach(s => {
      csv += `${s.usn},${s.name},${s.branch},${s.gender},${s.phone},${s.email},${s.meal1},${s.meal2},${s.meal3},${s.special.replace(/,/g,';')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.csv';
    link.click();
  });
  