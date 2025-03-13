import { redirect } from 'next/navigation';
import AdminPayHistory from './_components/AdminPayHistory';
import AdminReportChatHistory from './_components/AdminReportChatHistory';

const AdminPage = ({ params }: { params: { secret: string } }) => {
  if (params.secret !== process.env.SECRET_ADMIN_PATH) {
    redirect('/');
  }

  return (
    <div className="mt-20">
      <AdminPayHistory />
      <AdminReportChatHistory />
    </div>
  );
};
export default AdminPage;
