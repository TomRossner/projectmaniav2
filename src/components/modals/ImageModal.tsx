import React, { ReactNode } from 'react';
import Modal from './Modal';
import useModals from '@/hooks/useModals';

type ImageModalProps = {
    isOpen: boolean;
    image: ReactNode;
}

const ImageModal = ({isOpen, image}: ImageModalProps) => {
    const {closeImageModal} = useModals();
  return (
    <Modal
        closeOnClickOutside
        isOpen={isOpen}
        title=''
        withCloseBtn={false}
        withSubmitBtn={false}
        onClose={closeImageModal}
        additionalStyles='sm:w-full max-w-[300px] flex items-center justify-center'
    >
        {image}
    </Modal>
  )
}

export default ImageModal;