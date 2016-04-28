// ==UserScript==
// @name         GitHub PR Approvals
// @namespace    http://mattstow.com
// @version      0.2.1
// @description  Require =Approved= before you can merge GitHub PRs
// @author       Matt Stow (@stowball)
// @match        https://github.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// ==/UserScript==
/* jshint -W097 */
'use strict';

var requiredApprovals = 1;
var approvalString = '=Approved=';

/* DO NOT EDIT BELOW THIS LINE */

var css = '<style>z {} svg.octicon { pointer-events: none; }';
var style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode(css));

document.getElementsByTagName('head')[0].appendChild(style);

function disableButton() {
    var button = document.querySelector('.js-merge-branch-action');

    if (button) {
        button.disabled = true;
    }
}

function enableButton() {
    var button = document.querySelector('.js-merge-branch-action');

    if (button) {
        button.disabled = false;
    }
}

function findCommentWrapper(el) {
    while (el.parentNode) {
        el = el.parentNode;

        if (el.classList.contains('timeline-comment-wrapper')) {
            return el;
        }
    }

    return null;
}

function findCommitSiblings(el) {
    while (el.nextElementSibling) {
        el = el.nextElementSibling;

        if (el.classList.contains('discussion-commits')) {
            return el;
        }
    }

    return null;
}

function lookForApproval(d) {
    var delay = d || 1000;

    setTimeout(function () {
        var comments = document.querySelectorAll('.comment-body p');
        var foundApprovals = 0;

        for (var i = comments.length - 1; i >= 0; i--) {
            if (comments[i].textContent === approvalString) {
                var parent = findCommentWrapper(comments[i]);

                if (parent) {
                    if (!findCommitSiblings(parent)) {
                        foundApprovals++;

                        if (foundApprovals === requiredApprovals) {
                            enableButton();

                            break;
                        }
                    }
                }
            }
        }

        if (foundApprovals < requiredApprovals) {
            disableButton();
        }
    }, delay);
}

function checkListener(e) {
    if (
        (e.type === 'click' && (e.target.classList.contains('btn-primary') || e.target.classList.contains('delete-button'))) ||
        (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && e.target.classList.contains('js-comment-field'))
       ) {
        lookForApproval();
    }
}

waitForKeyElements('.js-merge-branch-action', function () {
    document.addEventListener('click', checkListener, false);
    document.addEventListener('keydown', checkListener, false);
    lookForApproval();
});
