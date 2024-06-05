import "./Pagination.css";

export const Pagination = ({totalPages, currentPage, setCurrentPage}) => {

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    return(
        <div className="pagination-container">
        {
            pageNumbers.map((number, index) => {
                return(
                    <button className={`page-button ${currentPage === number ? 'current-page-button' : ''} `} type="button" onClick={() => setCurrentPage(number)}>{number}</button>

                )
            })
        }
        </div>
    )
}