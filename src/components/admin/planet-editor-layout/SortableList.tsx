import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { cn } from '@/lib/utils/cn';
import { SortableItem } from '@/components/admin/planet-editor-layout/SortableItem';

interface Props<T extends { id: string }> {
  id: string;
  className?: string;
  elements: T[];
  handleDragEnd: (event: DragEndEvent) => void;
  renderItem: (element: T, idx: number) => React.ReactNode;
}

const SortableList = <T extends { id: string }>({
  id,
  elements,
  handleDragEnd,
  renderItem,
  className,
}: Props<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      {elements.length > 0 && (
        <SortableContext
          items={elements.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className={cn('overflow-hidden space-y-2', className)}>
            {elements.map((element, idx) => (
              <SortableItem key={element.id} id={element.id}>
                {renderItem(element, idx)}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      )}
    </DndContext>
  );
};

export default SortableList;
