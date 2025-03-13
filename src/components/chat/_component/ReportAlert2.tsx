'use client';

import { BackButton } from '@/components/icons/BackButton';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tables } from '@/types/supabase';
import { useState } from 'react';
import ReportConfirmAlert from './ReportConfirmAlert';

interface ReportAlertProps {
  handleReport: (report: { reportedContent: string; reportedDetailContent: string }) => void;
  cancelReport: () => void;
  setSelectedChatRoom: React.Dispatch<
    React.SetStateAction<Tables<'rooms'> | null>
  >;
}

const ReportAlert2 = ({
  handleReport,
  cancelReport,
  setSelectedChatRoom
}: ReportAlertProps) => {
  const [reportContent, setReportContent] = useState<string>('');
  const [reportedDetailContent, setReportedDetailContent] = useState<string>('');
  const [reportConfirmAlert, setReportConfirmAlert] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClickReportConfirmAlert = () => {
    setReportConfirmAlert(true);
  };

  const onHandleReport = async () => {
    if (!reportContent || !reportedDetailContent) {
      alert('신고 유형과 내용을 모두 입력해주세요.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      await handleReport({
        reportedContent: reportContent,
        reportedDetailContent: reportedDetailContent,
      });
      setReportConfirmAlert(false);
    } catch (error) {
      console.error('Report submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  console.log(reportContent, reportedDetailContent)

  return (
    <DialogContent className="bg-normal w-[330px] h-[627px] rounded-2xl md:w-[479px] md:h-[710px]">
      <div className="border-b-2 w-[calc(100%+32px)] -mx-4">
        <DialogHeader>
          <DialogTitle className="flex pt-3 px-3 pb-2 font-semibold text-lg leading-[28.8px] justify-between">
            {/* TODO 백버튼이 있다면 어디로 가야할지 디자이너님이랑 회의 */}
            <button onClick={() => setSelectedChatRoom(null)}>
              <BackButton />
            </button>
            <div>신고하기</div>
            <div className="invisible w-7" />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </div>

      {/* 신고 주의 사항 */}
      <div className="flex flex-col mb-3 w-full justify-center items-center text-status-negative">
        {/* 아이콘 추가 */}
        <div>! 주의사항</div>
        <div className='text-[#ED1B18] text-'>
          사용자 신고시 상대방의 모든 메세지가 차단됩니다. 신고 후 취소가
          불가능하니 신중히 판단 후 신고를 접수해 주세요.
          <br />
          또한, 신고 처리를 위해 대화 내용의 일부가 향그리움 팀에 전송됨에
          동의하는 것으로 간주합니다.
        </div>
      </div>

      {/* 신고 유형 */}
      <div className="flex flex-col">
        <div className="text-label-strong text-base font-medium leading-[25.6px]">
          신고 유형
        </div>
        <Select onValueChange={(value) => setReportContent(value)}>
          <SelectTrigger className="border-[#959595] bg-[#FEFEFE] rounded-[8px]">
            <SelectValue
              placeholder="신고 유형을 선택해 주세요"
              className="text-label-assistive overflow-hidden text-sm leading-[22.4px] font-normal"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#FEFEFE]">
            <SelectItem value="1.허위정보기재">허위 정보를 기재</SelectItem>
            <SelectItem value="2.권리침해행위또는개인정보기재">
              권리 침해 행위 또는 개인 정보 게재
            </SelectItem>
            <SelectItem value="3.비방욕설">비방, 욕설 행위</SelectItem>
            <SelectItem value="4.기타">기타</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 신고 내용 */}
      <div className="flex flex-col gap-2">
        <div className="text-label-strong text-base font-medium leading-[25.6px]">
          신고 내용
        </div>
        <input
          placeholder="사용자 신고 이유를 자세하게 작성해 주세요"
          className="h-[172px] p-3 shrink-0 self-stretch border-[#959595] bg-[#FEFEFE] rounded-lg text-label-assistive overflow-hidden text-sm leading-[22.4px] font-normal"
          value={reportedDetailContent}
          onChange={(event) => setReportedDetailContent(event.target.value)}
        />
      </div>

      {/* 신고시 주의 사항 */}
      <div>
        신고 제출 이후 향그리움 팀에서 조사를 시작하며, 이때 사실 관계 확인을
        위해 신고자에게 객관적인 자료를 요청할 수 있습니다.
        <br />
        신고자 정보 및 신고 내용은 신고 대상에게 공개되지 않으나, 사실 관계
        확인을 위해 필요한 신고 내용의 경우 일부 언급될 수 있다는 점 미리
        알려드립니다.
      </div>

      {/* 푸터 */}
      <div className="border-t-2 w-[calc(100%+32px)] -mx-4">
        <DialogFooter className="flex items-center">
          <Button
            type="button"
            className={`h-12 px4 py-3 flex justify-center items-center self-stretch rounded-xl text-label-light ${
              reportContent && reportedDetailContent ? 'bg-primary-20' : 'bg-label-disable'
            } hover:bg-primary-10`}
            disabled={!reportContent || !reportedDetailContent}
            aria-label="신고 접수하기"
            onClick={onClickReportConfirmAlert}
          >
            접수하기
          </Button>
          {reportConfirmAlert && (
          <ReportConfirmAlert handleReport={onHandleReport}/>
        )}
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default ReportAlert2;
