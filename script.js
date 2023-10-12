import bot from './assets/bot.svg';
import user from './assets/user.svg';
import axios from "axios"

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, text){
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId){
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>    
            </div>
        
        </div>
        
        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //user 

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //bot

    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    //fetch data
    const options = {
        method: 'POST',
        url: 'https://simple-chatgpt-api.p.rapidapi.com/ask',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'dc966d6de5msh156ffd0298512aap179c97jsn9a3f4f9362cc',
          'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
        },
        data: {
          question: data.get('prompt')
        }
      };

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
    try {
        const response = await axios.request(options);
        const data = await response.data.answer;
        typeText(messageDiv, data)
      } catch (error) {
            messageDiv.innerHTML = "Something went wrong" + error
            alert(error)
      }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
})