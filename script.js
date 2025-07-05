document.addEventListener("DOMContentLoaded", function () {
  const bar = document.querySelector(".bar");
  const navLinks = document.querySelector(".nav-links");

  if (bar && navLinks) {
    bar.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cookieSection = document.querySelector(".cookie-cont");

  // თუ უკვე დათანხმებულია, ვეღარ ვხედავთ
  const accepted = localStorage.getItem("cookie-consent");
  if (accepted === "yes" || accepted === "no") {
    if (cookieSection) cookieSection.style.display = "none";
  }
});

// ღილაკის ფუნქცია
function cookieBtnClicked(e, answer) {
  e.preventDefault();
  localStorage.setItem("cookie-consent", answer); // "yes" ან "no"

  const cookieSection = document.querySelector(".cookie-cont");
  if (cookieSection) {
    cookieSection.style.display = "none";
  }
}

async function loadReviews() {
  const response = await fetch("reviews.json");
  const reviews = await response.json();

  const container = document.getElementById("reviews-container");
  if (!container) return;

  reviews.forEach((review) => {
    const div = document.createElement("div");
    div.classList.add("review");

    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    div.innerHTML = `
      <h4>${review.name}</h4>
      <p>${stars}</p>
      <blockquote>"${review.comment}"</blockquote>
    `;
    container.appendChild(div);
  });
}

// ———— რეგისტრაციის ფორმა ————
function initRegistrationForm() {
  const regForm = document.getElementById("registration");
  if (!regForm) return;

  loadRegistrationData();

  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const errors = {};

    const username = getValue("usernamefield");
    const password = getValue("passwordfield");
    const password2 = getValue("passwordfield2");
    const email = getValue("email");
    const agree = document.getElementById("check").checked;

    if (username === "") errors.username = "Username is required";
    if (password === "") errors.password = "Password is required";
    if (password !== password2) errors.password2 = "Passwords do not match";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) errors.email = "Invalid email format";

    if (!agree) errors.agree = "You must accept terms and conditions";

    clearErrors(regForm);
    showErrors(errors, regForm);

    if (Object.keys(errors).length === 0) {
      console.log("✅ Registration Data:");
      console.log("Username:", username);
      console.log("Password:", password);
      console.log("Email:", email);
      console.log("Agreed to Terms:", agree);

      localStorage.setItem(
        "registrationData",
        JSON.stringify({ username, password, email, agree })
      );

      alert("Registration submitted successfully!");
      regForm.reset();
      localStorage.removeItem("registrationData");
    }
  });
}

function loadRegistrationData() {
  const saved = localStorage.getItem("registrationData");
  if (!saved) return;

  const data = JSON.parse(saved);
  document.getElementById("usernamefield").value = data.username || "";
  document.getElementById("passwordfield").value = data.password || "";
  document.getElementById("passwordfield2").value = data.password || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("check").checked = data.agree || false;
}

// ———— ჯავშნის ფორმა ————
function initBookingForm() {
  const bookForm = document.getElementById("booking-form");
  if (!bookForm) return;

  loadBookingData();

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const errors = {};

    const firstName = getValue("firstname");
    const lastName = getValue("lastname");
    const email = getValue("email");
    const room = getValue("room");
    const guests = getValue("guests");

    if (firstName === "") errors.firstname = "First name is required";
    if (lastName === "") errors.lastname = "Last name is required";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) errors.email = "Invalid email format";

    if (room === "") errors.room = "Please select a room";
    if (guests === "" || parseInt(guests) < 1)
      errors.guests = "Please enter valid number of guests";

    clearErrors(bookForm);
    showErrors(errors, bookForm);

    if (Object.keys(errors).length === 0) {
      console.log("✅ Booking Data:");
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Email:", email);
      console.log("Room:", room);
      console.log("Guests:", guests);

      localStorage.setItem(
        "bookingData",
        JSON.stringify({ firstName, lastName, email, room, guests })
      );

      alert("Booking submitted successfully!");
      bookForm.reset();
      localStorage.removeItem("bookingData");
    }
  });
}

function loadBookingData() {
  const saved = localStorage.getItem("bookingData");
  if (!saved) return;

  const data = JSON.parse(saved);

  document.getElementById("firstname").value = data.firstName || "";
  document.getElementById("lastname").value = data.lastName || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("room").value = data.room || "";
  document.getElementById("guests").value = data.guests || "";
}

// ———— Email Live Validation მხოლოდ რეგისტრაციისთვის ————
function initEmailLiveValidation() {
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  if (!emailInput || !emailError) return;

  emailInput.addEventListener("keyup", () => {
    const val = emailInput.value.trim();
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (val === "") {
      emailError.textContent = "";
    } else if (pattern.test(val)) {
      emailError.textContent = "Your Email is Valid";
      emailError.style.color = "green";
    } else {
      emailError.textContent = "Your Email is Invalid";
      emailError.style.color = "red";
    }
  });
}

// ———— პაროლის ხილვადობის გადართვა ————
function initPasswordToggle() {
  const pw1 = document.getElementById("passwordfield");
  const pw2 = document.getElementById("passwordfield2");
  if (!pw1 || !pw2) return;

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Show Password";
  toggleBtn.type = "button";
  toggleBtn.style.marginTop = "10px";
  pw2.parentNode.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    const isText = pw1.type === "text";
    pw1.type = isText ? "password" : "text";
    pw2.type = isText ? "password" : "text";
    toggleBtn.textContent = isText ? "Show Password" : "Hide Password";
  });
}

// ———— დამხმარე ფუნქციები ————
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function clearErrors(form) {
  form.querySelectorAll(".error-text").forEach((el) => (el.innerText = ""));
  const emailError = document.getElementById("email-error");
  if (emailError) emailError.textContent = "";
}

function showErrors(errors, form) {
  for (let key in errors) {
    const el = form.querySelector(`#error-${key}`);
    if (el) el.innerText = errors[key];
  }
}

// ———— ინიციალიზაცია გვერდის ჩატვირთვისას ————
document.addEventListener("DOMContentLoaded", function () {
  loadReviews();
  initRegistrationForm();
  initBookingForm();
  initEmailLiveValidation();
  initPasswordToggle();
});



