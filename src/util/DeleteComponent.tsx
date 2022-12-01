import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmationDialog, DeleteDialog, noop, showError } from '../components/common';
import { ServerErrors } from '../modals/commonTypes';
import info from '../assets/icons/ic-info-filled.svg';
import { useHistory } from 'react-router';
import TippyCustomized, { TippyTheme } from '../components/common/TippyCustomized';

function DeleteComponent({
    setDeleting,
    toggleConfirmation,
    deleteComponent,
    title,
    component,
    payload,
    confirmationDialogDescription =  '',
    redirectTo = false,
    url = '',
    reload,
    configuration = '',
    toggleRepoSelectionTippy = noop
    // triggerTarget,
}) {
    const [showCannotDeleteDialogModal, setCannotDeleteDialogModal] = useState(false);
    const { push } = useHistory();

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteComponent(payload);
            toast.success('Successfully deleted');
            toggleConfirmation(false);
            setDeleting(false);
            if (redirectTo) {
                push(url);
            } else {
                reload();
            }
        } catch (serverError) {
            if (serverError instanceof ServerErrors && serverError.code === 500) {
                setCannotDeleteDialogModal(true)
                toggleRepoSelectionTippy()
            }
        } finally {
            setDeleting(false);
        }
    }

    // const handleConfirmation = () => {
    //     setCannotDeleteDialogModal(false);
    //     toggleConfirmation(false);
    // };

    // const renderCannotDeleteDialogModal = () => {
    //     return (
    //         <ConfirmationDialog className="confirmation-dialog__body--w-400">
    //             <ConfirmationDialog.Icon src={info} />
    //             <ConfirmationDialog.Body title={`${component} '${title}' is configured as source for Dockerfile`} />
    //             <p className="fs-13 cn-7 ">{confirmationDialogDescription}</p>
    //             <ConfirmationDialog.ButtonGroup>
    //                 <button type="button" className="cta" onClick={handleConfirmation}>
    //                     Okay
    //                 </button>
    //             </ConfirmationDialog.ButtonGroup>
    //         </ConfirmationDialog>
    //     );
    // };

    const renderDeleteDialog = () => {
        return (
            <DeleteDialog
                title={`Delete ${component} '${title}'`}
                delete={handleDelete}
                closeDelete={() => toggleConfirmation(false)}
            >
                <DeleteDialog.Description>
                    <p>Are you sure you want to delete this {configuration ? configuration : component}? </p>
                </DeleteDialog.Description>
            </DeleteDialog>
        );
    };
    return (
        <div>
            {!showCannotDeleteDialogModal && renderDeleteDialog()}
            {/* {showCannotDeleteDialogModal && renderCannotDeleteDialogModal()} */}
        </div>
    );
}

export default DeleteComponent;
