import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';
import clsx from 'clsx';

export const FAQListView = ({
  items,
  onToggle,
  openIds
}: {
  items: any[];
  openIds: Set<number>;
  onToggle: (id: number) => void;
}) => {
  return (
    <>
      <div
        className={clsx(
          'hidden md:flex',
          'text-label-strong text-2xl font-semibold',
          'mb-7'
        )}
      >
        자주 묻는 질문
      </div>

      <ul className="w-full mx-auto mt-14">
        {items.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </li>
        )}

        {items.map((item) => {
          const regionId = `panel-${item.id}`;
          const btnId = `btn-${item.id}`;
          const isOpen = openIds.has(item.id);

          return (
            <li
              key={item.id}
              className={clsx('border-b border-[#E0E0E0]')}
              onClick={(e) => {
                e.preventDefault();
                history.replaceState?.(null, '', `#${item.id}`);
                onToggle(item.id);
              }}
            >
              <div
                className={clsx(
                  'flex justify-between items-center',
                  'mt-6',
                  'cursor-pointer'
                )}
              >
                {/* 좌측: Q, 카테고리, 질문 */}
                <div
                  className={clsx(
                    'flex items-start md:items-center gap-1',
                    'md:gap-6',
                    'md:pl-6'
                  )}
                >
                  <span
                    className={clsx('text-primary-10', 'text-xl font-semibold')}
                  >
                    Q
                  </span>
                  {item.category && (
                    <span
                      className={clsx(
                        'text-primary-20 font-semibold',
                        'text-base',
                        'min-h-6',
                        'whitespace-nowrap inline-block'
                      )}
                    >
                      [ {item.category} ]
                    </span>
                  )}
                  <a
                    href={`#${item.id}`}
                    className={clsx(
                      'text-label-strong font-semibold',
                      'text-base font-normal'
                    )}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.question}
                  </a>
                </div>

                {/* 우측: 날짜(옵션) + 토글 버튼 */}
                <div className={clsx('flex items-center', 'gap-6')}>
                  {item.date && (
                    <span
                      className={clsx(
                        'hidden md:flex md:mt-0',
                        'text-label-assistive text-sm font-normal'
                      )}
                    >
                      {item.date}
                    </span>
                  )}
                  <button
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={regionId}
                    className={clsx(
                      'cursor-pointer rounded border border-label-assistive p-0.5',
                      'transition-transform duration-200',
                      isOpen ? 'rotate-180' : 'rotate-0 bg-primary-20'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(item.id);
                    }}
                    title={isOpen ? '접기' : '펼치기'}
                  >
                    {isOpen ? <UpButton /> : <DownButton color={'#F2F2F2'} />}
                  </button>
                </div>
              </div>

              {/* 모바일 전용 날짜 */}
              {item.date && (
                <div
                  className={clsx(
                    'md:hidden',
                    'text-label-assistive text-sm font-normal mt-1'
                  )}
                >
                  {item.date}
                </div>
              )}

              {/* 펼친 내용 */}
              <div
                id={regionId}
                role="region"
                aria-labelledby={btnId}
                aria-hidden={!isOpen}
                className={clsx(
                  'md:pl-[70px] text-label-strong text-sm font-normal',
                  // grid-rows 애니메이션
                  'grid transition-all duration-300 ease-in-out motion-reduce:transition-none',
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100 pt-8'
                    : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden space-y-5 pb-7 will-change-[grid-template-rows]">
                  {Array.isArray(item.answer) ? (
                    item.answer.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    ))
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {String(item.answer ?? '')}
                    </p>
                  )}

                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className={clsx(
                        'text-primary-20',
                        'underline font-normal',
                        'mt-2'
                      )}
                    >
                      {(item.category ?? '담당') + ' 관리자 이메일 (클릭)'}
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default FAQListView;
