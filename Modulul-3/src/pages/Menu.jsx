import { MenuContent } from "../components/MenuContent/MenuContent.jsx";
import { Header } from "../components/Header/Header.jsx";
import { Footer } from "../components/Footer/Footer.jsx";
import { ImageContent } from "../components/ImageContent/ImageContent";

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
