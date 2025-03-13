import React, { useState } from 'react';

const ScrollButton = () => {
  const [selectedSection, setSelectedSection] =
    useState<string>('photos-section');

  const scrollToSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView();
    }
  };

  return (
    <div className="flex justify-around w-full h-12 bg-normal md:max-w-[1280px] md:mx-auto md:gap-10 md:justify-center md:mb-6 md:border-b-2 md:border-[#F2F2F2] md:mt-3">
      <button
        onClick={() => scrollToSection('photos-section')}
        className={`w-20 text-base font-medium text-label-assistive md:text-lg ${
          selectedSection === 'photos-section'
            ? 'w-20 border-b-4 border-primary-20 text-primary-20'
            : ''
        }`}
      >
        사진보기
      </button>
      <button
        onClick={() => scrollToSection('details-section')}
        className={`w-20 text-base font-medium text-label-assistive md:text-lg ${
          selectedSection === 'details-section'
            ? 'w-20 border-b-4 border-primary-20 text-primary-20'
            : ''
        }`}
      >
        상세정보
      </button>
      <button
        onClick={() => scrollToSection('recommend-section')}
        className={`w-20 text-base font-medium text-label-assistive md:text-lg ${
          selectedSection === 'recommend-section'
            ? 'w-20 border-b-4 border-primary-20 text-primary-20'
            : ''
        }`}
      >
        추천시장
      </button>
      <button
        onClick={() => scrollToSection('comments-section')}
        className={`w-20 text-base font-medium text-label-assistive md:text-lg ${
          selectedSection === 'comments-section'
            ? 'border-b-4 border-primary-20 text-primary-20'
            : ''
        }`}
      >
        댓글
      </button>
    </div>
  );
};

export default ScrollButton;
