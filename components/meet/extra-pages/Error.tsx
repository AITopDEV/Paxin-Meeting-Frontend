import React from 'react';
import ReturnBtn from './ReturnBtn';

export interface IErrorPageProps {
  title: string;
  text: string;
}

const ErrorPage = ({ title, text }: IErrorPageProps) => {
  return (
    <div
      id='errorPage'
      className='error-page flex h-full w-full items-center justify-center'
    >
      <div
        className={`error-app-bg pointer-events-none absolute left-0 top-0 h-full w-full bg-cover bg-center bg-no-repeat object-cover`}
        style={{
          backgroundImage: `url("/images/meet/app-banner.jpg")`,
        }}
      />
      <div className='content relative z-20 flex h-80 w-[450px] flex-col items-center justify-center gap-10 rounded-xl bg-white text-center shadow-lg dark:bg-darkPrimary/90'>
        <div className='inner text-center dark:text-darkText'>
          <h2 className='mb-4 text-3xl font-medium'>{title}</h2>
          <p>{text}</p>
        </div>
        <ReturnBtn />
      </div>
    </div>
  );
};

export default ErrorPage;
