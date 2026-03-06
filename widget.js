(function () {

const API_URL = "https://nonfrigid-nondidactically-beaulah.ngrok-free.dev/api/chat";

const styles = `
#ms-chatbot-button{
position:fixed;
bottom:20px;
right:20px;
width:60px;
height:60px;
border-radius:50%;
background:#2563eb;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
box-shadow:0 6px 20px rgba(0,0,0,0.2);
z-index:999999;
}

#ms-chatbot-button svg{
width:28px;
height:28px;
fill:white;
}

#ms-chatbot-panel{
position:fixed;
bottom:90px;
right:20px;
width:340px;
height:480px;
background:white;
border-radius:14px;
box-shadow:0 10px 30px rgba(0,0,0,0.2);
display:flex;
flex-direction:column;
overflow:hidden;
font-family:system-ui;
z-index:999999;
}

#ms-chatbot-header{
background:#2563eb;
color:white;
padding:14px;
font-weight:600;
}

#ms-chatbot-messages{
flex:1;
padding:12px;
overflow-y:auto;
font-size:14px;
}

.ms-msg{
margin-bottom:10px;
line-height:1.4;
}

.ms-user{
text-align:right;
}

.ms-user span{
background:#2563eb;
color:white;
padding:8px 10px;
border-radius:10px;
display:inline-block;
}

.ms-bot span{
background:#f1f5f9;
padding:8px 10px;
border-radius:10px;
display:inline-block;
}

#ms-chatbot-input{
display:flex;
border-top:1px solid #e5e7eb;
}

#ms-chatbot-input input{
flex:1;
border:none;
padding:12px;
font-size:14px;
outline:none;
}

#ms-chatbot-input button{
background:#2563eb;
color:white;
border:none;
padding:12px 16px;
cursor:pointer;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const button = document.createElement("div");
button.id = "ms-chatbot-button";

button.innerHTML = `
<svg viewBox="0 0 24 24">
<path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.54 1.5 4.8 3.9 6.3L5 21l3.7-2c1.03.29 2.14.45 3.3.45 5.52 0 10-3.92 10-8.5S17.52 3 12 3z"/>
</svg>
`;

document.body.appendChild(button);

let panel = null;

button.onclick = () => {

if(panel){
panel.remove();
panel=null;
return;
}

panel = document.createElement("div");
panel.id="ms-chatbot-panel";

panel.innerHTML = `
<div id="ms-chatbot-header">Chat Assistant</div>
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

function addMessage(text, cls){

const div=document.createElement("div");
div.className="ms-msg "+cls;

const span=document.createElement("span");
span.textContent=text;

div.appendChild(span);
messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

}

async function sendMessage(){

const text=input.value.trim();
if(!text) return;

addMessage(text,"ms-user");
input.value="";

addMessage("...", "ms-bot");

const loading = messages.lastChild;

try{

const res = await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
question:text
})
});

const data = await res.json();

loading.remove();
addMessage(data.reply || "No response","ms-bot");

}catch(e){

loading.remove();
addMessage("Connection error.","ms-bot");

}

}

send.onclick=sendMessage;

input.addEventListener("keydown",(e)=>{
if(e.key==="Enter") sendMessage();
});

};

})();