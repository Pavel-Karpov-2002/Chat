import { Message } from "./Message";
import { IUser } from "../types/user";
import { createRef, DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { SendMessageForm } from "./SendMessageForm";
import { useLocation, useNavigate } from "react-router-dom";
import { ws } from "../App";


export const Chat = () => {
	
    const toLogin = useNavigate();
    const userLocation = useLocation();
	const [users, setUsers] = useState<IUser[]>([]);
	const firstMessage = useRef(true);

	const addNewMessages = () => {
		ws.send(JSON.stringify({lastMessages: users.length + 2}));
	}

	ws.onerror = function(err) {
		alert('Socket encountered error: ' + err.target);
		toLogin("/");
		toLogin(0);
	  };

	ws.onclose = function(e) {
		alert('Socket is closed.');
		toLogin("/");	
		toLogin(0);
	};

	useEffect(() => { 	
		ws.onmessage = (e) => {
			try{
				changeId(e);
				if (e.data == "Name is loggining.") {
					toLogin("/");
					toLogin(0);
				}
				try {
					let JSONparser= JSON.parse(e.data);
					if(JSONparser.pathname != null){
						setUsers([...users, JSONparser]);	
					}
					else{
						setUsers(JSONparser);
					}
				}	
				catch {
					return false;
				}
			}
			catch (e) {
				console.log(e);
			}
	}}, [users])

	const changeId = (e : any) => {
		if (firstMessage.current == true) {
			let isLogin : any = userLocation;
			
			if (isLogin.state == null) {
				toLogin("/");
				toLogin(0);
			}
			else if (isLogin.state.id != null) {
				isLogin.state.id = e.data;
				let path = window.location.pathname;
				ws.send( JSON.stringify( { link: path.substring(path.lastIndexOf('/') + 1) } ) );
				ws.send(JSON.stringify(isLogin.state));
				ws.send(JSON.stringify({lastMessages: 5 }));
			}

			firstMessage.current = false;
			return;
		}
	}

  	return (
		<div className="card chat-card" id="chat">
			<div className="card-header" id="chatheader">Chat ({ window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) }) </div>
			<input type="button" onClick={() => { setUsers([]); addNewMessages(); } } className="btn" value="Прошлые сообщения"  />
				<div className="card-body height3" >
				<ul className="scroll chat-list messages-box" >
					{ Array.isArray(users) ? users.map( (user, index) => <Message information={ user }  key={index} />) : null }
				</ul>
				<SendMessageForm />
			</div>
    	
		</div>
  	)
}


window.onload = function(){ 
	dragElement(document.getElementById("chat"));
	function dragElement(elmnt : any) {
	
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
	function dragMouseDown(e : any) {
	  e = e || window.event;
	  e.preventDefault();
	  // получить положение курсора мыши при запуске:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // вызов функции при каждом перемещении курсора:
	  document.onmousemove = elementDrag;
	}
  
	function elementDrag(e : any) {
	  e = e || window.event;
	  e.preventDefault();
	  // вычислить новую позицию курсора:
	  pos1 = pos3 - e.clientX;
	  pos2 = pos4 - e.clientY;
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  // установите новое положение элемента:
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
	  // остановка перемещения при отпускании кнопки мыши:
	  document.onmouseup = null;
	  document.onmousemove = null;
	}

	const chatHeader: HTMLElement | null = document.getElementById("chatheader");

	if (chatHeader) {
	  // если присутствует, заголовок - это место, откуда вы перемещаете DIV:
	  chatHeader.onmousedown = dragMouseDown;
	} else {
	  // в противном случае переместите DIV из любого места внутри DIV:
	  elmnt.onmousedown = dragMouseDown;
	}
  }
  }