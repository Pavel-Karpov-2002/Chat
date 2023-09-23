import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ws } from '../App';

interface ILink {
    link: { current: string }
}

export function Login() {

    const toChat = useNavigate();
    const [user, setUser] = useState({ id: 0, name: "" });
    const [link, setLink] = useState("");

    const logining = (event: React.FormEvent) => {
        event.preventDefault();
        if (user.name == '') {
            return
        }
        
        
        try {
            ws.send(JSON.stringify({link: link}));
        } catch (error) {
            console.log(error);
        }
        

        try {
            ws.send(JSON.stringify(user));
        } catch (error) {
            console.log(error);
        }
    }

    ws.onmessage = (e) => {
        if (e.data == "successful") {
            toChat("./Chat/" + link, {state: { id: user.id, name: user.name } });
            toChat(0)
        }
        if (e.data == "Name is loggining.") {
            alert(e.data);
        }
        else {
            setUser({ id: e.data, name: "" });
        }
    }

	ws.onerror = function(err) {
		alert('Socket encountered error: ' + err.target);
	  };

	ws.onclose = function(e) {
		alert('Socket is closed.');
	};

    const changeHandler = (event: string) => {
        if(event.length > 0) {
            if (event[event.length - 1] != event[event.length - 1].replace(/[A-Za-z]/ig, '')){
                setUser({id: user.id, name: event})
            }
        }
    }

    const changeLinkHandler = (event: string) => {
        if(event.length > 0) {
            if (event[event.length - 1] != event[event.length - 1].replace(/[A-Za-zА-яА-я]/ig, '')){
                setLink(event);
            }
        }
    }

    return (
        <div className="login-on-center">
            <form onSubmit={logining} className="form-center-login">
                <div className="form-group">
                    <label>Навзвание комнаты</label>
                    <input type="text" className="form-control" value={ link } onChange={(e) => changeLinkHandler(e.target.value)} placeholder="Название чата" />
                </div>
                <div className="form-group">
                    <label >Никнейм</label>
                    <input type="text" className="form-control" value={ user.name } onChange={(e) => changeHandler(e.target.value)} placeholder="Ник" />
                    
                </div>
                <br />
                <button type="submit" className="btn btn-primary col-12" id="input-group-button-right">Отправить</button>
            </form>
        </div>
    )
}