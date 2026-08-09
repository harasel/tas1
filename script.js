/* ==========================================================================
   THE ATTRACTION STRATEGIST — script.js
   Vanilla JS only. Quiet, restrained interactions.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- Nav */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-condensed", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ------------------------------------------------------ Mobile drawer */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ------------------------------------------- Slow reveal on scroll */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------- Testimonial rotation */
  var voices = Array.prototype.slice.call(document.querySelectorAll(".voice"));
  var dotsWrap = document.getElementById("voicesDots");
  if (voices.length && dotsWrap) {
    var index = 0;
    var timer = null;

    var show = function (next) {
      voices[index].classList.remove("is-active");
      dotsWrap.children[index].setAttribute("aria-selected", "false");
      index = (next + voices.length) % voices.length;
      voices[index].classList.add("is-active");
      dotsWrap.children[index].setAttribute("aria-selected", "true");
    };

    voices.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.setAttribute("aria-label", "Testimonial " + (i + 1));
      dot.addEventListener("click", function () { show(i); restart(); });
      dotsWrap.appendChild(dot);
    });

    var restart = function () {
      if (reduceMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { show(index + 1); }, 7000);
    };
    restart();
  }

  /* ------------------------------------------------- FAQ accordion */
  document.querySelectorAll(".accordion__item").forEach(function (item) {
    var trigger = item.querySelector(".accordion__trigger");
    var panel = item.querySelector(".accordion__panel");

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      // Close siblings for a calmer reading rhythm.
      item.parentElement.querySelectorAll(".accordion__item.is-open").forEach(function (open) {
        open.classList.remove("is-open");
        open.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
        open.querySelector(".accordion__panel").style.height = "0px";
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.height = panel.scrollHeight + "px";
      }
    });
  });

  /* ------------------------------------------------ Application form */
  var form = document.getElementById("applyForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("formStatus");
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();

      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = "Please add your name and a valid email.";
        return;
      }
      status.textContent = "Thank you — your application has been received.";
      form.reset();
    });
  }

  /* --------------------------------------------------------- Footer */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
