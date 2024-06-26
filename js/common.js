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

  //////////////////////////
  //nav link 업데이트
  //////////////////////////
  const links = $("header .innerNav ul li a");
  if ($("header").length) {
    links.each(function (index) {
      $(this).on("click", function () {
        localStorage.setItem("activeNavLink", index);
        updateActiveLink(links);
      });
    });

    // 인덱스 페이지가 아닐 때만 상태 복원
    if (!window.location.pathname.endsWith("/index.html")) {
      updateActiveLink(links);
    } else {
      // 인덱스 페이지에서는 모든 링크에서 'clicked' 클래스 제거
      removeClickedClass(links);
    }
  }

  // 예약 및 조회 버튼 클릭시 모든 'clicked' 클래스 제거
  $(".subBtn").on("click", function () {
    removeClickedClass(links);
    localStorage.removeItem("activeNavLink"); // 선택된 링크 인덱스 삭제
  });

  function updateActiveLink(links) {
    const activeIndex = localStorage.getItem("activeNavLink");
    if (activeIndex !== null) {
      links.each(function (index) {
        $(this).removeClass("clicked");
        if (index === parseInt(activeIndex, 10)) {
          $(this).addClass("clicked");
        }
      });
    }
  }

  function removeClickedClass(links) {
    links.removeClass("clicked");
  }
}); //end
