// Initialize EmailJS
emailjs.init('1ZGLkC5ODKZdWBExC'); // Replace with your EmailJS user ID

const form = document.getElementById('reminderForm');
const messageDiv = document.getElementById('message');

// Helper function to format phone numbers
function formatPhoneNumber(number) {
  number = number.replace(/\s+/g, ''); // remove all spaces
  if (!number.startsWith('+')) {
    return '+' + number;
  }
  return number;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    patientName: document.getElementById('patientName').value,
    medicine: document.getElementById('medicine').value,
    time: document.getElementById('time').value,
    phoneNumber: formatPhoneNumber(document.getElementById('phoneNumber').value),
    familyContact: formatPhoneNumber(document.getElementById('familyContact').value),
    email: document.getElementById('email').value
  };

  // 1. Save to Google Sheets
  fetch('https://script.google.com/macros/s/AKfycbzHB667qAeV1TVFDky2mLKzLR4L9I-FT3mevKnjb-Y5BzstAtFzY4GqTRn7N3N8vCVSZw/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(() => {  // ✅ Assume success (because of 'no-cors')
    console.log("Data sent to Google Sheets (no-cors, no confirmation).");
    messageDiv.innerText = "Reminder saved successfully!";
    
    // 2. Send Email via EmailJS
    return emailjs.send('service_3666l5d', 'template_uxo8gcl', {
      patient_name: formData.patientName,
      medicine_name: formData.medicine,
      family_email: formData.email
    });
  })
  .then(() => {
    console.log('Email sent!');
  })
  .catch(error => {
    console.error(error);
    messageDiv.innerText = "Error: " + error.message;
  });

  form.reset();
});
