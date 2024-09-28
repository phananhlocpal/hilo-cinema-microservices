import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, } from "@chakra-ui/react";
import { useRef } from "react";
import PropTypes from "prop-types";

function MyAlertDialog({ title, content, isOpen, onClose, onConfirm }) {
    const cancelRef = useRef();

    return (
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>{title}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>{content}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            No
                        </Button>
                        <Button
                            colorScheme="red"
                            ml={3}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

MyAlertDialog.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default MyAlertDialog;
