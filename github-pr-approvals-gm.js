// ==UserScript==
// @name         GitHub PR Approvals
// @namespace    http://mattstow.com
// @version      0.1
// @description  Require =Approved= before you can merge GitHub PRs
// @author       Matt Stow (@stowball)
// @match        https://github.com/*/*/pull/*
// @grant        none
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
    document.querySelector('.js-merge-branch-action').disabled = true;
}

function enableButton() {
    document.querySelector('.js-merge-branch-action').disabled = false;
}

function lookForApproval(delay) {
    var delay = delay || 1500;

    window.setTimeout(() => {
        var comments = document.querySelectorAll('.comment-body p');
        var foundApprovals = 0;

        for (var i = comments.length - 1; i >= 0; i--) {
            if (comments[i].textContent === approvalString) {
                foundApprovals++;

                if (foundApprovals === requiredApprovals) {
                    enableButton();

                    break;
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

document.addEventListener('click', checkListener, false);
document.addEventListener('keydown', checkListener, false);

lookForApproval(1);
