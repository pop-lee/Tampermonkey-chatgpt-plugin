// ==UserScript==
// @name         ChatGPT Focus Input
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically set focus to the ChatGPT input box when switching back to the tab.
// @author       liyunpeng@live.com
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = 'textarea[id="prompt-textarea"]';
    let hasLeftPage = false; // 标志用于检测是否离开过当前页面

    function setFocusToChatInput() {
        const chatInput = document.querySelector(chatInputSelector);
        if (chatInput) {
            chatInput.focus();
            console.log('Focus set to ChatGPT input box');
        }
    }

    window.addEventListener('blur', function() {
        hasLeftPage = true; // 当页面失去焦点时，设置标志为true
        console.log("Window or tab lost focus");
    });

    window.addEventListener('focus', function() {
        console.log("Window or tab focused");
        if (hasLeftPage) { // 当页面重新获得焦点且之前已离开过页面时
            setFocusToChatInput();
            hasLeftPage = false; // 重置标志
        }
    });
})();
