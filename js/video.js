// document.addEventListener('DOMContentLoaded', function () {
//     new Video();
// });
class Video {
    constructor() {
        this.#initSwiper();
        this.#initBtn();
        this.#selectedVideo();
        this.videoList = Array.from(document.querySelectorAll('[data-gallery-video]'));
        if (this.videoList) {
            this.videoList.map((video) => this.#videoEvents(video));
        }
    }

    #initSwiper() {
        this.galleryThumbs = new Swiper(".gallery-thumbs", {
            direction: "vertical",
            loop: true,
            slidesPerView: 'auto'
        });
        this.galleryMain = new Swiper(".gallery-main", {
            watchOverflow: true,
            effect: 'fade',
            navigation: {
                nextEl: '[data-video-next]',
                prevEl: '[data-video-prev]',
            },
            fadeEffect: {
                crossFade: true
            },
            thumbs: {
                swiper: this.galleryThumbs
            }
        });
        this.galleryMain.on('slideChange', () => {
            this.#selectedVideo();
        });
        this.selectedIndex = this.galleryMain.activeIndex;
    }


    #initBtn() {
        this.progressBar = document.querySelector('[data-video-progress]');
        this.playBtn = document.querySelector('[data-video-play]');
        this.pauseBtn = document.querySelector('[data-video-pause]');
        this.openBtn = document.querySelector('[data-video-open]');
        this.progressBarModal = document.querySelector('[data-more-progress]');
        this.videoMore = document.querySelector('[data-more-video]');
        this.playBtnModal = document.querySelector('[data-more-play]');
        this.pauseBtnModal = document.querySelector('[data-more-pause]');
        this.closeBtnModal = document.querySelector('[data-more-close]');
        this.#btnEvents();
    }

    #btnEvents() {
        this.playBtn.addEventListener('click', () => {
            this.pauseBtn.style.display = 'block';
            this.playBtn.style.display = 'none';
            this.#pause(this.video)
        });
        this.pauseBtn.addEventListener('click', () => {
            this.pauseBtn.style.display = 'none';
            this.playBtn.style.display = 'block';
            this.#play(this.video)
        });
        this.openBtn.addEventListener('click', () => {
            this.Fancybox = Fancybox.show([{
                src: document.querySelector('[data-more-container]'),
                type: 'inline'
            }], {
                groupAll: true,
                closeButton: false,
                dragToClose: false,
                on: {
                    init: () => {
                        this.#openModalVideo();
                    },
                    close: (fancybox, eventName) => {
                        this.#resetModal();
                    },
                },
            });
        });
        this.playBtnModal.addEventListener('click', () => {
            if (this.videoMore) {
                this.pauseBtnModal.style.display = 'block';
                this.playBtnModal.style.display = 'none';
                this.#pause(this.videoMore);
            }
        });
        this.pauseBtnModal.addEventListener('click', () => {
            if (this.videoMore) {
                this.pauseBtnModal.style.display = 'none';
                this.playBtnModal.style.display = 'block';
                this.#play(this.videoMore);
            }
        });
        this.closeBtnModal.addEventListener('click', () => this.Fancybox.close())
    }

    #videoEvents(video) {
        video.addEventListener('mouseover', () => {
            if (Number(video.dataset.galleryVideo) !== this.galleryMain.activeIndex) {
                setTimeout(() => {
                    this.selectedIndex = this.videoList.findIndex((item) => item.dataset.galleryVideo === video.dataset.galleryVideo);
                    this.#selectedHover();
                }, 200)
                setTimeout(() => {
                    this.#pause(this.videoHover);
                }, 10000)
            }
        });
        video.addEventListener('mouseout', () => {
            this.#resetHover();
        });
    }

    #openModalVideo() {
        const play = !this.video.paused;
        this.#pause(this.video);
        this.videoMore.src = this.video.src;
        this.videoMore.muted = false;
        this.videoMore.currentTime = this.video.currentTime;
        if (play) {
            this.#play(this.videoMore);
            this.pauseBtnModal.style.display = 'none';
            this.playBtnModal.style.display = 'block';
        } else {
            this.pauseBtnModal.style.display = 'block';
            this.playBtnModal.style.display = 'none';
        }
        this.videoMore.addEventListener('timeupdate', () => this.#progressBar(this.progressBarModal, this.videoMore));
    }

    #selectedVideo() {
        this.#reset(this.video);
        this.video = document.querySelector(`[data-video-active="${this.galleryMain.activeIndex}"]`)
        if (this.video) {
            this.video.muted = false;
            this.video.addEventListener('timeupdate', () => this.#progressBar(this.progressBar, this.video));
        }
    }

    #selectedHover() {
        this.#resetHover();
        this.videoContainer = document.querySelector(`[data-gallery-video="${this.selectedIndex}"]`);
        this.videoHover = this.videoContainer.querySelector('[data-video]');
        this.progressBarHover = this.videoContainer.querySelector('[data-video-progress]');
        this.videoContainer.classList.add('short__video');
        this.#play(this.videoHover);
        this.videoHover.addEventListener('timeupdate', () => {
            this.#progressBar(this.progressBarHover, this.videoHover);
        })
    }

    #progressBar(progressbar, video) {
        progressbar.style.width = (video.currentTime / video.duration * 100) + "%";
    }

    #play(video) {
        if (video) {
            video.play();
        }
    }

    #pause(video) {
        if (video) {
            video.pause();
        }
    }

    #resetHover() {
        if (this.videoHover) {
            this.#pause(this.videoHover);
            this.videoHover.currentTime = 0;
            this.videoContainer.classList.remove('short__video');
        }
    }

    #resetModal() {
        this.video.currentTime = this.videoMore.currentTime;
        if (!this.videoMore.paused) {
            this.#play(this.video);
            this.pauseBtnModal.style.display = 'block';
            this.playBtnModal.style.display = 'none';
        } else {
            this.pauseBtnModal.style.display = 'none';
            this.playBtnModal.style.display = 'block';
        }
        this.#pause(this.videoMore);
        this.videoMore.muted = true;
        this.videoMore.currentTime = 0;

    }

    #reset() {
        if (this.video) {
            this.pauseBtn.style.display = 'block';
            this.playBtn.style.display = 'none';
            this.progressBar.style.width = 0;
            this.#pause(this.video);
            this.video.currentTime = 0;
        }
    }
}

new Video();

