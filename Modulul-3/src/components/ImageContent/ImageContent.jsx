import "./ImageContent.css";

export const ImageContent = ({image}) => 
{
    const style = {
        backgroundImage: `url(${image})`
    }

    return (
        <div className="recipe-background" style={style}></div>
    );
}