import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import Container from '@/components/common/Container';
import Loading from '@/components/common/Loading';
import Header from '@/components/common/Header';
import React from 'react';
import { BiPlus } from 'react-icons/bi';

const loading = () => {
  return (
    <Container>
      <div className='flex items-center justify-between w-full'>
        <Header text='Projects' />

        <ButtonWithIcon
          title='New project'
          icon={<BiPlus />}
          disabled
        />
      </div>

      <Loading withText text='projects' />
    </Container>
  )
}

export default loading;