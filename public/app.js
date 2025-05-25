import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp, orderByChild } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDDdPLcCv6FAR0ZoKkL67pRK0KWxjoGTj0",
    authDomain: "cheerup-ccfd2.firebaseapp.com",
    databaseURL: "https://cheerup-ccfd2-default-rtdb.firebaseio.com",
    projectId: "cheerup-ccfd2",
    storageBucket: "cheerup-ccfd2.firebasestorage.app",
    messagingSenderId: "886556454353",
    appId: "1:886556454353:web:24c53bced1d9761336c4f0",
    measurementId: "G-B1KBH6S1Q9"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messageList = document.getElementById('messageList');

    // 메시지 목록 불러오기
    const loadMessages = () => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // 최신 메시지가 위에 오도록 정렬
            messages.sort((a, b) => b.createdAt - a.createdAt);
            
            messageList.innerHTML = messages.map(message => `
                <div class="message-card">
                    <div class="message-content">${message.content}</div>
                    <div class="message-time">${new Date(message.createdAt).toLocaleString()}</div>
                </div>
            `).join('');
        });
    };

    // 메시지 제출 처리
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const content = messageInput.value.trim();
        if (!content) return;

        try {
            const messagesRef = ref(database, 'messages');
            await push(messagesRef, {
                content,
                createdAt: serverTimestamp()
            });
            
            messageInput.value = '';
        } catch (error) {
            console.error('메시지 전송에 실패했습니다:', error);
        }
    });

    // 초기 메시지 로드
    loadMessages();
}); 