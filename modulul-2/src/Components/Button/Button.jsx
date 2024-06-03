import "./Button.css";

export function Button(props) 
{
    return (
        <button className="buttonHeader">{props.text}</button>
    );
}