document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentForm');
  const successBox = document.getElementById('successBox');
  const textarea = document.getElementById('special');
  const charCount = document.getElementById('charCount');

  // Live character counter
  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length} / 500`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const usn = form.usn.value.trim();
    const name = form.name.value.trim();
    const branch = form.branch.value;
    const gender = form.gender.value;
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const bloodGroup = form.bloodGroup.value;
    const emergencyContact = form.emergencyContact.value.trim();
    const meal1 = form.meal1.value;
    const meal2 = form.meal2.value;
    const meal3 = form.meal3.value;
    const special = form.special.value.trim();

    // Validation
    const usnValid = /^[A-Za-z0-9]{10}$/.test(usn);
    const phoneValid = /^[0-9]{10}$/.test(phone);
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const emergencyContactValid = /^[0-9]{10}$/.test(emergencyContact);

    if (!usnValid) return alert('USN must be 10 alphanumeric characters.');
    if (!phoneValid) return alert('Phone must be 10 digits.');
    if (!emailValid) return alert('Please enter a valid email address.');
    if (!emergencyContactValid) return alert('Emergency contact must be 10 digits.');

    // Check for duplicate USN
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    const existingStudent = students.find(student => student.usn.toLowerCase() === usn.toLowerCase());
    if (existingStudent) {
      return alert('A student with this USN is already registered.');
    }

    // Save to localStorage
    const studentData = {
      usn, name, branch, gender, phone, email, bloodGroup, emergencyContact,
      meal1, meal2, meal3, special
    };

    students.push(studentData);
    localStorage.setItem('students', JSON.stringify(students));

    // Show success message
    form.classList.add('hidden');
    successBox.classList.remove('hidden');
  });
});
