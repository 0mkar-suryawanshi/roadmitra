var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = './assets/css/animation.css';
document.head.appendChild(link);


var animateElms=[];
setTimeout(() => {
     animateElms = document.querySelectorAll('[data-anim]');
    triggerAnim();
}, 100);

class animations {

    constructor(elm){
       this.elm =elm;
        this.setObserver();
    }

    setObserver(){
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry)=> {
                // Check if the element is intersecting with the viewport
                if (entry.isIntersecting) {
                    this.checkAnimType();
                } else {
                    // Check if the element is above or below the viewport
                    if (entry.boundingClientRect.top < 0) {
                        // console.log(this.elm);
                        // console.log('Element is above the viewport');
                    } else {
                        // console.log(this.elm);
                        // console.log('Element is below the viewport');
                    }
                }
            });
        });

        this.observer.observe(this.elm)
    }

    checkAnimType(){
        if(this.elm.hasAttribute('data-zoomin')){
            this.zoomInAnimation();
        }
        if(this.elm.hasAttribute('data-totop')){
            this.bottomToTopAnimation();
        }
        if(this.elm.hasAttribute('data-fadein')){
            this.fadeInAnimation();
        }
        if(this.elm.hasAttribute('data-lefttoright')){
            this.leftToRightAnimation();
        }
        if(this.elm.hasAttribute('data-righttoleft')){
            this.rightToLeftAnimation();
        }
        if(this.elm.hasAttribute('data-zoomout')){
            this.zoomoutAnimation();
        }
        if(this.elm.hasAttribute('data-centerzoomin')){
            this.zoomCenterAnimation();
        }
    }

    zoomInAnimation(){
        this.elm.classList.add("zoom_in")
    }

    zoomCenterAnimation(){
        this.elm.classList.add("zoom_in_from_Center")
    }

    bottomToTopAnimation(){
        this.elm.classList.add("from_bottom_to_top")
    }

    fadeInAnimation(){
        this.elm.classList.add("fadeIn")
    }

    leftToRightAnimation(){
        this.elm.classList.add("leftToRight")
    }

    rightToLeftAnimation(){
        this.elm.classList.add("rightToLeft")
    }

    zoomoutAnimation(){
        this.elm.classList.add('zoom_out');
    }

}

function triggerAnim(){
    for (let index = 0; index < animateElms.length; index++) {
        const animation = new animations(animateElms[index])
    }
}

