import Modal from "react-modal";

export const ConfirmationModal = ({isOpen, setIsModalOpen, successMessage, actionFunction, elementDisplayed, error, saveActionElementId, loadingButton, setIsLoadingButton}) => {

    Modal.setAppElement("#root");
    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f2f2f2",
            padding: "20px",
            borderRadius: "10px",

        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Example Modal"
            style={customStyles}
        >
            <p>You will delete '{elementDisplayed}' recipe. Do you want to continue?</p>
            {
                successMessage != "" ? <p style={{color: 'green'}}>{successMessage}</p> : <></>
            }
            {
                error ? <p style={{color: 'red'}}>Server error, please try again later.</p> : <></>
            }
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button type="button" style={{padding: '8px', backgroundColor: 'gray', border: 'none', color: 'black', borderRadius: '5px'}} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" disabled={loadingButton} style={{padding: '8px', backgroundColor: 'red', border: 'none', color: 'white', borderRadius: '5px'}} onClick={() => actionFunction(saveActionElementId)}>{loadingButton ? "Loading..." : "Confirm"}</button>
            </div>
        </Modal>
    )
}