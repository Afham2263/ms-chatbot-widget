(function () {

const API_URL = "https://nonfrigid-nondidactically-beaulah.ngrok-free.dev/api/chat";

/* -----------------------------
SESSION MANAGEMENT
----------------------------- */

function getSessionId(){
let id = localStorage.getItem("ms_chat_session");

if(!id){
id = crypto.randomUUID();
localStorage.setItem("ms_chat_session", id);
}

return id;
}

/* -----------------------------
STYLES
----------------------------- */

const styles = `
#ms-chatbot-button{
position:fixed;
bottom:24px;
right:24px;
width:64px;
height:64px;
border-radius:50%;
background:linear-gradient(135deg,#2563eb,#1e40af);
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
box-shadow:0 12px 30px rgba(0,0,0,0.25);
z-index:999999;
transition:transform .2s ease;
}

#ms-chatbot-button:hover{
transform:scale(1.05);
}

#ms-chatbot-button svg{
width:30px;
height:30px;
fill:white;
}

#ms-chatbot-panel{
position:fixed;
bottom:100px;
right:24px;
width:360px;
height:520px;
background:white;
border-radius:16px;
box-shadow:0 20px 60px rgba(0,0,0,0.25);
display:flex;
flex-direction:column;
overflow:hidden;
font-family:system-ui;
z-index:999999;
animation:ms-chatbot-open .25s ease;
}

@keyframes ms-chatbot-open{
from{opacity:0;transform:translateY(20px)}
to{opacity:1;transform:translateY(0)}
}

#ms-chatbot-header{
background:linear-gradient(135deg,#2563eb,#1e40af);
color:white;
padding:16px;
font-weight:600;
font-size:15px;
display:flex;
align-items:center;
justify-content:space-between;
}

#ms-chatbot-messages{
flex:1;
padding:14px;
overflow-y:auto;
background:#f8fafc;
font-size:14px;
}

.ms-msg{
margin-bottom:12px;
display:flex;
}

.ms-user{
justify-content:flex-end;
}

.ms-user span{
background:#2563eb;
color:white;
padding:10px 12px;
border-radius:12px 12px 4px 12px;
max-width:70%;
}

.ms-bot span{
background:white;
border:1px solid #e5e7eb;
padding:10px 12px;
border-radius:12px 12px 12px 4px;
max-width:70%;
}

.ms-typing span{
background:white;
border:1px solid #e5e7eb;
padding:10px 12px;
border-radius:12px;
font-style:italic;
color:#6b7280;
}

#ms-chatbot-input{
display:flex;
border-top:1px solid #e5e7eb;
background:white;
}

#ms-chatbot-input input{
flex:1;
border:none;
padding:14px;
font-size:14px;
outline:none;
}

#ms-chatbot-input button{
background:#2563eb;
color:white;
border:none;
padding:0 18px;
cursor:pointer;
font-weight:600;
}

#ms-chatbot-input button:hover{
background:#1e40af;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* -----------------------------
BUTTON
----------------------------- */

const button = document.createElement("div");
button.id="ms-chatbot-button";

button.innerHTML=`
<svg viewBox="0 0 24 24">
<path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.54 1.5 4.8 3.9 6.3L5 21l3.7-2c1.03.29 2.14.45 3.3.45 5.52 0 10-3.92 10-8.5S17.52 3 12 3z"/>
</svg>
`;

document.body.appendChild(button);

let panel=null;

/* -----------------------------
TOGGLE PANEL
----------------------------- */

button.onclick=()=>{

if(panel){
panel.remove();
panel=null;
return;
}

panel=document.createElement("div");
panel.id="ms-chatbot-panel";

panel.innerHTML=`
<div id="ms-chatbot-header">
MS Education Assistant
</div>

<div id="ms-chatbot-messages"></div>

<div id="ms-chatbot-input">
<input placeholder="Ask something..." />
<button>Send</button>
</div>
`;

document.body.appendChild(panel);

const messages = panel.querySelector("#ms-chatbot-messages");
const input = panel.querySelector("input");
const send = panel.querySelector("button");

/* -----------------------------
MESSAGE RENDER
----------------------------- */

function addMessage(text, cls){

const div=document.createElement("div");
div.className="ms-msg "+cls;

const span=document.createElement("span");
span.textContent=text;

div.appendChild(span);
messages.appendChild(div);

messages.scrollTop = messages.scrollHeight;

return div;
}

/* -----------------------------
SEND MESSAGE
----------------------------- */

async function sendMessage(){

const text=input.value.trim();
if(!text) return;

const sessionId = getSessionId();

addMessage(text,"ms-user");
input.value="";

const loading = addMessage("Typing...","ms-typing");

try{

const res = await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
session_id:sessionId,
message:text
})
});

const data = await res.json();

loading.remove();

addMessage(
data.reply || "Sorry, I couldn't find an answer.",
"ms-bot"
);

}catch(e){

loading.remove();

addMessage(
"Connection error. Please try again.",
"ms-bot"
);

}

}

send.onclick=sendMessage;

input.addEventListener("keydown",(e)=>{
if(e.key==="Enter") sendMessage();
});

};

})();