import { test, expect } from '@playwright/test';

/**
 * 1. 사용자 김항해는 매주 월요일 오전 10시에 있는 팀 회의를 캘린더에 등록하려고 한다.
 * 2. 김항해는 새 일정 추가 버튼을 클릭하고 다음과 같이 정보를 입력한다:
 *   - 제목: "주간 팀 회의"
 *   - 날짜: 2025년 2월 3일 (월요일)
 *   - 시작 시간: 오전 10:00
 *   - 종료 시간: 오전 11:00
 *   - 위치: "회의실 A"
 *   - 설명: "주간 업무 보고 및 계획 수립"
 * 3. 반복 일정을 체크하고 반복 설정에서 "매주"를 선택하고, 반복 간격을 1주로 설정한다.
 * 4. 반복 종료 조건으로 "종료일"을 선택하고, 2025년 3월 31일로 설정한다.
 * 5. 알림 설정을 "10분 전"으로 선택한다.
 * 6. 일정을 저장하면, 캘린더에 2024년 7월 1일부터 12월 30일까지 매주 월요일마다 해당 회의가 표시된다.
 * 7. 3월부터 회의 시간이 30분 연장되어, 김철수는 모든 회의 시간을 수정하려고 한다.
 * 8. 3월 3일 일정을 선택하고 종료 시간을 오전 11:30으로 변경한고, 모든 일정에 적용한다.
 * 9. 변경 사항을 저장하면, 모든 회의 일정이 10:00-11:30으로 업데이트된다.
 * 10. 3월 3일 월요일이 휴가라는 것을 알게 된 김철수는 해당 날짜의 회의를 취소하려고 한다.
 * 11. 3월 3일 일정을 선택하고 "이 일정만 삭제" 옵션을 선택하여 해당 날짜의 회의만 삭제한다.
 * 12. 해당 팀 회의가 취소되어 모든 일정을 삭제하려고 한다.
 * 13. 해당 반복 일정을 삭제하고 "모든 일정" 옵션을 선택하여 모든 반복 일정을 삭제한다.
 */

test('시나리오 테스트', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: '제목' }).fill('주간 팀 회의');

  await page.getByRole('textbox', { name: '날짜' }).fill('2025-02-03');
  await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
  await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
  await page.getByRole('textbox', { name: '위치' }).fill('회의실A');
  await page.getByRole('textbox', { name: '설명' }).fill('주간 업무 보고 및 계획 수립');
  await page.getByText('반복 일정').click();
  await page.getByLabel('반복 유형').selectOption('weekly');
  await page.getByLabel('종료 유형').selectOption('endDate');

  await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-03-31');
  await page.getByTestId('event-submit-button').click();

  await page.getByText('일정이 추가되었습니다.').waitFor();
  await expect(page.locator('text=10:00 - 11:00')).toHaveCount(4);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('text=10:00 - 11:00')).toHaveCount(5);

  await page.getByRole('button', { name: 'Edit event' }).first().click();
  await page.getByRole('textbox', { name: '종료 시간' }).fill('11:30');
  await page.getByTestId('event-submit-button').click();
  await page.getByText('모든 일정').click();
  await page.getByRole('button', { name: '확인' }).click();

  await page.getByText('일정이 수정되었습니다.').waitFor();
  await expect(page.locator('text=10:00 - 11:30')).toHaveCount(5);

  await page.getByRole('button', { name: 'Delete event' }).first().click();
  await page.getByText('이 일정').click();
  await page.getByRole('button', { name: '확인' }).click();

  await page.getByText('일정이 삭제되었습니다.').waitFor();
  await expect(page.locator('text=10:00 - 11:30')).toHaveCount(4);

  await page.getByRole('button', { name: 'Delete event' }).first().click();
  await page.getByText('모든 일정').click();
  await page.getByRole('button', { name: '확인' }).click();

  await expect(page.locator('text=10:00 - 11:30')).toHaveCount(0);
});
