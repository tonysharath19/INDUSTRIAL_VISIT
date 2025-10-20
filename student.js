import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentForm');
  const successBox = document.getElementById('successBox');
  const textarea = document.getElementById('special');
  const charCount = document.getElementById('charCount');

  // Live character counter
  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length} / 500`;
  });

  form.addEventListener('submit', async (e) => {
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

    try {
      // Check for duplicate USN in Firestore
      const q = query(collection(window.db, "students"), where("usn", "==", usn.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return alert('A student with this USN is already registered.');
      }

      // Save to Firestore
      const studentData = {
        usn: usn.toLowerCase(),
        name,
        branch,
        gender,
        phone,
        email,
        bloodGroup,
        emergencyContact,
        meal1,
        meal2,
        meal3,
        special,
        timestamp: new Date()
      };

      await addDoc(collection(window.db, "students"), studentData);

      // Show success message
      form.classList.add('hidden');
      successBox.classList.remove('hidden');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  });
});
