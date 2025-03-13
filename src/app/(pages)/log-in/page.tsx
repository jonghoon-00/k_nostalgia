import React from 'react';
import LoginHeader from './_components/LoginHeader';
import LoginForm from './_components/LoginForm';
import DesktopLoginLayout from './_components/DesktopLayout';

const LoginPage = () => {
  return (
    <>
      <div className="bg-normal flex flex-col items-center justify-center md:hidden">
        <LoginHeader />
        <LoginForm />
      </div>
      <div className="hidden md:flex bg-primary-20 md:min-h-screen md:justify-center md:items-center">
        <DesktopLoginLayout />
      </div>
    </>
  );
};

export default LoginPage;
