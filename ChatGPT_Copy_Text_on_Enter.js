// ==UserScript==
// @name         ChatGPT Copy Text on Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone.
// @author       You
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = '#prompt-textarea'; // CSS selector for the ChatGPT input box

    // 选择你想要监听的输入框，这里假设它的id是'specific-input'
    const chatInput = document.querySelector(chatInputSelector);

    if(chatInput) {
        // Event listener to intercept the Command+Enter keys
        chatInput.addEventListener('keydown', function(e) {
            // 检查按下的是否是回车键（keyCode 13）
            if (event.keyCode === 13) {
                const chatInput = document.querySelector(chatInputSelector);

                if (chatInput && chatInput === document.activeElement) {
                    // 复制文本到剪贴板
                    chatInput.focus();
                    navigator.clipboard.writeText(chatInput.value)
                        .then(function() {
                            console.log('Text copied to clipboard');
                        })
                        .catch(function(err) {
                            console.error('Could not copy text: ', err);
                        });
                }

            }
        });
    }
})();