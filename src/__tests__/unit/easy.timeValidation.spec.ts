import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    // Arrange
    const start = '13:00';
    const end = '12:00';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    });
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    // Arrange
    const start = '13:00';
    const end = '13:00';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    });
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    // Arrange
    const start = '13:00';
    const end = '13:10';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: null,
      startTimeError: null,
    });
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    // Arrange
    const start = '';
    const end = '13:10';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: null,
      startTimeError: null,
    });
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    // Arrange
    const start = '13:00';
    const end = '';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: null,
      startTimeError: null,
    });
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    // Arrange
    const start = '';
    const end = '';

    // Act
    const timeErrorMessage = getTimeErrorMessage(start, end);

    // Assert
    expect(timeErrorMessage).toEqual({
      endTimeError: null,
      startTimeError: null,
    });
  });
});
