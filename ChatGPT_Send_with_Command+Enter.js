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

    const chatInputSelector = '#prompt-textarea'; // 选择器，适配 textarea 或 contenteditable div
    let isIMEActive = false;

    function handleKeydown(e) {
        const chatInput = document.querySelector(chatInputSelector);

        // 确保只处理指定输入框中的 Enter 键事件
        if (e.key === 'Enter' && chatInput && e.target === chatInput) {
            // 判断是否按下了 Meta（Command）或 Ctrl 键
            if (e.metaKey || e.ctrlKey) {
                // Command + Enter 或 Ctrl + Enter 触发复制到剪贴板
                copyInputContentToClipboard(e);
            } else {
                // 普通的 Enter 键处理换行
                if (!isIMEActive) {
                    e.preventDefault(); // 阻止默认行为，如直接发送消息
                    e.stopPropagation(); // 阻止事件传播到其他监听器

                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);

                    // 创建一个文本节点，用于插入换行符
                    const br = document.createElement('br');

                    // 插入换行符并调整光标位置
                    range.deleteContents(); // 删除当前选中内容
                    range.insertNode(br); // 插入换行符

                    // 将光标移动到 <br> 之后
                    range.setStartAfter(br);
                    range.setEndAfter(br);
                    selection.removeAllRanges(); // 清除当前所有范围
                    selection.addRange(range); // 添加新的光标范围

                    // 手动触发输入事件以更新输入框高度
                    const inputEvent = new Event('input', { bubbles: true });
                    chatInput.dispatchEvent(inputEvent);
                }
            }
        }
    }

    function handleCompositionStart(e) {
        isIMEActive = true; // 处理输入法开始输入状态
    }

    function handleCompositionEnd(e) {
        isIMEActive = false; // 输入法输入结束
    }

    function copyInputContentToClipboard(e) {
        const chatInput = e.target;
        const text = chatInput.innerText || chatInput.value;
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }

    // 在 window 上添加捕获阶段的键盘事件监听器
    window.addEventListener('keydown', handleKeydown, true); // 捕获阶段
    window.addEventListener('compositionstart', handleCompositionStart, true);
    window.addEventListener('compositionend', handleCompositionEnd, true);
})();
