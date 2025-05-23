class SnackBar {
    snackbarHtml = ``;
    
    snackbarAnimationCss = `
    .snack_success{
        background-color:green;
    }

    .snack_error{
        background-color:red;
    }

    .snack_enter{
        animation: snackenter .5s;
    }

    @keyframes snackenter{
        0%{
            opacity:0;
           transform: translateY(50px);
        }
        100%{
            opacity:1;
            transform: translateY(0px);
        }
    }

    .snack_exit{
        animation: snackexit .5s;
    }

    @keyframes snackexit{
        0%{
            opacity:1;
        }
        100%{
            opacity:0;
        }
    }

    `
    constructor() {
        var styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.innerHTML = this.snackbarAnimationCss;
        document.head.appendChild(styleTag);
    }

    openSnack(message, timeout, type) {
        this.snackbarHtml = `<div class="pb-10" style="position:fixed;bottom:0px;z-index:17;width:100%"><div class="snack_enter mx-auto px-20 py-15" style="width:fit-content; border-radius:10px;color:White">${message}</div><div>`;
        var snackbarDiv = document.createElement('div');
        snackbarDiv.innerHTML = this.snackbarHtml;
        document.body.appendChild(snackbarDiv);
        document.querySelectorAll('.snack_enter').forEach((elm) => {
            elm.classList.add(type);
        })
        setTimeout(() => {
            snackbarDiv.classList.add('snack_exit');
            snackbarDiv.addEventListener('animationend', () => {
                document.body.removeChild(snackbarDiv);
            })

        }, timeout);

    }

}



class ScrollToView {
    constructor() {

    }

    scrollHere(id) {
        document.getElementById(id).scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}

class Loader {

    loaderCSS = `
        .loader_parent {
            position: fixed;
            top: 0px;
            left: 0px;
            display: none;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.577);
            z-index: 999;
        }

        .loader {
            width: 140px;
        }     
    `
    constructor() {
        var styleTag = document.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.innerHTML = this.loaderCSS;
        document.head.appendChild(styleTag);
    }

    openLoader() {
        this.LoaderHtml = `<div id="loader_parent" class="loader_parent">
        <img class="loader" src="./assets/images/common/RA-logo-loader.gif">
        </div>`;
        var loaderDiv = document.createElement('div');
        loaderDiv.innerHTML = this.LoaderHtml;
        document.body.appendChild(loaderDiv);
        setTimeout(() => {
            document.body.removeChild(loaderDiv);
        }, 3000);
    }

}

class openSubDomainUrl {
    constructor() {
        this.loader = new Loader();
    }

    openApp(url) {
        this.loader.openLoader();
        window.location.href = "https://app.readyassist.in" + url
    }
}

class openExternalUrl {
    openurl(url) {
        window.open("https://" + url, "_blank");
    }
}

class router{
    routeTo(url) {
        window.location.href = url;
      }
}

export default { SnackBar, Loader, ScrollToView, openExternalUrl, router, openSubDomainUrl };