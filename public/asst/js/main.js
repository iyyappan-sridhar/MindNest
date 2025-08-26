const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = star.getAttribute('data-value');
    ratingInput.value = value;
    stars.forEach(s => s.classList.remove('active'));
    star.classList.add('active');
    for (let i = 0; i < value; i++) {
      stars[i].classList.add('active');
    }
  });
});

const steps = document.querySelectorAll('.form-step');
const next1 = document.getElementById('next1');
const next2 = document.getElementById('next2');
const prev2 = document.getElementById('prev2');
const prev3 = document.getElementById('prev3');
const form = document.getElementById('counselingForm');
const confirmText = document.getElementById('confirmText');

// 👉 Step navigation
next1.addEventListener('click', () => {
  steps[0].classList.remove('active');
  steps[1].classList.add('active');
});

next2.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const counselingType = document.getElementById('counselingType').value;
  const counselor = document.getElementById('counselor').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  confirmText.innerHTML = `
    <span>Name: ${name}</span><br>
    <span>Age: ${age}</span><br>
    <span>Gender: ${gender}</span><br>
    <span>Email: ${email}</span><br>
    <span>Phone: ${phone}</span><br>
    <span>Counseling Type: ${counselingType}</span><br>
    <span>Preferred Counselor: ${counselor || 'None'}</span><br>
    <span>Date: ${date}</span><br>
    <span>Time: ${time}</span>
  `;

  steps[1].classList.remove('active');
  steps[2].classList.add('active');
});

prev2.addEventListener('click', () => {
  steps[1].classList.remove('active');
  steps[0].classList.add('active');
});

prev3.addEventListener('click', () => {
  steps[2].classList.remove('active');
  steps[1].classList.add('active');
});

// 👉 Form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    counselingType: document.getElementById('counselingType').value,
    counselor: document.getElementById('counselor').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    rating: ratingInput ? ratingInput.value : null
  };

  try {
    // ✅ Use relative path (works on Render too)
    const res = await fetch("/api/counseling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("📥 Server response:", data);

    // Reset form
    form.reset();
    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');

    // ✅ Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ Could not connect to server");
  }
});
