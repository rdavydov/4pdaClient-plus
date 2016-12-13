/**
 *		===================
 *		blocks close & open
 *		===================
 */
document.addEventListener('DOMContentLoaded', blocksOpenClose);

function blocksOpenClose() {
    var blockTitleAll = document.querySelectorAll('.post-block.spoil>.block-title,.post-block.code>.block-title');

    if (!blockTitleAll[0]) return;

    for (var i = 0; i < blockTitleAll.length; i++) {
        var bt = blockTitleAll[i];
        var bb = bt.parentElement.querySelector('.block-body');
        if (bb.parentElement.classList.contains('code') && bb.scrollHeight <= bb.offsetHeight) {
            bb.parentElement.classList.remove('box');
        }
        bt.addEventListener('click', clickOnElement, false);
    }

    function clickOnElement(event) {
        var t = event.target;
        while (!t.classList.contains('post_body') || !t.classList.contains('msg-content') || t != document.body) {
            if (t.classList.contains('spoil')) {
                event.stopPropagation();
                toggler("close", "open", t);
                spoilCloseButton(t);
                return;
            } else if (t.classList.contains('code')) {
                event.stopPropagation();
                toggler("unbox", "box", t);
                return;
            }
            t = t.parentElement;
        }
    }

    function toggler(c, o, t) {
        if (t.classList.contains(c)) {
            t.classList.remove(c);
            t.classList.add(o);
            substitutionAttributes(event);
        } else if (t.classList.contains(o)) {
            t.classList.remove(o);
            t.classList.add(c);
        }
    }
}

/**
 *		==================
 *		SPOIL CLOSE BUTTON
 *		==================
 */

function spoilCloseButton(t) {
    if (t.clientHeight > document.documentElement.clientHeight && !t.querySelector('.spoil_close')) {
        var bb = t.querySelector('.block-body');
		var btn = document.createElement('button');
		btn.innerHTML = 'Закрыть спойлер';
		btn.className = "spoil_close";
		btn.addEventListener('click', clickBtn);
		function clickBtn(e) {
			t.classList.remove('open');
			t.classList.add('close');
			t.scrollIntoView();
		}
		bb.appendChild(btn);
    }
}

/**
 *		===============================
 *		HIDE AND SHOW IMAGES IN SPOILER
 *		===============================
 */

document.addEventListener('DOMContentLoaded', spoilsImageLoad);

function spoilsImageLoad() {
    if (document.body.classList.contains("noimages")) return;
    var postBlockSpoils = document.body.querySelectorAll('.post-block.spoil.close > .block-body');
    for (var i = 0; i < postBlockSpoils.length; i++) {
        var images = postBlockSpoils[i].querySelectorAll('img');
        for (var j = 0; j < images.length; j++) {
            var img = images[j];
            if (!img.hasAttribute('src') || img.dataset.imageSrc) continue;
            img.dataset.imageSrc = img.src;
            img.removeAttribute('src');
            img.addEventListener('load', function() {spoilCloseButton(img);});
        }
    }
}

function substitutionAttributes(event) {
    var target;
    (event.target) ? target = event.target: target = event;
    while (target != this) {
        if (target.classList.contains('spoil')) {
            var images = target.querySelectorAll('img');
            for (var i = 0; i < images.length; i++) {
                var img = images[i];
                if (img.hasAttribute('src') || !img.dataset.imageSrc) continue;
                img.src = img.dataset.imageSrc;
                img.removeAttribute('data-image-src');
            }
            return;
        }
        target = target.parentNode;
    }
}

function onLoadSpoilCloseButton(img) {
    var spoilBody = img;
    while (spoilBody && spoilBody.classList && !spoilBody.classList.contains('block-body')) {
        spoilBody = spoilBody.parentNode;
    }
    spoilCloseButton(spoilBody);
}

/**
 *		========================
 *		add anchor link to spoil
 *		========================
 */

document.addEventListener('DOMContentLoaded', createAnchorSpoilerLink);

function createAnchorSpoilerLink() {
    if (document.body.id != 'topic' || document.body.querySelector('.block-title .anchor')) return;
    var postAll = document.querySelectorAll('.post_container');
    for (var i = 0; i < postAll.length; i++) {
        var postId = postAll[i].getAttribute('name').match(/\d+/);
        var spoilerAll = postAll[i].querySelectorAll('.post-block.spoil > .block-title');
        for (var j = 0; j < spoilerAll.length; j++) {
            if (spoilerAll[j].textContent.length == 0) spoilerAll[j].classList.add('empty');
            spoilerAll[j].insertAdjacentHTML("beforeEnd", '<a class="anchor" onclick="event.preventDefault();" href="http://4pda.ru/forum/index.php?act=findpost&pid=' + postId + '&anchor=Spoil-' + postId + '-' + (j + 1) + '" name="Spoil-' + postId + '-' + (j + 1) + '" title="Spoil-' + postId + '-' + (j + 1) + '"><span>#</span></a>');
        }
    }
}

/**
 *		===========
 *		scroll page
 *		===========
 */

function scrollToAnchor() {
    var anchor = document.querySelector('[name="' + location.hash.match(/[^#].*/) + '"]');
    var p = anchor;
    if (!anchor) return;
    if (anchor.nodeName == 'A') {
        while (!p.classList.contains('post_container')) {
            if (p.classList.contains('spoil')) {
                p.classList.remove('close');
                p.classList.add('open');
                substitutionAttributes(p);
            }
            if (p.classList.contains('hat')) {
                p.children[0].classList.remove('close');
                p.children[0].classList.add('open');
                p.children[1].removeAttribute('style');
            }
            p = p.parentNode;
        }
    }

    // highlight "new message"
    if (anchor.nodeName == 'DIV') anchor.nextElementSibling.classList.add('active');

	// jump to the anchor
	window.addEventListener('load', function() {anchor.scrollIntoView();});
}
document.addEventListener('DOMContentLoaded', scrollToAnchor);

function jumpToAnchorOnPage() {
    var snapAll = document.body.querySelectorAll('a[title="Перейти к сообщению"]');
    if (!snapAll[0]) return;
    for (var i = 0; i < snapAll.length; i++) {
        snapAll[i].addEventListener('click', onClickAnchor);

        function onClickAnchor(e) {
            var anchor = document.querySelector('[name="entry' + e.target.href.match(/findpost&pid=([\s\S]*)/)[1] + '"]');
            if (anchor) {
                e.preventDefault();
                anchor.scrollIntoView();
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', jumpToAnchorOnPage);

window.addEventListener('load', scrollPageQMS);
function scrollPageQMS(){
    if (document.body.id == "qms") window.scrollTo(0, document.body.scrollHeight);
}

/**
 *		=============
 *		selected text
 *		=============
 */

function getSelectedText() {
    var txt = '';
    if (window.getSelection) {
        txt = window.getSelection();
    } else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    } else return;
    return txt;
};

/**
 *		====================
 *		code lines numbering
 *		====================
 */

document.addEventListener('DOMContentLoaded', numberingCodeLinesFoo);

function numberingCodeLinesFoo() {
    var codeBlockAll = document.querySelectorAll('.post-block.code');
    if (codeBlockAll[0].hasAttribute('wraptext')) return;
    for (var i = 0; i < codeBlockAll.length; i++) {
        var codeBlock = codeBlockAll[i],
            codeTitle = codeBlock.querySelector('.block-title'),
            codeBody = codeBlock.querySelector('.block-body'),
            newCode = codeBody.innerHTML.split('<br>'),
            count = '',
            lines = '';

        while (~newCode[newCode.length - 1].search(/^\s*$/gi)) newCode.pop();

        for (var j = 0; j < newCode.length; j++) {
            lines += '<span class="line">' + newCode[j] + '</span><br>';
            count += (j + 1) + '\n';
        }

        codeBlock.setAttribute('wraptext', 'wrap');
        codeTitle.insertAdjacentHTML("afterEnd", '<span class="toggle-btn"><span>PRE</span></span><div class="num-pre">' + count + '</div>');
        codeBlock.querySelector('.toggle-btn').addEventListener('click', onClickToggleButton, false);
        codeBody.innerHTML = lines;
    }

    function onClickToggleButton(e) {
        e.stopPropagation();
        for (var i = 0; i < codeBlockAll.length; i++) {
            if (codeBlockAll[i].getAttribute('wraptext') == 'wrap') {
                codeBlockAll[i].setAttribute('wraptext', 'pre');
            } else codeBlockAll[i].setAttribute('wraptext', 'wrap');
        }
    }
}

/**
 *		=================
 *		ALL POST ATTACHES
 *		=================
 */

function getAttaches() {
    var anchorList = document.querySelectorAll('div[id*="entry"]');
    var jsonArr = [];
    for (var i = 0; i < anchorList.length; i++) {
        var post = anchorList[i].nextElementSibling;
        if (!post.classList.contains('post_container')) break;
        var attachList = post.querySelectorAll('a[data-rel*="lytebox"]');
        var arr = [];
        for (var j = 0, count = 0; j < attachList.length; j++) {
            var att = attachList[j].getAttribute('href');
            if (att.match(/jpg|png|bmp|gif|jpeg/i)) {
                arr.push(att);
                count++;
            }
        }
        if (!arr[0]) continue;
        jsonArr.push(arr);
    }
    return jsonArr;
}
window.addEventListener('load', function() {HTMLOUT.sendPostsAttaches(JSON.stringify(getAttaches()));});

/**
 *	===========
 *	RELOAD PAGE
 *	===========
 */

window.addEventListener('keydown', function(e) {if (event.keyCode == 116) location.assign(locatio.href.match(/.+st=\d+/g));});

/**
 *		================================
 *		MULTIMODERATION NAVIGATION PANEL
 *		================================
 */

function moderNavPanel() {
	var pagesContainer = document.querySelectorAll('.pages');
	for (var i = 0; i < pagesContainer.length; i++) {
		var pagesAll = pagesContainer[i].querySelectorAll('a,b');
		var selectElem = document.createElement('select');
		selectElem.className = "button page";
		for (var j = 0; j < pagesAll.length; j++) {
			var page = pagesAll[j];
			selectElem.insertAdjacentHTML("beforeEnd", '<option value="' + page + '"' + ((page.nodeName == 'B') ?' selected': '') + '>' + page.innerText + '</option>');
		}
		pagesContainer[i].appendChild(selectElem);
		selectElem.addEventListener('change', function() {location.assign(selectElem.value);});
		selectElem.insertAdjacentHTML("beforeBegin", '<a href="' + pagesAll[0] + '" class="button first' + ((pagesAll[0].nodeName == 'B') ?' disabled': '') + '"><span>&lt;&lt;</span></a>');
		selectElem.insertAdjacentHTML("afterEnd", '<a href="' + pagesAll[(pagesAll.length - 1)] + '" class="button last' + ((pagesAll[(pagesAll.length - 1)].nodeName == 'B') ?' disabled': '') + '"><span>&gt;&gt;</span></a>');
	}
}
document.addEventListener('DOMContentLoaded', moderNavPanel);

/**	
 *		==================
 *		QMS SELECT MESSAGE
 *		==================
 */

document.addEventListener("click", checkedQmsMessage);

function checkedQmsMessage() {
    var target = event.target;
    var messForDeleteCount = 0;
    while (target != this) {
        if (target.classList.contains('list-group-item') && !target.nodeName = 'A') {
            var checkbox = target.getElementsByTagName('input')[0];
            if (checkbox.checked) {
                checkbox.checked = false;
                target.classList.remove('selected');
                messForDeleteCount--;
            } else {
                checkbox.checked = true;
                target.classList.add('selected');
                messForDeleteCount++;
            }
            if (messForDeleteCount > 0) {
                HTMLOUT.startDeleteModeJs(messForDeleteCount);
            } else {
                HTMLOUT.stopDeleteModeJs();
            }
            return;
        }
        target = target.parentNode;
    }
}

/**
 *		===
 *		END
 *		===
 */

function kek(postId, logined) {
    window.onload = function() {
        var anchors = document.querySelectorAll('.karma');
        var data = JSON.parse(getCommentsData())[postId];
        for (var i = 0; i < anchors.length; i++) {
            var found = anchors[i].getAttribute("data-karma").match(/([\d]*)-([\d]*)/);
            anchors[i].innerHTML = '<b class="icon-karma-up" title="Мне нравится" data-karma-act="1-264127-2745153"></b><span class="num-wrap"><span class="num" title="Понравилось"></span></span>';
            anchors[i].querySelector(".num-wrap .num").innerHTML = data[found[2]][3];
            if (logined) {
                anchors[i].onclick = function() {
                    found = this.getAttribute("data-karma").match(/([\d]*)-([\d]*)/);
                    this.querySelector(".num-wrap .num").innerHTML = data[found[2]][3] + 1;
                    HTMLOUT.likeComment(found[1], found[2]);
                };
            }
        }
    };
}

function getIds() {
    var p = document.documentElement ? document.documentElement : document.body;
    var c = p.getElementsByTagName('input');
    var result = [];
    for (i = 0; i < c.length; ++i) {
        if ('checkbox' == c[i].type) {
            if (c[i].checked) {
                result.push(c[i].getAttribute('value'));
            }
        }
    }
    HTMLOUT.showCuratorDialog(result.join());
}

function invertCheckboxes() {
    var p = document.documentElement ? document.documentElement : document.body;
    var c = p.getElementsByTagName('input');
    for (i = 0; i < c.length; ++i)
        if ('checkbox' == c[i].type) c[i].checked = !c[i].checked;
}

//Уникальная переменная
var checkedCheckboxInCheckboxesPostCurator = false;

function setCheckedAll() {
    var p = document.documentElement ? document.documentElement : document.body;
    var c = p.getElementsByTagName('input');
    for (i = 0; i < c.length; ++i) {
        if ('checkbox' == c[i].type) {
            if (checkedCheckboxInCheckboxesPostCurator)
                c[i].checked = true;
            else
                c[i].checked = false;
        }
    }
    checkedCheckboxInCheckboxesPostCurator = !checkedCheckboxInCheckboxesPostCurator;
}

function copySelection() {
    var selObj = window.getSelection();
    var selectedText = selObj.toString();
    if (selectedText != null && selectedText != '')
        alert(selectedText);
}

function deleteMessages(formId) {
    try {
        //var f=elem(formId);
        var checkboxes = document.body.getElementsByTagName('input');

        var checkboxesChecked = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesChecked.push(checkboxes[i].name);
            }
        }

        // Return the array if it is non-empty, or null
        window.HTMLOUT.deleteMessages(checkboxesChecked.length > 0 ? checkboxesChecked : null);
    } catch (err) {
        window.HTMLOUT.showMessage(err.toString());
    }
}

function toggleSpoilerVisibility(e) {
    var t = e.parentNode.parentNode.getElementsByTagName("div")[1];
    "none" == t.style.display ? (t.style.display = "", e.parentNode.setAttribute("class", "hidetop open")) : (t.style.display = "none", e.parentNode.setAttribute("class", "hidetop close"))
};

function openHat(e) {
    var t = e.parentNode.getElementsByTagName("div")[1];
    "none" == t.style.display ? (t.style.display = "", e.setAttribute("class", "hidetop open")) : (t.style.display = "none", e.setAttribute("class", "hidetop close"))
};

function changeStyle(cssFile) {
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);
    document.getElementsByTagName("head").item(0).replaceChild(newlink, document.getElementsByTagName("link").item(0));
}

/*
 function getSctollPosition(id) {
 var elem = document.getElementById(id);
 var x = 0;
 var y = 0;

 while (elem != null) {
 x += elem.offsetLeft;
 y += elem.offsetTop;
 elem = elem.parent;
 }
 window.HTMLOUT.getSctollPosition(y);

 function scrollToElement(id) {

 var el = document.getElementById(id);
 var x = 0;
 var y = 0;
 while (el != null) {
 x += el.offsetLeft;
 y += el.offsetTop;
 el = el.parent;
 }
 window.scrollTo(0, y);
 //	HIGHLIGHT ACTIVE POST
 document.querySelector('DIV[name="' + id + '"] + .post_container').classList.add('active');
 };*/

function areaPlus() {
    var textarea_obj = elem("Post");
    textarea_obj.rows += 2;
}

function areaMinus() {
    var textarea_obj = elem("Post");
    if (textarea_obj.rows <= 8) return;
    textarea_obj.rows -= 2;
}

function getPostBody() {
    var textarea_obj = elem("Post");

    window.HTMLOUT.setPostBody(textarea_obj.value);

};

function clearPostBody() {
    var textarea_obj = elem("Post");

    textarea_obj.value = null;

};

function preparePost() {
    var textarea_obj = elem("Post");

    window.HTMLOUT.post(textarea_obj.value);

};

function advPost() {
    var textarea_obj = elem("Post");

    window.HTMLOUT.advPost(textarea_obj.value);

};

function insertText(text) {
    try {
        window.HTMLOUT.insertTextToPost(text);
    } catch (err) {

    }

    //	var textarea_obj = elem ( "Post" );
    //	textarea_obj.value+=text;
    //	return false;
}

function getDivInnerText(msgId) {
    var textarea_obj = elem(msgId);
    return textarea_obj.innerText;

}

function postQuote(postId, date, userNick) {
    var textarea_obj = elem("msg" + postId);
    var text = textarea_obj.innerText;
    return insertText("[quote name='" + userNick + "' date='" + date + "' post='" + postId + "']\n" + text + "\n[/quote]");
}


function elem(id) {
    if (isdef(typeof(document.getElementById))) return document.getElementById(id);
    else if (isdef(typeof(document.all))) return document.all[id];
    else if (isdef(typeof(document.layers))) return document[id];
    else return null;
}


function elemByName(name) {
    if (isdef(typeof(document.getElementsByName))) return document.getElementsByName(name)[0];
    else if (isdef(typeof(document.all))) return document.all[name];
    else if (isdef(typeof(document.layers))) return document[name];
    else return null;
}

function isdef(typestr) {
    return ((typestr != "undefined") && (typestr != "unknown")) ? true : false;
}
