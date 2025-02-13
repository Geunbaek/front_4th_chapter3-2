describe('generateRepeatDates', () => {
  describe('startDate 검증', () => {
    it('startDate를 설정하면 해당 시점부터 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const occurrences = 2;

      // Act
      const repeatDates = generateRepeatDates({ startDate, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-08', '2025-02-09']);
    });
  });

  describe('endDate 검증', () => {
    it('endDate를 설정하면 startDate부터 endDate까지 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const endDate = '2025-02-09';
      const occurrences = 20;

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-08', '2025-02-09']);
    });

    it('endDate를 생략하면 startDate부터 2025년 6월 30일까지 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-04-30';
      const frequency = 'monthly';

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency });

      // Assert
      expect(repeatDates).toMatchObject(['2025-04-30', '2025-05-30', '2025-06-30']);
    });
  });

  describe('frequency 검증', () => {
    it('frequency를 생략하면 daily로 설정되어 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const endDate = '2025-02-09';

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-08', '2025-02-09']);
    });

    it('frequency를 daily로 설정하면 매일 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const endDate = '2025-02-09';

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-08', '2025-02-09']);
    });

    it('frequency를 daily로 설정하고 월이 넘어가는 경우에도 정상적으로 동작한다.', () => {
      // Arrange
      const startDate = '2025-02-25';
      const endDate = '2025-03-02';

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate });

      // Assert
      expect(repeatDates).toMatchObject([
        '2025-02-25',
        '2025-02-26',
        '2025-02-27',
        '2025-02-28',
        '2025-03-01',
        '2025-03-02',
      ]);
    });

    it('frequency를 daily로 설정하고 해가 넘어가는 경우에도 정상적으로 동작한다.', () => {
      // Arrange
      const startDate = '2024-12-30';
      const endDate = '2025-01-02';

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate });

      // Assert
      expect(repeatDates).toMatchObject(['2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02']);
    });

    it('frequency를 weekly로 설정하면 매달 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-01';
      const frequency = 'weekly';
      const occurrences = 4;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-01', '2025-02-08', '2025-02-15', '2025-02-22']);
    });

    it('frequency를 weekly로 설정하고 달이 넘어가는 경우에도 정상적으로 동작한다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const frequency = 'weekly';
      const occurrences = 5;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2025-02-08',
        '2025-02-15',
        '2025-02-22',
        '2025-03-01',
        '2025-03-08',
      ]);
    });

    it('frequency를 weekly로 설정하고 해가 넘어가는 경우에도 정상적으로 동작한다.', () => {
      // Arrange
      const startDate = '2024-12-20';
      const frequency = 'weekly';
      const occurrences = 5;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2024-12-20',
        '2024-12-27',
        '2025-01-03',
        '2025-01-10',
        '2025-01-17',
      ]);
    });

    it('frequency를 monthly로 설정하면 매달 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-02-08';
      const frequency = 'monthly';
      const occurrences = 4;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-02-08', '2025-03-08', '2025-04-08', '2025-05-08']);
    });

    it('frequency를 monthly로 설정하고 해가 넘어가는 경우에도 정상적으로 동작한다.', () => {
      // Arrange
      const startDate = '2024-12-20';
      const frequency = 'monthly';
      const occurrences = 5;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2024-12-20',
        '2025-01-20',
        '2025-02-20',
        '2025-03-20',
        '2025-04-20',
      ]);
    });

    it('31일을 기준으로 monthly로 설정하면 31일이 포함된 달만 반환된다.', () => {
      // Arrange
      const startDate = '2025-01-31';
      const frequency = 'monthly';

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency });

      // Assert
      expect(repeatDates).toMatchObject(['2025-01-31', '2025-03-31', '2025-05-31']);
    });

    it('frequency를 yearly로 설정하면 매년 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2024-02-08';
      const frequency = 'yearly';
      const occurrences = 2;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2024-02-08', '2025-02-08']);
    });

    it('2월 29일을 기준으로 yearly로 설정하면 윤년만 반환된다.', () => {
      // Arrange
      const startDate = '2016-02-29';
      const frequency = 'yearly';

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency });

      // Assert
      expect(repeatDates).toMatchObject(['2016-02-29', '2020-02-29', '2024-02-29']);
    });
  });

  describe('interval 검증', () => {
    it('frequency를 daily로 설정하고 interval을 생략하면 매일 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-04-08';
      const frequency = 'daily';
      const occurrences = 3;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-04-08', '2025-04-09', '2025-04-10']);
    });

    it('frequency를 daily로 설정하고 interval을 3으로 설정하면 3일마다 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-04-08';
      const frequency = 'daily';
      const interval = 3;
      const occurrences = 3;

      // Act
      const repeatDates = generateRepeatDates({ startDate, interval, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-04-08', '2025-04-11', '2025-04-14']);
    });

    it('frequency를 monthly로 설정하고 interval을 2으로 설정하면 2달마다 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-01-08';
      const frequency = 'monthly';
      const interval = 2;
      const occurrences = 3;

      // Act
      const repeatDates = generateRepeatDates({ startDate, interval, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2025-01-08', '2025-03-08', '2025-05-08']);
    });

    it('frequency를 yearly로 설정하고 interval을 2으로 설정하면 2년마다 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2020-01-08';
      const frequency = 'yearly';
      const interval = 2;
      const occurrences = 3;

      // Act
      const repeatDates = generateRepeatDates({ startDate, interval, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject(['2020-01-08', '2022-01-08', '2024-01-08']);
    });
  });

  describe('occurrences 검증', () => {
    it('occurrences를 생략하면 endDate까지 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-04-15';
      const frequency = 'monthly';

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency });

      // Assert
      expect(repeatDates).toMatchObject(['2025-04-15', '2025-05-15', '2025-06-15']);
    });

    it('occurrences를 설정하면 그 값만큼 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2025-04-15';
      const frequency = 'daily';
      const occurrences = 5;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2025-04-15',
        '2025-04-16',
        '2025-04-17',
        '2025-04-18',
        '2025-04-19',
      ]);
    });

    it('occurrences이 설정되어 있어도 endDate 내의 반복일정만 반환된다.', () => {
      // Arrange
      const startDate = '2025-04-15';
      const endDate = '2025-04-20';
      const frequency = 'daily';
      const occurrences = 20;

      // Act
      const repeatDates = generateRepeatDates({ startDate, endDate, frequency, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2025-04-15',
        '2025-04-16',
        '2025-04-17',
        '2025-04-18',
        '2025-04-19',
        '2025-04-20',
      ]);
    });
  });

  describe('isLastDayOfMonth 검증', () => {
    it('isLastDayOfMonth이 생략되면 startDate의 일자를 기준으로 반복일정이 생성된다', () => {
      // Arrange
      const startDate = '2024-01-31';
      const frequency = 'monthly';
      const interval = 1;
      const occurrences = 5;

      // Act
      const repeatDates = generateRepeatDates({ startDate, frequency, interval, occurrences });

      // Assert
      expect(repeatDates).toMatchObject([
        '2024-01-31',
        '2024-03-31',
        '2024-05-31',
        '2024-07-31',
        '2024-08-31',
      ]);
    });

    it('isLastDayOfMonth를 true로 설정하면 달의 마지막 날을 기준으로 반복일정이 생성된다.', () => {
      // Arrange
      const startDate = '2024-01-31';
      const frequency = 'monthly';
      const interval = 1;
      const occurrences = 5;
      const isLastDayOfMonth = true;

      // Act
      const repeatDates = generateRepeatDates({
        startDate,
        frequency,
        interval,
        occurrences,
        isLastDayOfMonth,
      });

      // Assert
      expect(repeatDates).toMatchObject([
        '2024-01-31',
        '2024-02-29',
        '2024-03-31',
        '2024-04-30',
        '2024-05-31',
      ]);
    });
  });

  it('2024년 1월 31일 기준으로 매달 5번 반복하면 31일이 있는 달만 5번 반환된다.', () => {
    // Arrange
    const startDate = '2024-01-31';
    const frequency = 'monthly';
    const interval = 1;
    const occurrences = 5;

    // Act
    const repeatDates = generateRepeatDates({ startDate, frequency, interval, occurrences });

    // Assert
    expect(repeatDates).toMatchObject([
      '2024-01-31',
      '2024-03-31',
      '2024-05-31',
      '2024-07-31',
      '2024-08-31',
    ]);
  });

  it('2024년 1월 31일 기준으로 3달 간격으로 2번 반복하면 31일이 있는 달만 2번 반환된다.', () => {
    // Arrange
    const startDate = '2024-01-31';
    const frequency = 'monthly';
    const interval = 3;
    const occurrences = 2;

    // Act
    const repeatDates = generateRepeatDates({ startDate, frequency, interval, occurrences });

    // Assert
    expect(repeatDates).toMatchObject(['2024-01-31', '2024-07-31']);
  });

  it('2024년 2월 29일(윤달) 기준으로 매년 2번 2024-02-29일 만 반환된다.', () => {
    // Arrange
    const startDate = '2024-02-29';
    const frequency = 'yearly';
    const interval = 1;
    const occurrences = 2;

    // Act
    const repeatDates = generateRepeatDates({ startDate, frequency, interval, occurrences });

    // Assert
    expect(repeatDates).toMatchObject(['2024-02-29']);
  });
});
