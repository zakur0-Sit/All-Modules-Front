import {Header} from "../Components/Header/Header"



export const LayoutMenu = ({children, headerImage}) => {
    return(
        <>
            
            <Header headerImage={headerImage}/>
            {
                children
            }
            {/* add footer component */}
        </>
    )
}