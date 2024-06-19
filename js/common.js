$(document).ready(function () {
  //////////////////////////
  //헤더
  //////////////////////////
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 100) {
      $("#header").addClass("scrolled");
    } else {
      $("#header").removeClass("scrolled");
    }
  });
  //////////////////////////
  //오버레이 네비
  //////////////////////////

  $("#hamburger-1").click(function () {
    $(this).toggleClass("active");
    $(".hiddenNav").toggleClass("visible");

    if ($(this).hasClass("active")) {
      $("body").css({ overflow: "hidden" });
    } else {
      $("body").css({ overflow: "auto" });
    }
  });
  $(".hiddenNav a").click(function () {
    $("#hamburger-1").removeClass("active");
    $(".hiddenNav").removeClass("visible");
    $("body").css({ overflow: "auto" });
  });

  //   let hamburger = document.querySelector("#hamburger-1");
  //   let hiddenNav = document.querySelector(".hiddenNav");
  //   let body = document.body;

  //   hamburger.addEventListener("click", function () {
  //     console.log("클릭");
  //     this.classList.toggle("active");
  //     hiddenNav.classList.toggle("visible");

  //     if (this.classList.contains("active")) {
  //       body.style.overflow = "hidden"; // 스크롤바 숨기기
  //     } else {
  //       body.style.overflow = "auto"; // 스크롤바 복원
  //     }
  //   });

  //   hiddenNav.querySelectorAll("a").forEach((item) => {
  //     item.addEventListener("click", function () {
  //       hamburger.classList.remove("active");
  //       hiddenNav.classList.remove("visible");
  //       body.style.overflow = "auto";
  //     });
  //   });
}); //end
