import React from 'react';

type ModalNoteProps = {
    note: string;
}

const ModalNote = ({note}: ModalNoteProps) => {
  return (
    <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
        <span className='font-semibold'>NOTE: </span>
        {note}
    </p>
  )
}

export default ModalNote;