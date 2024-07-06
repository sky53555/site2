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
  //메인 비디오
  //////////////////////////
  let currentIndex = 0;
  const $videoSections = $(".video-section");
  const totalSections = $videoSections.length;
  const videoDisplayTime = 6; // 각 비디오를 6초 간격으로 재생
  let isPlaying = true;
  let canChange = true;
  let autoPlayTimeout;
  let progressBarValue = 0; // ProgressBar 상태를 저장

  // ProgressBar 초기화
  const bar = new ProgressBar.Circle("#progress-container", {
    strokeWidth: 8,
    color: "#e87676",
    trailColor: "#eee",
    trailWidth: 8,
    easing: "linear",
    duration: 0,
    from: { color: "#e87676", width: 8 },
    to: { color: "#e87676", width: 8 },
    step: function (state, circle) {
      circle.path.setAttribute("stroke", state.color);
      circle.path.setAttribute("stroke-width", state.width);
    },
  });

  function setProgressAnimation(duration, fromValue = 0) {
    bar.set(fromValue); // 저장된 값에서 시작
    bar.animate(1.0, { duration: duration * 1000 }); // 애니메이션 시작
  }

  function resetProgressAnimation() {
    bar.set(0); // 초기화
    progressBarValue = 0;
  }

  function activateCurrentSection(index) {
    if (index >= totalSections) {
      currentIndex = 0;
    }
    $videoSections.removeClass("active").eq(index).addClass("active");
    const video = $videoSections.eq(index).find("video").get(0);
    video.currentTime = 0;
    video.play();

    // 텍스트 애니메이션 초기화 및 재적용
    const $visualTxt = $videoSections.eq(index).find(".visualTxt");
    $visualTxt.css("animation", "none");
    setTimeout(() => {
      $visualTxt.css("animation", "");
      $visualTxt.css("animation", "slideIn 1.5s ease-out");
    }, 0);

    // 애니메이션 재시작
    resetProgressAnimation();
    setProgressAnimation(videoDisplayTime);

    // 비디오 재생 완료 시 다음 비디오로 전환
    video.onended = function () {
      moveToNextVideo();
    };

    // 6초 후 다음 비디오로 전환
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = setTimeout(() => {
      moveToNextVideo();
    }, videoDisplayTime * 1000);
  }

  function playVideo() {
    const video = $videoSections.eq(currentIndex).find("video").get(0);
    video.play();
    $("#playBtn").find("ion-icon").attr("name", "pause-outline");
    isPlaying = true;
    const remainingTime = videoDisplayTime * (1 - progressBarValue); // 남은 시간 계산
    setProgressAnimation(remainingTime, progressBarValue); // 멈춘 자리에서 시작

    // 타이머 재설정
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = setTimeout(() => {
      moveToNextVideo();
    }, remainingTime * 1000); // 남은 시간 후 다음 비디오로 전환
  }

  function pauseVideo() {
    const video = $videoSections.eq(currentIndex).find("video").get(0);
    video.pause();
    $("#playBtn").find("ion-icon").attr("name", "play-outline");
    isPlaying = false;
    bar.stop();
    progressBarValue = bar.value(); // 현재 ProgressBar 상태 저장
    clearTimeout(autoPlayTimeout); // 정지 시 타이머 취소
  }

  function moveToNextVideo() {
    if (!canChange) return;
    canChange = false;
    currentIndex = (currentIndex + 1) % totalSections;
    activateCurrentSection(currentIndex);
    setTimeout(() => {
      canChange = true;
    }, 500);
  }

  $("#playBtn").click(function () {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  });

  $("#nextBtn").click(function () {
    clearTimeout(autoPlayTimeout); // 다음 비디오로 전환할 때 타이머 취소
    resetProgressAnimation(); // ProgressBar 초기화
    moveToNextVideo();
    if (!isPlaying) {
      playVideo();
    }
  });

  // 페이지 로드 시 첫 비디오 활성화 및 자동 전환 시작
  activateCurrentSection(currentIndex);
  //////////////////////////////
  //top추천여행
  //////////////////////////////
  // 초기 로드 시 카테고리 로드
  loadContent("domestic");
  $(".tab-button").on("click", function () {
    const category = $(this).data("tab");
    $(".tab-button").removeClass("active");
    $(this).addClass("active");
    loadContent(category);
  });

  // 초기 로드 시 국내여행 카테고리 로드
  // $(".tab-button[data-tab='domestic']").trigger("click");
  let swiper1;

  function loadContent(category) {
    $.getJSON("./json/data.json", function (data) {
      const content = data[category];
      const swiperWrapper = $(".mySwiper1 .swiper-wrapper");
      swiperWrapper.empty();

      content.slides.forEach(function (slide) {
        const slideHtml = `
          <div class="swiper-slide">
            <div class="rcmBoxWrap">
              <div class="rcmImg">
                <img src="${slide.image}" alt="${slide.title}" />
              </div>
              <div class="rcmBoxTxt">
                <h3>${slide.title}</h3>
                <h4>${slide.description}</h4>
                <h2>${slide.price}</h2>
              </div>
            </div>
          </div>
        `;
        swiperWrapper.append(slideHtml);
      });

      if (swiper1) {
        swiper1.update();
      } else {
        swiper1 = new Swiper(".mySwiper1", {
          spaceBetween: 30,
          loop: true,
          navigation: {
            nextEl: ".right",
            prevEl: ".left",
          },
          slidesPerView: 1,
          breakpoints: {
            768: {
              slidesPerView: 2,
            },
            1440: {
              slidesPerView: 3,
            },
          },
        });
      }

      $(".rcmLeft .rcmText h3").text(content.title);
      $(".rcmLeft .rcmText p").text(content.description);
      const $rcmImgs = $(".rcmLeft .rcmImgs");
      $rcmImgs.empty();
      content.images.forEach(function (image, index) {
        $rcmImgs.append(
          `<img src="${image}" alt="" class="${category}-img${index + 1}" />`
        );
      });
    });
  }

  // const swiper1 = new Swiper(".mySwiper1", {
  //   spaceBetween: 30,
  //   loop: true,
  //   navigation: {
  //     nextEl: ".right",
  //     prevEl: ".left",
  //   },
  //   slidesPerView: 1,
  //   breakpoints: {
  //     768: {
  //       slidesPerView: 2,
  //     },
  //     1440: {
  //       slidesPerView: 3,
  //     },
  //   },
  // });

  // function loadContent(category) {
  //   $.getJSON("./json/data.json", function (data) {
  //     const content = data[category];
  //     const swiperWrapper = $(".mySwiper1 .swiper-wrapper");
  //     swiperWrapper.empty();

  //     content.slides.forEach(function (slide) {
  //       const slideHtml = `
  //         <div class="swiper-slide">
  //           <div class="rcmBoxWrap">
  //             <div class="rcmImg">
  //               <img src="${slide.image}" alt="${slide.title}" />
  //             </div>
  //             <div class="rcmBoxTxt">
  //               <h3>${slide.title}</h3>
  //               <h4>${slide.description}</h4>
  //               <h2>${slide.price}</h2>
  //             </div>
  //           </div>
  //         </div>
  //       `;
  //       swiperWrapper.append(slideHtml);
  //     });

  //     swiper1.update();

  //     $(".rcmLeft .rcmText h3").text(content.title);
  //     $(".rcmLeft .rcmText p").text(content.description);
  //     const $rcmImgs = $(".rcmLeft .rcmImgs");
  //     $rcmImgs.empty();
  //     content.images.forEach(function (image, index) {
  //       $rcmImgs.append(
  //         `<img src="${image}" alt="" class="${category}-img${index + 1}" />`
  //       );
  //     });
  //   });
  // }

  ////////////////////////
  //여행모음집
  ////////////////////////
  const swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    on: {
      slideChange: updateProgressBar,
    },
  });

  function loadZipContent(category) {
    $.getJSON("./json/zipData.json", function (data) {
      const content = data[category];
      const swiperWrapper = $(".mySwiper2 .swiper-wrapper");
      swiperWrapper.empty();

      for (let i = 0; i < content.length; i += 3) {
        const bigItem = content[i];
        const smallItem1 = content[i + 1];
        const smallItem2 = content[i + 2];
        const slide = `
          <div class="swiper-slide zipSlide">
            <div class="zipBig" style="background-image: url(${bigItem.image});">
              <div class="zipText">
                <h3>${bigItem.title}</h3>
                <h2 class="price">${bigItem.price}</h2>
              </div>
            </div>
            <div class="zipSmall">
              <div class="zipSmallOne" style="background-image: url(${smallItem1.image});">
                <div class="zipText">
                  <h3>${smallItem1.title}</h3>
                  <h2 class="price">${smallItem1.price}</h2>
                </div>
              </div>
              <div class="zipSmallTwo" style="background-image: url(${smallItem2.image});">
                <div class="zipText">
                  <h3>${smallItem2.title}</h3>
                  <h2 class="price">${smallItem2.price}</h2>
                </div>
              </div>
            </div>
          </div>
        `;
        swiperWrapper.append(slide);
      }

      swiper2.update(); // 스와이퍼 업데이트
      swiper2.slideTo(0); // 스와이퍼 위치를 첫 번째 슬라이드로 초기화
      updateProgressBar.call(swiper2); // 진행 바 업데이트
    });
  }

  function updateProgressBar() {
    const swiper = this;
    const totalSlides = swiper.slides.length;
    const currentSlide = swiper.activeIndex;
    const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
    $(".progress").css("width", progressPercentage + "%");
  }

  $(".zipLeft ul li").on("click", function () {
    const category = $(this).data("category");
    $(".zipLeft ul li").removeClass("active");
    $(this).addClass("active");
    loadZipContent(category);
  });

  // 초기 로드 시 nature 카테고리 로드
  loadZipContent("nature");

  ///////////////////////////////////
  //이벤트 배너
  ///////////////////////////////////

  var swiper3 = new Swiper(".mySwiper3", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    // If we need pagination
    pagination: {
      el: ".slider__pagination",
      clickable: true,
    },
    on: {
      slideChangeTransitionStart: function () {
        // Slide captions
        var swiper = this;
        setTimeout(function () {
          var currentTitle = $(swiper.slides[swiper.activeIndex]).attr(
            "data-title"
          );
          var currentSubtitle = $(swiper.slides[swiper.activeIndex]).attr(
            "data-subtitle"
          );
          var currentSubcon = $(swiper.slides[swiper.activeIndex]).attr(
            "data-subcon"
          );
        }, 500);
        gsap.to($(".current-title"), 0.4, {
          autoAlpha: 0,
          y: -40,
          ease: Power1.easeIn,
        });
        gsap.to($(".current-subtitle"), 0.4, {
          autoAlpha: 0,
          y: -40,
          delay: 0.15,
          ease: Power1.easeIn,
        });
        gsap.to($(".current-subcon"), 0.4, {
          autoAlpha: 0,
          y: -40,
          delay: 0.25,
          ease: Power1.easeIn,
        });
      },
      slideChangeTransitionEnd: function () {
        // Slide captions
        var swiper = this;
        var currentTitle = $(swiper.slides[swiper.activeIndex]).attr(
          "data-title"
        );
        var currentSubtitle = $(swiper.slides[swiper.activeIndex]).attr(
          "data-subtitle"
        );
        var currentSubcon = $(swiper.slides[swiper.activeIndex]).attr(
          "data-subcon"
        );
        $(".slide-captions").html(function () {
          return (
            "<h2 class='current-title'>" +
            currentTitle +
            "</h2>" +
            "<h3 class='current-subtitle'>" +
            currentSubtitle +
            "</h3>" +
            "<button class='current-subcon'>" +
            currentSubcon +
            "</button>"
          );
        });
        gsap.from($(".current-title"), 0.4, {
          autoAlpha: 0,
          y: 40,
          ease: Power1.easeOut,
        });
        gsap.from($(".current-subtitle"), 0.4, {
          autoAlpha: 0,
          y: 40,
          delay: 0.15,
          ease: Power1.easeOut,
        });
        gsap.from($(".current-subcon"), 0.4, {
          autoAlpha: 0,
          y: 40,
          delay: 0.25,
          ease: Power1.easeOut,
        });
      },
    },
  });

  // Slide captions
  var currentTitle = $(swiper3.slides[swiper3.activeIndex]).attr("data-title");
  var currentSubtitle = $(swiper3.slides[swiper3.activeIndex]).attr(
    "data-subtitle"
  );
  var currentSubcon = $(swiper3.slides[swiper3.activeIndex]).attr(
    "data-subcon"
  );
  $(".slide-captions").html(function () {
    return (
      "<h2 class='current-title'>" +
      currentTitle +
      "</h2>" +
      "<h3 class='current-subtitle'>" +
      currentSubtitle +
      "</h3>" +
      "<button class='current-subcon'>" +
      currentSubcon +
      "</button>"
    );
  });
  //////////////////////////
  //더 보기 버튼
  //////////////////////////
  $("#loadMoreButton").on("click", function () {
    // snsPhotoWrap1을 복사하여 snsPhotoWrap2에 추가
    var $originalWrap = $("#snsPhotoWrap1");
    var $newWrap = $("#snsPhotoWrap2");

    $newWrap.html($originalWrap.html());

    // 순서 변경: 왼쪽 작은 이미지들 -> 오른쪽, 오른쪽 큰 이미지들 -> 왼쪽
    var $photos = $newWrap.find(".snsPhoto");
    if ($photos.length > 1) {
      $newWrap.append($photos.first());
      $newWrap.append($photos.eq(1));
    }

    // 새로운 랩을 표시
    $newWrap.css("display", "grid").hide().fadeIn(1000).css("opacity", 1);

    // 더보기 버튼 제거
    $("#loadMoreButton").hide();
  });

  ////////////////////////
  //더 보기 버튼
  // JSON 데이터 로드
  ////////////////////////
  $.getJSON("./json/picture.json", function (data) {
    var initialHtml = "";
    var moreHtml = "";

    // 첫 번째 데이터 로드
    $.each(data.initial, function (key, item) {
      initialHtml += '<div class="snsPhoto">';
      initialHtml += '<img src="' + item.img + '" alt="' + item.alt + '" />';
      initialHtml += '<div class="hiddenText">';
      initialHtml +=
        '<h3><ion-icon name="location-outline"></ion-icon>' +
        item.location +
        "</h3>";
      initialHtml += "<span>" + item.description + "</span>";
      initialHtml += "</div>";
      initialHtml += "</div>";
    });
    $("#snsPhotoWrap1").html(initialHtml);

    // 더보기 버튼 클릭 시 두 번째 데이터 로드
    $("#loadMoreButton").on("click", function () {
      $.each(data.more, function (key, item) {
        moreHtml += '<div class="snsPhoto">';
        moreHtml += '<img src="' + item.img + '" alt="' + item.alt + '" />';
        moreHtml += '<div class="hiddenText">';
        moreHtml +=
          '<h3><ion-icon name="location-outline"></ion-icon>' +
          item.location +
          "</h3>";
        moreHtml += "<span>" + item.description + "</span>";
        moreHtml += "</div>";
        moreHtml += "</div>";
      });
      $("#snsPhotoWrap2").html(moreHtml);

      // 새로운 랩을 표시
      $("#snsPhotoWrap2").fadeIn(1000);

      // 더보기 버튼 제거
      $("#loadMoreButton").hide();
    });
  });
});
