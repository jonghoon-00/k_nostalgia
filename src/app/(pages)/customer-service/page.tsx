'use client';
import React, { useState } from 'react';
import CustomerContent from './_components/CustomerContent';

const CustomerPage = () => {
  return (
    <div className="md:flex md:flex-row">
      <div className="md:hidden">
        <CustomerContent />
      </div>
    </div>
  );
};

export default CustomerPage;
