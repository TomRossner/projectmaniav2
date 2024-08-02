import { useAppSelector } from '@/hooks/hooks';
import { selectIsJoiningProject, selectIsLeavingProject } from '@/store/projects/projects.selectors';
import React, { useEffect } from 'react';
import Modal from './Modal';
import Loading from '../common/Loading';

type Props = {
    isOpen: boolean;
    text: string;
}

const LoadingModal = ({isOpen, text}: Props) => {
    // const isJoiningProject = useAppSelector(selectIsJoiningProject);
    // const isLeavingProject = useAppSelector(selectIsLeavingProject);

    // useEffect(() => {
    //     console.log({isJoiningProject, isLeavingProject});
    // }, [isJoiningProject, isLeavingProject])
  return (
    <Modal
        isOpen={isOpen}
        onClose={() => {}}
        title=''
        withCloseBtn={false}
        withSubmitBtn={false}
        isLoadingModal
    >
        <div className='flex flex-col gap-4 w-full items-center justify-center'>
            <Loading withText text={text} />
        </div>
    </Modal>
  )
}

export default LoadingModal