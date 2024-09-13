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

    const chatInputSelector = '#prompt-textarea'; // CSS selector for the ChatGPT input boxes
    let isIMEActive = false;

    function getChatInputText(chatInput) {
        // 获取输入框的文本内容，根据元素类型处理
        if (chatInput.value !== undefined) {
            // 如果是 textarea
            return chatInput.value;
        } else {
            // 如果是 contenteditable div
            return chatInput.innerText;
        }
    }

    function setChatInputText(chatInput, text) {
        // 设置输入框的文本内容，根据元素类型处理
        if (chatInput.value !== undefined) {
            // 如果是 textarea
            chatInput.value = text;
        } else {
            // 如果是 contenteditable div
            chatInput.innerText = text;
        }
    }

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

                    // 获取光标位置
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const cursorPosition = range.startOffset;

                    // 获取输入框内容
                    const text = getChatInputText(chatInput);
                    const textBeforeCursor = text.substring(0, cursorPosition);
                    const textAfterCursor = text.substring(cursorPosition);

                    // 在光标位置插入换行符
                    const newText = textBeforeCursor + '\n' + textAfterCursor;
                    setChatInputText(chatInput, newText);

                    // 移动光标到换行符之后
                    range.setStart(range.startContainer, cursorPosition + 1);
                    range.setEnd(range.startContainer, cursorPosition + 1);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // 手动触发输入事件，强制浏览器重新计算输入框高度
                    const inputEvent = new Event('input', { bubbles: true });
                    chatInput.dispatchEvent(inputEvent);
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
        const text = getChatInputText(chatInput);
        navigator.clipboard.writeText(text)
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
