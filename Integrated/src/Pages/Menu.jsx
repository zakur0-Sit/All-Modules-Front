import { MenuContent } from "../Components/MenuContent/MenuContent.jsx";
import { Header } from "../Components/Header/Header.tsx";
import { Footer } from "../Components/Footer/Footer.jsx";
import { ImageContent } from "../Components/ImageContent/ImageContent";

export const Menu = () => 
{
    return (
        <div>
            <Header />
            <ImageContent image="img/menu-background.jpg"/>
            <MenuContent />
            <Footer />
        </div>
    );
}
