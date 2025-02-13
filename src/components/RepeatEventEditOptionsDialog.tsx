import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef } from 'react';

import { Event, EventForm, RepeatEventEditMode } from '../types';

interface RepeatEventEditOptionsDialogProps {
  events: Event[];
  isOpen: boolean;
  savedEvent: Event;
  repeatEditMode: RepeatEventEditMode;
  setRepeatEditMode: Dispatch<SetStateAction<RepeatEventEditMode>>;
  checkOverlap: (event: Event | EventForm) => boolean;
  checkEventListOverlap: (events: Event[] | EventForm[]) => boolean;
  openOverlapDialog: () => void;
  onConfirm: (event: Event, repeatEditMode?: 'all' | 'single') => void;
  close: () => void;
}

function RepeatEventEditOptionsDialog({
  events,
  isOpen,
  savedEvent,
  repeatEditMode,
  setRepeatEditMode,
  checkOverlap,
  checkEventListOverlap,
  onConfirm,
  close,
  openOverlapDialog,
}: RepeatEventEditOptionsDialogProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    if (repeatEditMode === 'all') {
      if (savedEvent.repeat.type === 'none') return;

      const repeatEvents = events
        .filter((event) => event.repeat.id === savedEvent.repeat.id)
        .map((event) => ({ ...savedEvent, id: event.id, date: event.date }));
      if (checkEventListOverlap(repeatEvents)) {
        openOverlapDialog();
        return;
      }
    } else {
      if (checkOverlap(savedEvent)) {
        openOverlapDialog();
        return;
      }
    }
    onConfirm(savedEvent, repeatEditMode);
    close();
  };

  return (
    <Modal initialFocusRef={ref} isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>반복 일정 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <RadioGroup
              onChange={(value) => setRepeatEditMode(value as RepeatEventEditMode)}
              value={repeatEditMode}
            >
              <Stack direction="row">
                <Radio value="all">모든 일정</Radio>
                <Radio value="single">이 일정</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            확인
          </Button>
          <Button onClick={close}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RepeatEventEditOptionsDialog;
