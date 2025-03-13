import { SectionBanner } from './_components/SectionBanner';
import { SectionFood } from './_components/SectionFood';
import { SectionMarket } from './_components/SectionMarket';
import { SectionVideo } from './_components/SectionVideo';

const Homepage = () => {
  return (
    <>
      <SectionBanner />
      <SectionVideo />
      <SectionFood />
      <SectionMarket />
    </>
  );
};

export default Homepage;
