'use client';
import React from 'react';
import FAQListView from './FAQListView';
import { useFaq } from './useFaq';

interface Props {
  initialQuery: string;
}
const FAQContainer: React.FC<Props> = ({ initialQuery }) => {
  const { filteredList, openIds, toggle } = useFaq(initialQuery);

  return (
    <FAQListView items={filteredList} openIds={openIds} onToggle={toggle} />
  );
};

export default FAQContainer;
