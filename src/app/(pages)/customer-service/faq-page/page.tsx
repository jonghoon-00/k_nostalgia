import FAQContainer from './components/FAQContainer';

const Announcement = ({ searchParams }: { searchParams: { q?: string } }) => {
  const { q } = searchParams;

  return <FAQContainer initialQuery={q ?? ''} />;
};

export default Announcement;
