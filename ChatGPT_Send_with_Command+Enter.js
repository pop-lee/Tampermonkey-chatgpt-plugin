// ==UserScript==
// @name         ChatGPT Send with Command+Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone, and insert newline at current cursor position with Enter.
// @author       liyunpeng@live.com
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = 'textarea[id="prompt-textarea"]'; // CSS selector for the ChatGPT input boxes

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            if(!e.metaKey && !e.ctrlKey) {
                console.log("Enter at current position");
                e.preventDefault(); // 防止默认行为
                e.stopPropagation(); // 防止事件冒泡

                // 获取光标当前位置
                const cursorPosition = e.target.selectionStart;
                const textBeforeCursor = e.target.value.substring(0, cursorPosition);
                const textAfterCursor = e.target.value.substring(cursorPosition);

                // 在光标位置插入换行符
                e.target.value = textBeforeCursor + '\n' + textAfterCursor;

                // 将光标移动到插入换行符后的位置
                e.target.selectionStart = cursorPosition + 1;
                e.target.selectionEnd = cursorPosition + 1;
            } else {
                copyInputContentToClipboard(e);
            }
        }
    }

    function copyInputContentToClipboard(e) {
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