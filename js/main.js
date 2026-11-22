// ===== Your email: change this one line =====
var myEmail = "arbaluyot08@gmail.com";
var formUrl = "https://formspree.io/f/xvkawkpd";
// ----- 1. Phone menu: open and close -----
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");

function toggleMenu() {
  var isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
}
navToggle.addEventListener("click", toggleMenu);

// Close the menu after tapping a link
var linkList = navLinks.querySelectorAll("a");
for (var i = 0; i < linkList.length; i++) {
  linkList[i].addEventListener("click", function () {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

// ----- 2. Highlight the nav link of the section you are viewing -----
var sections = document.querySelectorAll("#about, #skills, #projects, #contact");

function highlightNav() {
  var scrollPosition = window.scrollY + 120;
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var top = section.offsetTop;
    var bottom = top + section.offsetHeight;
    var link = navLinks.querySelector('a[href="#' + section.id + '"]');
    if (scrollPosition >= top && scrollPosition < bottom) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  }
}
window.addEventListener("scroll", highlightNav);
highlightNav();

// ----- 3. Email link and footer year -----
document.getElementById("emailLink").textContent = myEmail;
document.getElementById("emailLink").href = "mailto:" + myEmail;
document.getElementById("year").textContent = new Date().getFullYear();

// ----- 4. Contact form -----
// No server needed: this opens the visitor's email app with the message filled in.
var form = document.getElementById("contactForm");
var formMessage = document.getElementById("formMessage");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  // Check that all fields are filled
  if (name === "" || email === "" || message === "") {
    formMessage.textContent = "Please fill in all fields.";
    return;
  }
  // Basic email check
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }

  formMessage.textContent = "Sending...";

// Send the form data to Formspree, which forwards it to your Gmail
fetch(formUrl, {
  method: "POST",
  body: new FormData(form),
  headers: { "Accept": "application/json" }
})
  .then(function (response) {
    if (response.ok) {
      formMessage.textContent = "Thanks! Your message was sent.";
      form.reset();
    } else {
      formMessage.textContent = "Something went wrong. Please try again.";
    }
  })
  .catch(function () {
    formMessage.textContent = "Network error. Please try again.";
  });
});

// ----- 5. Full image viewer with Next / Previous -----
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var lightboxDownload = document.getElementById("lightboxDownload");
var lightboxCount = document.getElementById("lightboxCount");
var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");
var imageButtons = document.querySelectorAll("button.project-image");

var currentImages = [];  // the photos of the project you clicked
var currentIndex = 0;    // which photo is showing now

// Show the photo at currentIndex
function showImage() {
  var path = currentImages[currentIndex];
  lightboxImg.src = path;
  lightboxDownload.href = path;
  lightboxCount.textContent = (currentIndex + 1) + " / " + currentImages.length;

  // Hide the arrows and counter when there is only one photo
  var hasMany = currentImages.length > 1;
  prevButton.hidden = !hasMany;
  nextButton.hidden = !hasMany;
  lightboxCount.hidden = !hasMany;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  showImage();
}

function previousImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  showImage();
}

function openLightbox(event) {
  var button = event.currentTarget;
  var list = button.getAttribute("data-images");

  if (list) {
    // Many photos: split the comma list into separate paths
    currentImages = list.split(",").map(function (item) { return item.trim(); });
  } else {
    // One photo
    currentImages = [button.getAttribute("data-full")];
  }

  currentIndex = 0;
  lightboxImg.alt = button.querySelector("img").alt;
  showImage();
  lightbox.showModal();
}

for (var j = 0; j < imageButtons.length; j++) {
  imageButtons[j].addEventListener("click", openLightbox);
}

nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", previousImage);

// Close with the ✕ button or by clicking the dark background
lightbox.addEventListener("click", function (event) {
  var clickedBackground = event.target === lightbox;
  var clickedClose = event.target.classList.contains("lightbox-close");
  if (clickedBackground || clickedClose) {
    lightbox.close();
  }
});

// Keyboard: left and right arrow keys change photo (Esc closes automatically)
document.addEventListener("keydown", function (event) {
  if (!lightbox.open) { return; }
  if (event.key === "ArrowRight") { nextImage(); }
  if (event.key === "ArrowLeft") { previousImage(); }
});
