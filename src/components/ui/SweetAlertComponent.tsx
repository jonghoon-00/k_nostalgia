import Swal from 'sweetalert2';

interface AlertOptions {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

/**
 * 재사용 가능한 Alert 컴포넌트
 * @param {Object} options - Alert 옵션
 * @param {string} options.title - Alert 제목
 * @param {string} options.message - Alert 메시지 내용
 * @param {string} [options.confirmButtonText='확인'] - 확인 버튼 텍스트
 * @param {string} [options.cancelButtonText='취소'] - 취소 버튼 텍스트
 * @param {Function} [options.onConfirm] - 확인 버튼 클릭 시 실행할 함수
 * @param {Function} [options.onCancel] - 취소 버튼 클릭 시 실행할 함수
 * @param {boolean} [options.showCancelButton=true] - 취소 버튼 표시 여부
 * @param {string} [options.confirmButtonColor='#f2f2f2'] - 확인 버튼 색상
 * @param {string} [options.cancelButtonColor='#9C6D2E'] - 취소 버튼 색상
 * @returns {Promise} SweetAlert2 Promise
 */
export const showCustomAlert = ({
  title,
  message,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  onConfirm,
  onCancel,
  showCancelButton = true,
  confirmButtonColor = '#f2f2f2',
  cancelButtonColor = '#9C6D2E'
}: AlertOptions) => {
  return Swal.fire({
    title: title,
    html: `
      <div id="swal2-html-container" class="swal2-html-container" style="padding:0 !important; margin:-1rem; font-size:16px;">
        ${message}
      </div>
    `,
    showCancelButton: showCancelButton,
    cancelButtonColor: cancelButtonColor,
    confirmButtonColor: confirmButtonColor,
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
    customClass: {
      title: 'text-xl mt-10 md:mb-[8px]',
      popup: 'rounded-[16px]',
      actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
      confirmButton:
        'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
      cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
    }
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    } else if (result.isDismissed && onCancel) {
      onCancel();
    }
    return result;
  });
};
