// ==UserScript==
// @name         ChatGPT Copy Text on Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone.
// @author       liyunpeng@live.com
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = 'textarea[id="prompt-textarea"]'; // CSS selector for the ChatGPT input boxes

    function handleKeydown(e) {
        // 检查按下的是否是回车键
        if (e.key === 'Enter') {
            // 使用 e.target 获取当前触发事件的元素
            const chatInput = e.target;

            // 复制文本到剪贴板
            navigator.clipboard.writeText(chatInput.value)
                .then(function() {
                    console.log('Text copied to clipboard');
                })
                .catch(function(err) {
                    console.error('Could not copy text: ', err);
                });
        }
    }

    // 设置MutationObserver来监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            document.querySelectorAll(chatInputSelector).forEach(chatInput => {
                chatInput.removeEventListener('keydown', handleKeydown);
                chatInput.addEventListener('keydown', handleKeydown);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始绑定
    document.querySelectorAll(chatInputSelector).forEach(chatInput => {
        chatInput.addEventListener('keydown', handleKeydown);
    });
})();