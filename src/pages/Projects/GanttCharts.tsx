/**
 * Gantt Charts & Milestones Page
 * Author: VB Entreprise
 * 
 * Timeline view with draggable bars, milestone markers, and dependencies
 */

import React, { useState } from 'react';
import { Calendar, Flag, Link, Users, Clock, ChevronRight, ChevronDown } from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee: string;
  dependencies: string[];
  isMilestone: boolean;
  children?: GanttTask[];
  expanded?: boolean;
}

const mockGanttTasks: GanttTask[] = [
  {
    id: '1',
    name: 'Project Planning Phase',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-15'),
    progress: 100,
    assignee: 'Sarah Johnson',
    dependencies: [],
    isMilestone: false,
    expanded: true,
    children: [
      {
        id: '1.1',
        name: 'Requirements Gathering',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        progress: 100,
        assignee: 'Sarah Johnson',
        dependencies: [],
        isMilestone: false
      },
      {
        id: '1.2',
        name: 'Technical Specification',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-15'),
        progress: 100,
        assignee: 'Mike Chen',
        dependencies: ['1.1'],
        isMilestone: false
      }
    ]
  },
  {
    id: '2',
    name: 'Design Phase',
    startDate: new Date('2024-01-16'),
    endDate: new Date('2024-02-15'),
    progress: 75,
    assignee: 'Lisa Wong',
    dependencies: ['1'],
    isMilestone: false,
    expanded: true,
    children: [
      {
        id: '2.1',
        name: 'UI/UX Design',
        startDate: new Date('2024-01-16'),
        endDate: new Date('2024-02-01'),
        progress: 90,
        assignee: 'Lisa Wong',
        dependencies: ['1.2'],
        isMilestone: false
      },
      {
        id: '2.2',
        name: 'Design Review',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-01'),
        progress: 0,
        assignee: 'Sarah Johnson',
        dependencies: ['2.1'],
        isMilestone: true
      }
    ]
  },
  {
    id: '3',
    name: 'Development Phase',
    startDate: new Date('2024-02-16'),
    endDate: new Date('2024-03-31'),
    progress: 45,
    assignee: 'Development Team',
    dependencies: ['2'],
    isMilestone: false,
    expanded: false,
    children: [
      {
        id: '3.1',
        name: 'Frontend Development',
        startDate: new Date('2024-02-16'),
        endDate: new Date('2024-03-15'),
        progress: 60,
        assignee: 'John Doe',
        dependencies: ['2.2'],
        isMilestone: false
      },
      {
        id: '3.2',
        name: 'Backend Development',
        startDate: new Date('2024-02-16'),
        endDate: new Date('2024-03-20'),
        progress: 40,
        assignee: 'Mike Chen',
        dependencies: ['2.2'],
        isMilestone: false
      }
    ]
  }
];

export default function GanttCharts() {
  const [tasks, setTasks] = useState<GanttTask[]>(mockGanttTasks);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);

  const toggleTaskExpansion = (taskId: string) => {
    const updateTasks = (taskList: GanttTask[]): GanttTask[] => {
      return taskList.map(task => {
        if (task.id === taskId) {
          return { ...task, expanded: !task.expanded };
        }
        if (task.children) {
          return { ...task, children: updateTasks(task.children) };
        }
        return task;
      });
    };
    setTasks(updateTasks(tasks));
  };

  const getTaskDuration = (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskPosition = (startDate: Date) => {
    const projectStart = new Date('2024-01-01');
    const diffTime = startDate.getTime() - projectStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 20; // 20px per day
  };

  const getTaskWidth = (startDate: Date, endDate: Date) => {
    const duration = getTaskDuration(startDate, endDate);
    return Math.max(duration * 20, 20); // Minimum 20px width
  };

  const renderTask = (task: GanttTask, level: number = 0) => {
    const hasChildren = task.children && task.children.length > 0;
    
    return (
      <React.Fragment key={task.id}>
        <div className="flex items-center border-b border-gray-100 hover:bg-gray-50">
          {/* Task Name Column */}
          <div className="w-80 p-3 border-r border-gray-200">
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleTaskExpansion(task.id)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded"
                >
                  {task.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {task.isMilestone ? (
                <Flag className="h-4 w-4 text-orange-500 mr-2" />
              ) : (
                <div className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm font-medium text-gray-900">{task.name}</span>
            </div>
          </div>

          {/* Assignee Column */}
          <div className="w-32 p-3 border-r border-gray-200">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{task.assignee}</span>
            </div>
          </div>

          {/* Duration Column */}
          <div className="w-24 p-3 border-r border-gray-200">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {getTaskDuration(task.startDate, task.endDate)}d
              </span>
            </div>
          </div>

          {/* Gantt Chart Column */}
          <div className="flex-1 p-3 relative" style={{ minWidth: '600px' }}>
            <div className="relative h-8">
              {task.isMilestone ? (
                <div
                  className="absolute top-1 w-4 h-4 bg-orange-500 transform rotate-45"
                  style={{ left: `${getTaskPosition(task.startDate)}px` }}
                  title={`${task.name} - ${task.startDate.toLocaleDateString()}`}
                />
              ) : (
                <div
                  className="absolute top-2 h-4 bg-blue-500 rounded"
                  style={{
                    left: `${getTaskPosition(task.startDate)}px`,
                    width: `${getTaskWidth(task.startDate, task.endDate)}px`
                  }}
                >
                  <div
                    className="h-full bg-blue-700 rounded"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && task.expanded && task.children?.map(child => renderTask(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Gantt Charts & Milestones</h1>
          <p className="mt-2 text-gray-600">
            Timeline view with task dependencies, milestones, and progress tracking.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            View Options
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Link className="h-4 w-4" />
            Dependencies
          </button>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center border-b border-gray-200 bg-gray-50">
          <div className="w-80 p-3 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-900">Task Name</span>
          </div>
          <div className="w-32 p-3 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-900">Assignee</span>
          </div>
          <div className="w-24 p-3 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-900">Duration</span>
          </div>
          <div className="flex-1 p-3" style={{ minWidth: '600px' }}>
            <div className="flex justify-between text-sm font-medium text-gray-900">
              <span>Jan 2024</span>
              <span>Feb 2024</span>
              <span>Mar 2024</span>
              <span>Apr 2024</span>
            </div>
            {/* Timeline Grid */}
            <div className="mt-2 relative">
              {Array.from({ length: 120 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-gray-200"
                  style={{ left: `${i * 20}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {tasks.map(task => renderTask(task))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Task Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 rounded mr-2" />
            <span className="text-sm text-gray-600">Completed Work</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 transform rotate-45 mr-2" />
            <span className="text-sm text-gray-600">Milestone</span>
          </div>
          <div className="flex items-center">
            <Link className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Dependencies</span>
          </div>
        </div>
      </div>
    </div>
  );
}