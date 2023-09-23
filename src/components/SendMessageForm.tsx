import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ws } from '../App';

export const SendMessageForm = () =>{

    const userLocation = useLocation();
    const [message, setMessage] = useState("");
	const messagesEndRef = useRef<null | HTMLDivElement>(null)
        
    const setMess = (event: React.FormEvent) => {
        event.preventDefault();
        if (message == '') {
            return
        }
        
        try {
            ws.send(JSON.stringify({ ...userLocation, message: message }));
            setMessage('');
        } catch (error) {
            console.log(error);
        }
    }

	const scroll = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    
    const changeHandler = (event: string) => {
        setMessage(event)
    }

    return (
        <form onSubmit={setMess} className="bg-light">
            <div className="input-group"  ref={messagesEndRef}>
            <input type="text" value={message} onChange={(e) => {changeHandler(e.target.value); scroll();}} placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 bg-light" />
                <div className="input-group-append">
                    <button id="button-addon2" type="submit" className="btn btn-link"> <i className="fa fa-paper-plane"></i></button>
                </div>
            </div>
        </form>
    )
}