import { motion } from 'framer-motion'
import type { Ref } from 'react'
import { useDrag } from 'react-dnd'
import type { Task } from '~/types'
import TaskCard from './TaskCard'

interface DraggableTaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
}

const ItemTypes = {
  TASK: 'task',
}

export default function DraggableTaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: DraggableTaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <motion.div
      ref={drag as unknown as Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 0.95 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className={`cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
      }}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </motion.div>
  )
}

export { ItemTypes }
