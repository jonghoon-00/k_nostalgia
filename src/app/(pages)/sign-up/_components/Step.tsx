interface Step {
  label: string;
  type: string;
  placeholder: string;
  title: string;
  key: string;
}

const steps: Step[] = [
  {
    label: '이메일',
    title: '어떤 이메일을 사용하시겠어요?',
    placeholder: '이메일을 입력해주세요',
    type: 'text',
    key: 'email'
  },
  {
    label: '비밀번호',
    title: '비밀번호는 무엇으로 할까요?',
    placeholder: '비밀번호를 입력해주세요',
    type: 'password',
    key: 'password'
  },
  {
    label: '이름',
    title: '성함이 어떻게 되시나요?',
    placeholder: '이름',
    type: 'text',
    key: 'name'
  },
  {
    label: '사용할 별명',
    title: '저희가 어떻게 불러드리면 될까요?',
    placeholder: '사용할 별명',
    type: 'text',
    key: 'nickname'
  }
];

export default steps;
