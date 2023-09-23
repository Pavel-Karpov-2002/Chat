import { useLocation } from "react-router-dom";
import { IUser } from "../types/user";

interface userProps {
    information: IUser
}

export const Message = ( user : userProps ) => {
    const userLocation = useLocation();

    let me : any = userLocation;

    return (
        <li className={ user.information.state.name == me.state.name ? "out" : "in" }>
            <div className="chat-img">
                <img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar1.png" />
            </div>
            <div className="chat-body">
                <div className="chat-message">
                    <h5>{user.information.state.name}</h5>
                    <p>{user.information.message}</p>
                </div>
            </div>
        </li>
    )
}
