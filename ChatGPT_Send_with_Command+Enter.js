// ==UserScript==
// @name         ChatGPT Send with Command+Enter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages in ChatGPT using Command+Enter instead of Enter alone, and insert newline at current cursor position with Enter.
// @author       liyunpeng@live.com
// @match        https://*.chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chatInputSelector = 'textarea[id="prompt-textarea"]'; // CSS selector for the ChatGPT input boxes
    let isIMEActive = false;

    function handleKeydown(e) {
        // 确保只处理输入框中的 Enter 键
        const chatInput = document.querySelector(chatInputSelector);
        if (e.key === 'Enter' && chatInput && e.target === chatInput) {
            if (isIMEActive) {
                console.log("Enter pressed while IME is active");
            } else {
                if (!e.metaKey && !e.ctrlKey) {
                    console.log("Enter at current position");
                    e.preventDefault(); // Prevent default behavior
                    e.stopPropagation(); // Stop event propagation

                    // Get the cursor position
                    const cursorPosition = chatInput.selectionStart;
                    const textBeforeCursor = chatInput.value.substring(0, cursorPosition);
                    const textAfterCursor = chatInput.value.substring(cursorPosition);

                    // Insert newline at cursor position
                    chatInput.value = textBeforeCursor + '\n' + textAfterCursor;

                    // Move cursor to the position after the newline
                    chatInput.selectionStart = cursorPosition + 1;
                    chatInput.selectionEnd = cursorPosition + 1;

                    // 手动触发输入事件，强制浏览器重新计算输入框高度
                    const event = new Event('input', { bubbles: true });
                    chatInput.dispatchEvent(event);
                } else {
                    copyInputContentToClipboard(e);
                }
            }
        }
    }

    function handleCompositionStart(e) {
        isIMEActive = true;
    }

    function handleCompositionEnd(e) {
        isIMEActive = false;
    }

    function copyInputContentToClipboard(e) {
        // Use e.target to get the current element that triggered the event
        const chatInput = e.target;

        // Copy text to clipboard
        navigator.clipboard.writeText(chatInput.value)
            .then(function() {
                console.log('Text copied to clipboard');
            })
            .catch(function(err) {
                console.error('Could not copy text: ', err);
            });
    }

    // 设置全局键盘事件监听器
    document.addEventListener('keydown', handleKeydown, true); // 使用捕获阶段

    // Initial binding for composition events
    document.addEventListener('compositionstart', handleCompositionStart, true);
    document.addEventListener('compositionend', handleCompositionEnd, true);
})();
