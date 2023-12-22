// ==UserScript==
// @name         ChatGPT Send with Command+Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone.
// @author       liyunpeng@live.com
// @match        https://*.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = '#prompt-textarea'; // CSS selector for the ChatGPT input box
    const chatInput = document.querySelector(chatInputSelector); // 选择你想要监听的输入框

    if(chatInput) {
        // Event listener to intercept the Enter key
        chatInput.addEventListener('keydown', function(e) {
            // 检查按下的是否是回车键
            if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
                debugger;
                console.log("Enter at current position");
                e.preventDefault(); // 防止默认行为
                e.stopPropagation();
                // 获取光标当前位置
                const cursorPosition = chatInput.selectionStart;
                const textBeforeCursor = chatInput.value.substring(0, cursorPosition);
                const textAfterCursor = chatInput.value.substring(cursorPosition);

                // 在光标位置插入换行符
                chatInput.value = textBeforeCursor + '\n' + textAfterCursor;

                // 将光标移动到插入换行符后的位置
                chatInput.selectionStart = cursorPosition + 1;
                chatInput.selectionEnd = cursorPosition + 1;
            }
        });
    }
})();