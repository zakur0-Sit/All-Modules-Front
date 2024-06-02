import RecipeCards from "../components/RecipeCards/RecipeCards";
import AIPart from "../AIPart";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { ImageContent } from "../components/ImageContent/ImageContent";

export const Home = () => {

    return (
        <div>
            <Header />
            <ImageContent image="img/header-background.png"/>
            <AIPart />
            <RecipeCards />
            <Footer />
        </div>
    )
}
