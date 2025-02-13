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
import { useRef, useState } from 'react';

import { Event, RepeatEventEditMode } from '../types';

interface RepeatEventDeleteOptionsDialogProps {
  events: Event[];
  isOpen: boolean;
  deletedEvent: Event;
  onConfirm: (eventId: string | string[]) => void;
  close: () => void;
}

function RepeatEventDeleteOptionsDialog({
  events,
  isOpen,
  deletedEvent,
  onConfirm,
  close,
}: RepeatEventDeleteOptionsDialogProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [repeatDeleteMode, setRepeatDeleteMode] = useState<'all' | 'single'>('all');

  const handleConfirm = () => {
    if (repeatDeleteMode === 'all') {
      const repeatEventsIds = events
        .filter((event) => event.repeat.id === deletedEvent.repeat.id)
        .map((event) => event.id);
      onConfirm(repeatEventsIds);
    } else {
      onConfirm(deletedEvent.id);
    }
    close();
  };

  return (
    <Modal initialFocusRef={ref} isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>반복 일정 삭제</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <RadioGroup
              onChange={(value) => setRepeatDeleteMode(value as RepeatEventEditMode)}
              value={repeatDeleteMode}
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

export default RepeatEventDeleteOptionsDialog;
