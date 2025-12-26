const startTime = new Date('2025-11-12T11:35:00');

function updateElapsedTime() {
  const now = new Date();
  let diff = Math.floor((now - startTime) / 1000); // 총 초

  const totalHours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  // 일 + 시간 계산
  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  document.getElementById('elapsed').innerHTML =
    `용현이가 태어난 지 <span class="number">${totalHours}</span>시간 <span class="number">${minutes}</span>분 <span class="number">${seconds}</span>초 지났습니다`;

  document.getElementById('daysHoursDisplay').innerHTML =
    `즉, <span class="number">${totalDays}</span>일 <span class="number">${remainingHours}</span>시간이 지났습니다`;

  document.getElementById('daysHours').innerHTML =
    `총 <span class="number">${totalDays}</span>일 <span class="number">${remainingHours}</span>시간 <span class="number">${minutes}</span>분 <span class="number">${seconds}</span>초 지났습니다`;
}

setInterval(updateElapsedTime, 1000);
updateElapsedTime(); // 첫 로딩 시 바로 표시

// 미디어 파일 목록
const mediaFiles = [
  // 이미지 파일
  { type: 'image', src: './img/yonghyun.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102150.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102153.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102154.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102208.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102210.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102212.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251225_102223.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251226_150603.jpg', alt: '용현이 사진' },
  { type: 'image', src: './img/20251226_150616.jpg', alt: '용현이 사진' },
  // 비디오 파일
  { type: 'video', src: './mp4/20251112_204532.mp4', alt: '용현이 영상' },
  { type: 'video', src: './mp4/20251113_103131.mp4', alt: '용현이 영상' },
  { type: 'video', src: './mp4/20251113_195126.mp4', alt: '용현이 영상' },
  { type: 'video', src: './mp4/20251224_220358.mp4', alt: '용현이 영상' }
];

// Slick Slider 초기화
$(document).ready(function(){
  const photoSlider = $('.photo-slider');
  
  // 미디어 파일들을 동적으로 생성
  mediaFiles.forEach((file, index) => {
    let mediaElement;
    if (file.type === 'image') {
      mediaElement = $(`<div class="photo-wrapper">
        <img src="${file.src}" alt="${file.alt}" class="gallery-media" data-type="image" data-index="${index}" data-src="${file.src}">
      </div>`);
    } else {
      mediaElement = $(`<div class="photo-wrapper">
        <video class="gallery-media" data-type="video" data-index="${index}" data-src="${file.src}" muted>
          <source src="${file.src}" type="video/mp4">
        </video>
        <div class="play-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <div class="video-hint">이미지를 터치하시면 영상이 재생됩니다</div>
      </div>`);
    }
    photoSlider.append(mediaElement);
  });

  // Slick Slider 초기화
  photoSlider.slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    prevArrow: $('.slide_controlbox .slick-prev'),
    nextArrow: $('.slide_controlbox .slick-next'),
    adaptiveHeight: false
  });

  // 라이트박스 갤러리 기능
  const galleryMedia = $('.gallery-media');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxVideo = $('#lightboxVideo');
  const lightboxClose = $('#lightboxClose');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');
  const currentIndexSpan = $('#currentIndex');
  const totalImagesSpan = $('#totalImages');
  
  let currentIndex = 0;
  const totalMedia = galleryMedia.length;
  
  totalImagesSpan.text(totalMedia);

  // 미디어 클릭 시 라이트박스 열기
  galleryMedia.on('click', function() {
    currentIndex = parseInt($(this).data('index'));
    updateLightboxMedia();
    lightbox.addClass('active');
    $('body').css('overflow', 'hidden');
  });

  // 라이트박스 닫기
  lightboxClose.on('click', function() {
    closeLightbox();
  });

  lightbox.on('click', function(e) {
    if ($(e.target).is(lightbox)) {
      closeLightbox();
    }
  });

  // 이전 미디어
  lightboxPrev.on('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + totalMedia) % totalMedia;
    updateLightboxMedia();
  });

  // 다음 미디어
  lightboxNext.on('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % totalMedia;
    updateLightboxMedia();
  });

  // 키보드 네비게이션
  $(document).on('keydown', function(e) {
    if (lightbox.hasClass('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + totalMedia) % totalMedia;
        updateLightboxMedia();
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % totalMedia;
        updateLightboxMedia();
      }
    }
  });

  // 라이트박스 미디어 업데이트
  function updateLightboxMedia() {
    const currentMedia = mediaFiles[currentIndex];
    
    if (currentMedia.type === 'image') {
      lightboxImage.attr('src', currentMedia.src);
      lightboxImage.show();
      lightboxVideo.hide();
      lightboxVideo[0].pause();
    } else {
      lightboxVideo.attr('src', currentMedia.src);
      lightboxVideo.show();
      lightboxImage.hide();
    }
    currentIndexSpan.text(currentIndex + 1);
  }

  // 라이트박스 닫기 함수
  function closeLightbox() {
    lightbox.removeClass('active');
    $('body').css('overflow', '');
    lightboxVideo[0].pause();
  }
});

