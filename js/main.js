function NavToggleClick() {
    document.getElementById('toggle-btn').classList.toggle('active');
    document.getElementById('navBar').classList.toggle('active');
    document.getElementById('content-wrapper').classList.toggle('inactive');
}

function NavBtnClick(btn) {
    if (canClick) {
        canClick = false;
        let clickedBtnId = arguments[0] ? btn.id : btnList[0].id;
        window.location.hash = clickedBtnId;
        if (arguments[0]) {
            NavToggleClick()
        }
    }
}

function CheckContent() {
    if (TempContent() in contentObject) {
        AddContent(contentObject[TempContent()]);
    } else {
        ajax.open('get','/content/' + window.location.hash.substring(1) + '.html');
        ajax.send();
        let ajaxReady = () => {
            if (ajax.readyState == 4 && ajax.status == 200) {
                contentObject[TempContent()] = ajax.responseText;
                AddContent(contentObject[TempContent()]);
                ajax.onreadystatechange = () => { };
            }
        }
        ajax.onreadystatechange = ajaxReady;
    }
}

function AddContent(contentString) {
    let wrapper = document.querySelector('#content-wrapper');
    if (wrapper.firstElementChild) {
        let postChild = wrapper.firstElementChild;
        postChild.classList.add('fade-out');
        postChild.addEventListener('animationend', () => {
            postChild.remove();
            ContentAppend(contentString, wrapper);
        });

    } else {
        console.log('2');

        ContentAppend(contentString, wrapper);
    }

}

function ContentAppend(contentString, contentWrapper) {
    let content = document.createElement('div');
    content.className = 'content fade-in';
    content.innerHTML = contentString;
    let fadeInEvent = () => {
        content.classList.remove('fade-in');
        canClick = true;
        content.removeEventListener('animationend', fadeInEvent);
    }
    content.addEventListener('animationend', fadeInEvent);
    contentWrapper.appendChild(content);
}

function TempContent() {
    return window.location.hash.substring(1);;
}

var ajax = new XMLHttpRequest();
var contentObject = Object;
var canClick = true;
var btnList = document.getElementsByClassName('nav-item');

window.onload = () => {
    NavBtnClick();
    CheckContent();
    document.getElementById(TempContent()).className = 'nav-item selected';
}

window.onhashchange = (event) => {
    for (let i = 0; i < btnList.length; i++) {
        btnList[i].className = 'nav-item';
    }
    document.getElementById(TempContent()).className = 'nav-item selected';
    CheckContent();
}